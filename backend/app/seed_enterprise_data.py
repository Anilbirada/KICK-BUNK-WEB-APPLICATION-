import logging
from app.core.database import SessionLocal
from app.models import (
    Outlet, Employee, StaffAttendance, CashierShift, Supplier,
    RawMaterial, PurchaseOrder, StockMovement, LiquorItem,
    LiquorTransaction, Recipe, RecipeIngredient, PosBill, Expense,
    MenuItem
)

logger = logging.getLogger(__name__)

def seed_enterprise():
    db = SessionLocal()
    try:
        outlet = db.query(Outlet).filter(Outlet.code == "KB-BLR-01").first()
        if not outlet:
            outlet = db.query(Outlet).first()
        if not outlet:
            logger.error("No outlet found to link enterprise seed data.")
            return

        outlet_id = outlet.id
        logger.info(f"Seeding Enterprise Data for Outlet: {outlet.name} ({outlet_id})")

        # 1. EMPLOYEES
        if db.query(Employee).count() == 0:
            logger.info("Seeding Employees...")
            employees_data = [
                {"name": "Vikramaditya Rao", "email": "gm.blr@kickbunk.com", "phone": "+91 98450 11223", "role": "GENERAL_MANAGER", "pin_code": "9999", "salary": 85000.0},
                {"name": "Priya Sundaram", "email": "priya.ops@kickbunk.com", "phone": "+91 98450 22334", "role": "OUTLET_MANAGER", "pin_code": "1111", "salary": 55000.0},
                {"name": "Rohit Sen", "email": "rohit.cashier@kickbunk.com", "phone": "+91 98450 33445", "role": "CASHIER", "pin_code": "2222", "salary": 32000.0},
                {"name": "Chef Sanjay Rawat", "email": "chef.sanjay@kickbunk.com", "phone": "+91 98450 44556", "role": "CHEF", "pin_code": "3333", "salary": 65000.0},
                {"name": "Anthony Fernandes", "email": "anthony.bar@kickbunk.com", "phone": "+91 98450 55667", "role": "BARTENDER", "pin_code": "4444", "salary": 48000.0},
                {"name": "Karthik Raja", "email": "karthik.store@kickbunk.com", "phone": "+91 98450 66778", "role": "INVENTORY_MGR", "pin_code": "5555", "salary": 38000.0},
                {"name": "Steward Raju", "email": "raju.floor@kickbunk.com", "phone": "+91 98450 77889", "role": "CAPTAIN", "pin_code": "6666", "salary": 24000.0},
            ]
            emp_objs = []
            for ed in employees_data:
                emp = Employee(outlet_id=outlet_id, **ed)
                db.add(emp)
                emp_objs.append(emp)
            db.flush()

            # Seed Cashier Shift
            cashier = db.query(Employee).filter(Employee.role == "CASHIER").first()
            if cashier:
                shift = CashierShift(
                    outlet_id=outlet_id,
                    cashier_id=cashier.id,
                    counter_name="Main Resto-Bar Counter 01",
                    opening_float=5000.0,
                    total_cash_collected=14850.0,
                    total_upi_collected=38420.0,
                    total_card_collected=22150.0,
                    status="OPEN"
                )
                db.add(shift)

            # Seed Attendance
            for emp in emp_objs:
                att = StaffAttendance(
                    outlet_id=outlet_id,
                    employee_id=emp.id,
                    date="2026-11-16",
                    check_in="10:30 AM",
                    status="PRESENT"
                )
                db.add(att)
            db.commit()

        # 2. SUPPLIERS
        if db.query(Supplier).count() == 0:
            logger.info("Seeding Suppliers...")
            suppliers = [
                {"name": "Fresh Farms Poultry & Meats Ltd", "contact_person": "Mahesh Gowda", "phone": "+91 98860 12345", "category": "DAIRY_POULTRY", "gstin": "29AAACF1122A1Z1", "payment_terms": "NET_15"},
                {"name": "Bangalore Organic Agro Produce", "contact_person": "Sunita Patil", "phone": "+91 98860 23456", "category": "FRESH_PRODUCE", "gstin": "29AAACB2233B1Z2", "payment_terms": "NET_7"},
                {"name": "Deccan Spices & Aged Grains Co", "contact_person": "Syed Hameed", "phone": "+91 98860 34567", "category": "DRY_SPICES", "gstin": "29AAACD3344C1Z3", "payment_terms": "NET_30"},
                {"name": "United Spirits & Craft Liquor Distributors", "contact_person": "Rajesh Mehta", "phone": "+91 98860 45678", "category": "SPIRITS", "gstin": "29AAACU4455D1Z4", "payment_terms": "IMMEDIATE"},
                {"name": "EcoPack Luxury Food Containers", "contact_person": "Naveen Roy", "phone": "+91 98860 56789", "category": "PACKAGING", "gstin": "29AAACE5566E1Z5", "payment_terms": "NET_15"},
            ]
            for s in suppliers:
                db.add(Supplier(outlet_id=outlet_id, **s))
            db.commit()

        # 3. RAW MATERIALS INVENTORY
        if db.query(RawMaterial).count() == 0:
            logger.info("Seeding Raw Materials...")
            materials = [
                {"name": "Fresh Chicken Drumsticks & Thighs", "sku": "RAW-CHK-001", "category": "MEAT_POULTRY", "unit": "KG", "current_stock": 42.5, "min_reorder_level": 15.0, "cost_per_unit": 240.0},
                {"name": "Fresh Artisanal Malai Paneer", "sku": "RAW-PAN-001", "category": "DAIRY", "unit": "KG", "current_stock": 18.0, "min_reorder_level": 8.0, "cost_per_unit": 320.0},
                {"name": "Aged Long-Grain Basmati Rice", "sku": "RAW-RIC-001", "category": "GRAINS", "unit": "KG", "current_stock": 120.0, "min_reorder_level": 40.0, "cost_per_unit": 110.0},
                {"name": "Whole Black Urad Lentils", "sku": "RAW-DAL-001", "category": "GRAINS", "unit": "KG", "current_stock": 35.0, "min_reorder_level": 12.0, "cost_per_unit": 145.0},
                {"name": "Amul Pure Cow Desi Ghee", "sku": "RAW-GHE-001", "category": "DAIRY", "unit": "KG", "current_stock": 28.0, "min_reorder_level": 10.0, "cost_per_unit": 580.0},
                {"name": "Italian Black Truffle Olive Oil", "sku": "RAW-TRU-001", "category": "OILS", "unit": "LITRE", "current_stock": 4.5, "min_reorder_level": 2.0, "cost_per_unit": 3200.0},
                {"name": "Fresh Cream (Dairy 25% Fat)", "sku": "RAW-CRM-001", "category": "DAIRY", "unit": "LITRE", "current_stock": 22.0, "min_reorder_level": 8.0, "cost_per_unit": 210.0},
                {"name": "San Marzano Vine Tomatoes", "sku": "RAW-TOM-001", "category": "PRODUCE", "unit": "KG", "current_stock": 65.0, "min_reorder_level": 20.0, "cost_per_unit": 42.0},
                {"name": "Kashmiri Degi Mirch Powder", "sku": "RAW-CHI-001", "category": "SPICES", "unit": "KG", "current_stock": 14.0, "min_reorder_level": 5.0, "cost_per_unit": 480.0},
                {"name": "Mozzarella Cheese Bocconcini", "sku": "RAW-MOZ-001", "category": "DAIRY", "unit": "KG", "current_stock": 16.5, "min_reorder_level": 6.0, "cost_per_unit": 520.0},
            ]
            for m in materials:
                db.add(RawMaterial(outlet_id=outlet_id, **m))
            db.commit()

        # 4. LIQUOR & BAR INVENTORY
        if db.query(LiquorItem).count() == 0:
            logger.info("Seeding Liquor Inventory...")
            liquor = [
                {"brand_name": "Glenfiddich 12 Yrs Speyside Single Malt", "category": "SINGLE_MALT", "bottle_volume_ml": 750, "total_sealed_bottles": 14, "open_bottle_remaining_ml": 480, "cost_per_bottle": 3800.0, "selling_price_30ml": 650.0, "selling_price_60ml": 1200.0, "excise_code": "KA-EXC-GF12-882"},
                {"brand_name": "The Macallan 12 Yrs Double Cask Single Malt", "category": "SINGLE_MALT", "bottle_volume_ml": 750, "total_sealed_bottles": 8, "open_bottle_remaining_ml": 330, "cost_per_bottle": 5400.0, "selling_price_30ml": 850.0, "selling_price_60ml": 1600.0, "excise_code": "KA-EXC-MAC12-401"},
                {"brand_name": "Black Dog Triple Gold Reserve Scotch", "category": "SCOTCH", "bottle_volume_ml": 750, "total_sealed_bottles": 22, "open_bottle_remaining_ml": 600, "cost_per_bottle": 2100.0, "selling_price_30ml": 420.0, "selling_price_60ml": 780.0, "excise_code": "KA-EXC-BDGR-209"},
                {"brand_name": "Buffalo Trace Kentucky Straight Bourbon", "category": "BOURBON", "bottle_volume_ml": 750, "total_sealed_bottles": 11, "open_bottle_remaining_ml": 270, "cost_per_bottle": 2900.0, "selling_price_30ml": 520.0, "selling_price_60ml": 980.0, "excise_code": "KA-EXC-BTB-101"},
                {"brand_name": "Ketel One Dutch Crafted Vodka", "category": "VODKA", "bottle_volume_ml": 750, "total_sealed_bottles": 16, "open_bottle_remaining_ml": 420, "cost_per_bottle": 2200.0, "selling_price_30ml": 440.0, "selling_price_60ml": 820.0, "excise_code": "KA-EXC-KTV-331"},
                {"brand_name": "Bombay Sapphire London Dry Botanical Gin", "category": "GIN", "bottle_volume_ml": 750, "total_sealed_bottles": 18, "open_bottle_remaining_ml": 510, "cost_per_bottle": 2350.0, "selling_price_30ml": 460.0, "selling_price_60ml": 860.0, "excise_code": "KA-EXC-BSG-505"},
                {"brand_name": "Corona Extra Premium Mexican Lager (Pint)", "category": "BEER", "bottle_volume_ml": 330, "total_sealed_bottles": 72, "open_bottle_remaining_ml": 0, "cost_per_bottle": 190.0, "selling_price_30ml": 380.0, "selling_price_60ml": 380.0, "excise_code": "KA-EXC-COR-771"},
            ]
            for l in liquor:
                db.add(LiquorItem(outlet_id=outlet_id, **l))
            db.commit()

        # 5. EXPENSES
        if db.query(Expense).count() == 0:
            logger.info("Seeding Expenses...")
            expenses = [
                {"category": "UTILITIES", "title": "Kitchen Gas Cylinders Commercial (4x 19KG)", "amount": 7800.0, "payment_mode": "BANK_TRANSFER", "paid_to": "Indane Gas Commercial Dist.", "expense_date": "2026-11-14"},
                {"category": "EQUIPMENT_REPAIR", "title": "Bar Blender Motor Replacement & Servicing", "amount": 2400.0, "payment_mode": "CASH", "paid_to": "Metro Kitchen Equipments", "expense_date": "2026-11-15"},
                {"category": "MARKETING", "title": "Weekend Live Saxophone & Jazz Musician Honorarium", "amount": 15000.0, "payment_mode": "UPI", "paid_to": "David Jazz Quartet", "expense_date": "2026-11-15"},
                {"category": "PETTY_CASH", "title": "Fresh Mint, Lemons & Crushed Ice Market Procurement", "amount": 1450.0, "payment_mode": "CASH", "paid_to": "Electronic City Vegetable Mandi", "expense_date": "2026-11-16"},
            ]
            for exp in expenses:
                db.add(Expense(outlet_id=outlet_id, **exp))
            db.commit()

        # 6. POS BILLS
        if db.query(PosBill).count() == 0:
            logger.info("Seeding POS Bills...")
            bills = [
                {
                    "bill_number": "KB-BLR-INV-1001",
                    "order_id": "ord-init-1001",
                    "table_number": "08",
                    "subtotal": 1280.0,
                    "discount_amount": 0.0,
                    "cgst": 32.0,
                    "sgst": 32.0,
                    "final_amount": 1344.0,
                    "payment_mode": "UPI",
                },
                {
                    "bill_number": "KB-BLR-INV-1002",
                    "order_id": "ord-init-1002",
                    "table_number": "CABANA-01",
                    "subtotal": 2450.0,
                    "discount_amount": 245.0, # 10% member privilege
                    "cgst": 55.13,
                    "sgst": 55.13,
                    "final_amount": 2315.26,
                    "payment_mode": "CARD",
                },
            ]
            for b in bills:
                db.add(PosBill(outlet_id=outlet_id, **b))
            db.commit()

        logger.info("Successfully seeded KICK BUNK Enterprise Platform data!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_enterprise()
