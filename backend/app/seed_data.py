import logging
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models import (
    Restaurant, Outlet, OperatingHours, DiningArea, RestaurantTable,
    MenuCategory, MenuItem, MenuVariant, MenuAddon, ItemAllergen,
    Customer
)
from app.services.qr_service import QrService

logger = logging.getLogger(__name__)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        existing_restaurant = db.query(Restaurant).first()
        if existing_restaurant:
            logger.info("Database already seeded with KICK BUNK business data.")
            return

        logger.info("Seeding verified KICK BUNK Restaurant & Bar data...")

        # 1. Restaurant
        rest = Restaurant(
            name="KICK BUNK",
            legal_name="Kick Bunk Hospitality Private Limited",
            gstin="29ABCDE1234F1Z5",
            brand_tagline="European Luxury Garden Restaurant & Resto-Bar",
            logo_url="/images/logo.png"
        )
        db.add(rest)
        db.flush()

        # 2. Outlets
        blr_outlet = Outlet(
            restaurant_id=rest.id,
            name="Kick Bunk Restaurant & Bar (Bengaluru Flagship)",
            code="KB-BLR-01",
            address="Hulimangala Main Road, near Vinayaka Layout, Yarandahalli, Electronic City Phase 1",
            city="Bengaluru",
            state="Karnataka",
            postal_code="560105",
            phone="+91 99453 21367",
            email="bengaluru@kickbunk.com",
            latitude=12.8242,
            longitude=77.6835,
            google_maps_url="https://www.google.com/maps/search/?api=1&query=Kick+Bunk+Restaurant+and+Bar+Hulimangala+Bengaluru",
            is_active=True,
            alcohol_service_enabled=True,
            legal_drinking_age=21
        )
        
        tpt_outlet = Outlet(
            restaurant_id=rest.id,
            name="Kick Bunk Garden Bar & Restaurant (Tirupati)",
            code="KB-TPT-01",
            address="Door No. 19-1-G/25, Kothapalli, Samavayi Margam, Chinthalachenu, Korlagunta",
            city="Tirupati",
            state="Andhra Pradesh",
            postal_code="517501",
            phone="+91 98855 20220",
            email="tirupati@kickbunk.com",
            latitude=13.6288,
            longitude=79.4192,
            google_maps_url="https://www.google.com/maps/search/?api=1&query=Kick+Bunk+Garden+Bar+and+Restaurant+Tirupati",
            is_active=True,
            alcohol_service_enabled=True,
            legal_drinking_age=21
        )
        db.add_all([blr_outlet, tpt_outlet])
        db.flush()

        # 3. Operating Hours
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for o in [blr_outlet, tpt_outlet]:
            for day in days:
                db.add(OperatingHours(
                    outlet_id=o.id,
                    day_of_week=day,
                    open_time="11:00",
                    close_time="23:30",
                    is_closed=False
                ))

        # 4. Dining Areas (Bengaluru)
        area_garden = DiningArea(
            outlet_id=blr_outlet.id,
            name="Open-Air Lush Garden",
            description="Lush greenery with romantic fairy lights and canopy seating",
            is_outdoor=True
        )
        area_cabana = DiningArea(
            outlet_id=blr_outlet.id,
            name="Private Luxury Cabanas",
            description="Exclusive wooden gazebos for private dining and celebrations",
            is_outdoor=True
        )
        area_bar = DiningArea(
            outlet_id=blr_outlet.id,
            name="Resto-Bar & Cocktail Lounge",
            description="Sophisticated nightlife atmosphere with sports screening and craft bar",
            is_outdoor=False
        )
        area_hall = DiningArea(
            outlet_id=blr_outlet.id,
            name="Family Dining Pavilion",
            description="Air-conditioned spacious indoor family dining area",
            is_outdoor=False
        )
        db.add_all([area_garden, area_cabana, area_bar, area_hall])
        db.flush()

        # 5. Tables & QR Tokens (Bengaluru)
        tables_to_create = [
            ("01", area_garden, 4),
            ("02", area_garden, 4),
            ("03", area_garden, 6),
            ("04", area_garden, 4),
            ("05", area_garden, 2),
            ("06", area_garden, 8),
            ("07", area_garden, 4),
            ("08", area_garden, 4),  # Highlighted Table 08
            ("09", area_garden, 6),
            ("10", area_garden, 4),
            ("CABANA-01", area_cabana, 8),
            ("CABANA-02", area_cabana, 8),
            ("BAR-01", area_bar, 2),
            ("BAR-02", area_bar, 4),
            ("HALL-01", area_hall, 6),
            ("HALL-02", area_hall, 8),
        ]
        
        created_tables = []
        for t_num, area, cap in tables_to_create:
            t = RestaurantTable(
                outlet_id=blr_outlet.id,
                area_id=area.id,
                table_number=t_num,
                capacity=cap,
                is_occupied=False
            )
            db.add(t)
            created_tables.append(t)
            
        db.flush()

        # Generate cryptographic QR tokens for all tables
        for t in created_tables:
            QrService.generate_table_qr(db, blr_outlet.id, t.table_number)

        # 6. Menu Categories
        cat_starters = MenuCategory(
            name="Starters & Appetizers",
            slug="starters",
            description="Crispy charcoal-grilled tandoor kebabs and gourmet starters",
            display_order=1,
            image_url="/images/kickbunk/magicpin_01_kalmi_kebab.webp",
            is_alcohol=False
        )
        cat_indian = MenuCategory(
            name="Indian Curries & Biryani",
            slug="indian-cuisine",
            description="Rich royal gravies, dum biryanis, and artisan tandoori breads",
            display_order=2,
            image_url="/images/kickbunk/magicpin_04_food_spread_dining.webp",
            is_alcohol=False
        )
        cat_continental = MenuCategory(
            name="Continental & Sizzlers",
            slug="continental",
            description="Fresh pastas, grilled sizzlers, gourmet burgers, and wood-fired pizzas",
            display_order=3,
            image_url="/images/kickbunk/google_03_garden_courtyard.jpg",
            is_alcohol=False
        )
        cat_desserts = MenuCategory(
            name="Artisan Desserts",
            slug="desserts",
            description="Decadent chocolate lava, cheesecakes, and traditional delicacies",
            display_order=4,
            image_url="/images/kickbunk/google_01_garden_lights_night.jpg",
            is_alcohol=False
        )
        cat_mocktails = MenuCategory(
            name="Mocktails & Beverages",
            slug="mocktails",
            description="Refreshing botanical coolers, freshly squeezed fruit juices, and shakes",
            display_order=5,
            image_url="/images/kickbunk/magicpin_03_garden_courtyard_night.webp",
            is_alcohol=False
        )
        cat_cocktails = MenuCategory(
            name="Signature Garden Cocktails",
            slug="signature-cocktails",
            description="Handcrafted mixology inspired by lush garden herbs and botanicals",
            display_order=6,
            image_url="/images/kickbunk/google_01_garden_lights_night.jpg",
            is_alcohol=True
        )
        cat_spirits = MenuCategory(
            name="Craft Beers & Single Malts",
            slug="beers-spirits",
            description="Curated international single malts, aged rums, and chilled craft beers",
            display_order=7,
            image_url="/images/kickbunk/google_05_outdoor_terrace_view.jpg",
            is_alcohol=True
        )
        
        db.add_all([
            cat_starters, cat_indian, cat_continental, 
            cat_desserts, cat_mocktails, cat_cocktails, cat_spirits
        ])
        db.flush()

        # 7. Menu Items, Variants, and Addons
        # --- Kalmi Kebab ---
        kalmi = MenuItem(
            category_id=cat_starters.id,
            name="Charcoal Kalmi Kebab (Signature)",
            slug="charcoal-kalmi-kebab",
            description="Tender chicken drumsticks marinated overnight in aromatic spices, hung curd, and yellow chili, slow-roasted over natural charcoal.",
            base_price=380.0,
            is_veg=False,
            is_alcohol=False,
            is_bestseller=True,
            is_signature=True,
            preparation_time_minutes=20,
            image_url="/images/kickbunk/magicpin_01_kalmi_kebab.webp",
            is_available=True,
            kitchen_station="TANDOOR"
        )
        db.add(kalmi)
        db.flush()
        db.add_all([
            MenuVariant(item_id=kalmi.id, name="Half (2 Pcs)", price_delta=0.0, is_default=True),
            MenuVariant(item_id=kalmi.id, name="Full (4 Pcs)", price_delta=320.0, is_default=False),
            MenuAddon(item_id=kalmi.id, name="Extra Mint Chutney & Pickled Onions", price=30.0),
            MenuAddon(item_id=kalmi.id, name="Tandoori Butter Garlic Naan (1 Pc)", price=65.0),
            ItemAllergen(item_id=kalmi.id, allergen_name="Dairy")
        ])

        # --- Paneer Malai Tikka ---
        paneer_tikka = MenuItem(
            category_id=cat_starters.id,
            name="Royal Paneer Malai Tikka",
            slug="royal-paneer-malai-tikka",
            description="Farm-fresh cottage cheese cubes steeped in rich cashew cream, crushed cardamom, cheese, and charred in the clay oven.",
            base_price=340.0,
            is_veg=True,
            is_alcohol=False,
            is_bestseller=True,
            is_signature=False,
            preparation_time_minutes=15,
            image_url="/images/kickbunk/magicpin_04_food_spread_dining.webp",
            is_available=True,
            kitchen_station="TANDOOR"
        )
        db.add(paneer_tikka)
        db.flush()
        db.add_all([
            MenuVariant(item_id=paneer_tikka.id, name="Standard Portion (6 Pcs)", price_delta=0.0, is_default=True),
            MenuAddon(item_id=paneer_tikka.id, name="Extra Grated Cheese Melt", price=50.0),
            ItemAllergen(item_id=paneer_tikka.id, allergen_name="Dairy"),
            ItemAllergen(item_id=paneer_tikka.id, allergen_name="Nuts")
        ])

        # --- Tandoori Chicken ---
        tandoori_chk = MenuItem(
            category_id=cat_starters.id,
            name="Classic Kick Bunk Tandoori Chicken",
            slug="classic-tandoori-chicken",
            description="Whole spring chicken bathed in Deghi chili marinade, mustard oil, and freshly ground garam masala, fired to juicy perfection.",
            base_price=360.0,
            is_veg=False,
            is_alcohol=False,
            is_bestseller=True,
            is_signature=True,
            preparation_time_minutes=25,
            image_url="/images/kickbunk/magicpin_01_kalmi_kebab.webp",
            is_available=True,
            kitchen_station="TANDOOR"
        )
        db.add(tandoori_chk)
        db.flush()
        db.add_all([
            MenuVariant(item_id=tandoori_chk.id, name="Half", price_delta=0.0, is_default=True),
            MenuVariant(item_id=tandoori_chk.id, name="Full", price_delta=320.0, is_default=False),
            MenuAddon(item_id=tandoori_chk.id, name="Tandoori Laccha Paratha", price=60.0)
        ])

        # --- Dragon Chicken ---
        dragon_chk = MenuItem(
            category_id=cat_starters.id,
            name="Wok-Tossed Dragon Chicken",
            slug="dragon-chicken",
            description="Crispy strips of chicken tossed in chili garlic sauce with crunchy cashews, bell peppers, and scallions.",
            base_price=320.0,
            is_veg=False,
            is_alcohol=False,
            is_bestseller=False,
            is_signature=False,
            preparation_time_minutes=15,
            image_url="/images/kickbunk/restaurant_guru_interior.jpg",
            is_available=True,
            kitchen_station="CHINESE"
        )
        db.add(dragon_chk)
        db.flush()
        db.add(ItemAllergen(item_id=dragon_chk.id, allergen_name="Nuts"))

        # --- Royal Dum Biryani ---
        biryani = MenuItem(
            category_id=cat_indian.id,
            name="Hyderabadi Dum Chicken Biryani",
            slug="hyderabadi-dum-chicken-biryani",
            description="Fragrant long-grain aged Basmati rice layered with succulent marinated chicken, saffron strands, caramelized onions, and sealed under purdah.",
            base_price=390.0,
            is_veg=False,
            is_alcohol=False,
            is_bestseller=True,
            is_signature=True,
            preparation_time_minutes=15,
            image_url="/images/kickbunk/magicpin_04_food_spread_dining.webp",
            is_available=True,
            kitchen_station="CURRY"
        )
        db.add(biryani)
        db.flush()
        db.add_all([
            MenuVariant(item_id=biryani.id, name="Single Regular", price_delta=0.0, is_default=True),
            MenuVariant(item_id=biryani.id, name="Family Pot (Serves 3-4)", price_delta=450.0, is_default=False),
            MenuAddon(item_id=biryani.id, name="Extra Mirchi Ka Salan & Raita", price=40.0),
            MenuAddon(item_id=biryani.id, name="Boiled Egg (2 Pcs)", price=40.0)
        ])

        # --- Butter Chicken ---
        butter_chk = MenuItem(
            category_id=cat_indian.id,
            name="Old Delhi Butter Chicken",
            slug="old-delhi-butter-chicken",
            description="Charcoal-roasted tandoori chicken cooked in a velvety tomato, honey, and fresh butter gravy with a whisper of fenugreek.",
            base_price=410.0,
            is_veg=False,
            is_alcohol=False,
            is_bestseller=True,
            is_signature=True,
            preparation_time_minutes=15,
            image_url="/images/kickbunk/magicpin_04_food_spread_dining.webp",
            is_available=True,
            kitchen_station="CURRY"
        )
        db.add(butter_chk)
        db.flush()
        db.add_all([
            MenuAddon(item_id=butter_chk.id, name="Garlic Butter Naan (2 Pcs)", price=110.0),
            ItemAllergen(item_id=butter_chk.id, allergen_name="Dairy"),
            ItemAllergen(item_id=butter_chk.id, allergen_name="Nuts")
        ])

        # --- Mocktail: Kick Bunk Garden Mist ---
        mocktail = MenuItem(
            category_id=cat_mocktails.id,
            name="Kick Bunk Garden Mist Cooler",
            slug="garden-mist-cooler",
            description="Muddled garden basil, English cucumber, freshly squeezed lime, litchi essence, and effervescent sparkling water.",
            base_price=220.0,
            is_veg=True,
            is_alcohol=False,
            is_bestseller=True,
            is_signature=True,
            preparation_time_minutes=8,
            image_url="/images/kickbunk/magicpin_03_garden_courtyard_night.webp",
            is_available=True,
            kitchen_station="BAR"
        )
        db.add(mocktail)

        # --- Signature Cocktail: Kick Bunk Smoked Old Fashioned ---
        smoked_cocktail = MenuItem(
            category_id=cat_cocktails.id,
            name="Smoked Oakwood Old Fashioned",
            slug="smoked-oakwood-old-fashioned",
            description="Bourbon whisky infused with orange zest, Angostura bitters, organic demerara sugar, and smoked table-side with French oak chips.",
            base_price=550.0,
            is_veg=True,
            is_alcohol=True,
            alcohol_abv=40.0,
            serving_size="60ml",
            is_bestseller=True,
            is_signature=True,
            preparation_time_minutes=10,
            image_url="/images/kickbunk/google_01_garden_lights_night.jpg",
            is_available=True,
            kitchen_station="BAR"
        )
        db.add(smoked_cocktail)
        db.flush()
        db.add_all([
            MenuVariant(item_id=smoked_cocktail.id, name="Standard (60ml)", price_delta=0.0, is_default=True),
            MenuVariant(item_id=smoked_cocktail.id, name="Double Shot (120ml)", price_delta=450.0, is_default=False)
        ])

        # --- Single Malt: Glenfiddich 12 Year ---
        single_malt = MenuItem(
            category_id=cat_spirits.id,
            name="Glenfiddich 12 Year Single Malt",
            slug="glenfiddich-12-year",
            description="Carefully matured in the finest American oak and European oak sherry casks for at least 12 years. Distinctively fresh and fruity with a hint of pear.",
            base_price=520.0,
            is_veg=True,
            is_alcohol=True,
            alcohol_abv=40.0,
            serving_size="30ml",
            is_bestseller=True,
            is_signature=False,
            preparation_time_minutes=5,
            image_url="/images/kickbunk/google_05_outdoor_terrace_view.jpg",
            is_available=True,
            kitchen_station="BAR"
        )
        db.add(single_malt)
        db.flush()
        db.add_all([
            MenuVariant(item_id=single_malt.id, name="30ml Peg", price_delta=0.0, is_default=True),
            MenuVariant(item_id=single_malt.id, name="60ml Peg", price_delta=460.0, is_default=False),
            MenuAddon(item_id=single_malt.id, name="Artisanal Sparkling Water", price=60.0),
            MenuAddon(item_id=single_malt.id, name="Premium Tonic Water", price=75.0)
        ])

        # 8. Test Demo Customer Account
        test_customer = Customer(
            full_name="Anil Kumar",
            phone="+919876543210",
            email="anil@example.com",
            password_hash=get_password_hash("KickBunk@2026"),
            loyalty_points=120,
            is_guest=False
        )
        db.add(test_customer)

        db.commit()
        logger.info("Successfully seeded all KICK BUNK outlets, tables, QR tokens, and luxury menu items.")
    except Exception as e:
        db.rollback()
        logger.error(f"Seeding failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
