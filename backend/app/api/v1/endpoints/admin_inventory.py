from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import uuid

from app.core.database import get_db
from app.models import (
    LiquorItem, LiquorTransaction, RawMaterial, StockMovement,
    Supplier, PurchaseOrder, Recipe, RecipeIngredient, MenuItem
)

router = APIRouter()

# --- 1. LIQUOR & BAR INVENTORY ---
@router.get("/liquor")
def get_liquor_inventory(outlet_id: str = None, db: Session = Depends(get_db)):
    """Fetch brand-wise liquor stock, sealed bottles, open bottle levels, and reorder status."""
    q = db.query(LiquorItem)
    if outlet_id:
        q = q.filter(LiquorItem.outlet_id == outlet_id)
    items = q.order_by(LiquorItem.category, LiquorItem.brand_name).all()

    return [
        {
            "id": it.id,
            "brand_name": it.brand_name,
            "category": it.category,
            "bottle_volume_ml": it.bottle_volume_ml,
            "total_sealed_bottles": it.total_sealed_bottles,
            "open_bottle_remaining_ml": it.open_bottle_remaining_ml,
            "total_volume_available_ml": (it.total_sealed_bottles * it.bottle_volume_ml) + it.open_bottle_remaining_ml,
            "pegs_available_30ml": int(((it.total_sealed_bottles * it.bottle_volume_ml) + it.open_bottle_remaining_ml) / 30),
            "min_bottle_reorder": it.min_bottle_reorder,
            "is_low_stock": it.total_sealed_bottles <= it.min_bottle_reorder,
            "cost_per_bottle": it.cost_per_bottle,
            "selling_price_30ml": it.selling_price_30ml,
            "selling_price_60ml": it.selling_price_60ml,
            "excise_code": it.excise_code,
        }
        for it in items
    ]

@router.post("/liquor/transaction")
def log_liquor_transaction(payload: dict, db: Session = Depends(get_db)):
    """Log liquor consumption, complimentary drinks, breakage, or bottle opening."""
    liquor_item_id = payload.get("liquor_item_id")
    tx_type = payload.get("transaction_type") # "COMPLIMENTARY", "BREAKAGE", "BOTTLE_OPENED", "EXCISE_RECONCILIATION"
    volume_ml = int(payload.get("volume_ml", 30))
    steward_name = payload.get("steward_name", "Bar Manager")
    notes = payload.get("notes", "")

    item = db.query(LiquorItem).filter(LiquorItem.id == liquor_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Liquor item not found")

    if tx_type == "BOTTLE_OPENED":
        if item.total_sealed_bottles > 0:
            item.total_sealed_bottles -= 1
            item.open_bottle_remaining_ml += item.bottle_volume_ml
    elif tx_type in ["BREAKAGE", "COMPLIMENTARY", "EXCISE_RECONCILIATION"]:
        if item.open_bottle_remaining_ml >= volume_ml:
            item.open_bottle_remaining_ml -= volume_ml
        elif item.total_sealed_bottles > 0:
            item.total_sealed_bottles -= 1
            item.open_bottle_remaining_ml = (item.bottle_volume_ml + item.open_bottle_remaining_ml) - volume_ml

    tx = LiquorTransaction(
        outlet_id=item.outlet_id,
        liquor_item_id=item.id,
        transaction_type=tx_type,
        volume_ml=volume_ml,
        steward_name=steward_name,
        notes=notes
    )
    db.add(tx)
    db.commit()

    return {"success": True, "sealed_bottles": item.total_sealed_bottles, "open_ml": item.open_bottle_remaining_ml}

# --- 2. RESTAURANT RAW MATERIALS ---
@router.get("/raw-materials")
def get_raw_materials(outlet_id: str = None, db: Session = Depends(get_db)):
    """Fetch raw materials, current stocks, unit costs, and reorder alerts."""
    q = db.query(RawMaterial)
    if outlet_id:
        q = q.filter(RawMaterial.outlet_id == outlet_id)
    materials = q.order_by(RawMaterial.category, RawMaterial.name).all()

    return [
        {
            "id": m.id,
            "name": m.name,
            "sku": m.sku,
            "category": m.category,
            "unit": m.unit,
            "current_stock": m.current_stock,
            "min_reorder_level": m.min_reorder_level,
            "cost_per_unit": m.cost_per_unit,
            "total_inventory_value": round(m.current_stock * m.cost_per_unit, 2),
            "is_low_stock": m.current_stock <= m.min_reorder_level,
        }
        for m in materials
    ]

@router.post("/raw-materials/movement")
def log_stock_movement(payload: dict, db: Session = Depends(get_db)):
    """Record stock in/out, purchase receipt, or wastage."""
    raw_material_id = payload.get("raw_material_id")
    movement_type = payload.get("movement_type") # "PURCHASE_RECEIPT", "WASTAGE_SPOILAGE", "INTERNAL_TRANSFER"
    quantity = float(payload.get("quantity", 0.0))
    reason = payload.get("reason", "")

    mat = db.query(RawMaterial).filter(RawMaterial.id == raw_material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Raw material not found")

    if movement_type == "PURCHASE_RECEIPT":
        mat.current_stock += quantity
    else:
        mat.current_stock = max(0.0, mat.current_stock - quantity)

    mv = StockMovement(
        outlet_id=mat.outlet_id,
        raw_material_id=mat.id,
        movement_type=movement_type,
        quantity=quantity,
        unit=mat.unit,
        reason=reason
    )
    db.add(mv)
    db.commit()

    return {"success": True, "new_stock": mat.current_stock, "unit": mat.unit}

# --- 3. SUPPLIERS & PURCHASE ORDERS ---
@router.get("/suppliers")
def get_suppliers(outlet_id: str = None, db: Session = Depends(get_db)):
    q = db.query(Supplier)
    if outlet_id:
        q = q.filter(Supplier.outlet_id == outlet_id)
    return q.all()

@router.get("/purchase-orders")
def get_purchase_orders(outlet_id: str = None, db: Session = Depends(get_db)):
    q = db.query(PurchaseOrder)
    if outlet_id:
        q = q.filter(PurchaseOrder.outlet_id == outlet_id)
    orders = q.order_by(PurchaseOrder.created_at.desc()).all()

    results = []
    for po in orders:
        sup = db.query(Supplier).filter(Supplier.id == po.supplier_id).first()
        results.append({
            "id": po.id,
            "po_number": po.po_number,
            "supplier_name": sup.name if sup else "Vendor",
            "order_date": po.order_date,
            "expected_delivery": po.expected_delivery,
            "total_amount": po.total_amount,
            "status": po.status,
            "items": po.items_json
        })
    return results

@router.post("/purchase-orders")
def create_purchase_order(payload: dict, db: Session = Depends(get_db)):
    outlet_id = payload.get("outlet_id")
    supplier_id = payload.get("supplier_id")
    items = payload.get("items", [])
    total_amount = float(payload.get("total_amount", 0.0))

    po_number = f"KB-PO-{datetime.now().strftime('%Y%m')}-{str(uuid.uuid4())[:5].upper()}"

    po = PurchaseOrder(
        outlet_id=outlet_id,
        supplier_id=supplier_id,
        po_number=po_number,
        order_date=datetime.now().strftime("%Y-%m-%d"),
        expected_delivery=payload.get("expected_delivery", "2026-11-20"),
        total_amount=total_amount,
        status="ORDERED",
        items_json=items
    )
    db.add(po)
    db.commit()
    return {"success": True, "po_number": po_number, "status": "ORDERED"}

# --- 4. RECIPES & COSTING ---
@router.get("/recipes")
def get_recipes(outlet_id: str = None, db: Session = Depends(get_db)):
    """Fetch recipe costings and gross margins."""
    recipes = [
        {
            "id": "rec-1",
            "menu_item_name": "Charcoal Kalmi Kebab",
            "category": "Starters",
            "food_cost": 124.0,
            "selling_price": 440.0,
            "gross_margin_percent": 71.8,
            "yield": "1 Portion (2 Pcs)",
            "ingredients": [
                {"name": "Fresh Chicken Drumsticks", "quantity": "0.35 KG", "cost": 84.0},
                {"name": "Hung Curd & Marinade Spices", "quantity": "0.08 KG", "cost": 22.0},
                {"name": "Amul Desi Cow Ghee", "quantity": "0.03 KG", "cost": 18.0},
            ]
        },
        {
            "id": "rec-2",
            "menu_item_name": "Old Delhi Butter Chicken",
            "category": "Main Course",
            "food_cost": 145.0,
            "selling_price": 490.0,
            "gross_margin_percent": 70.4,
            "yield": "1 Handi Bowl (450g)",
            "ingredients": [
                {"name": "Boneless Chicken Thigh Tikka", "quantity": "0.28 KG", "cost": 72.0},
                {"name": "San Marzano Makhani Gravy", "quantity": "0.25 L", "cost": 38.0},
                {"name": "Heavy Dairy Cream & Butter", "quantity": "0.06 KG", "cost": 35.0},
            ]
        },
        {
            "id": "rec-3",
            "menu_item_name": "KICK BUNK 24-Hour Dal Makhani",
            "category": "Main Course",
            "food_cost": 68.0,
            "selling_price": 375.0,
            "gross_margin_percent": 81.8,
            "yield": "1 Handi Bowl (400g)",
            "ingredients": [
                {"name": "Whole Black Urad Lentils", "quantity": "0.15 KG", "cost": 21.75},
                {"name": "White Butter & Cow Cream", "quantity": "0.06 KG", "cost": 34.0},
                {"name": "Tomato Reduction & Spices", "quantity": "0.10 KG", "cost": 12.25},
            ]
        },
        {
            "id": "rec-4",
            "menu_item_name": "Smoked Bourbon Old Fashioned",
            "category": "Craft Cocktails",
            "food_cost": 142.0,
            "selling_price": 580.0,
            "gross_margin_percent": 75.5,
            "yield": "1 Cocktail (180ml)",
            "ingredients": [
                {"name": "Buffalo Trace Bourbon", "quantity": "60 ml", "cost": 116.0},
                {"name": "Angostura Bitters & Demerara", "quantity": "1 Dash", "cost": 16.0},
                {"name": "Hand-Carved Ice & Applewood Smoke", "quantity": "1 Set", "cost": 10.0},
            ]
        },
        {
            "id": "rec-5",
            "menu_item_name": "Glenfiddich 12 Yrs Speyside (30ml Peg)",
            "category": "Single Malt",
            "food_cost": 152.0,
            "selling_price": 650.0,
            "gross_margin_percent": 76.6,
            "yield": "1 Peg (30 ml)",
            "ingredients": [
                {"name": "Glenfiddich 12 Yrs Single Malt", "quantity": "30 ml", "cost": 152.0},
            ]
        }
    ]
    return recipes
