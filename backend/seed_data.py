import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
from products.models import PetType, Category, Product
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem

User = get_user_model()

def run_seed():
    print("===> Seeding PetVilla database in Indian Rupees (INR)...")

    # 1. Create Sellers & Customers
    seller_alice, created = User.objects.get_or_create(
        username="alice_petshop",
        defaults={
            "email": "alice@petvilla.in",
            "user_type": "seller",
            "first_name": "Alice",
            "last_name": "Sharma",
        },
    )
    if created:
        seller_alice.set_password("SellerPass123")
        seller_alice.save()

    seller_bob, created = User.objects.get_or_create(
        username="bob_pawmarket",
        defaults={
            "email": "bob@pawmarket.in",
            "user_type": "seller",
            "first_name": "Bob",
            "last_name": "Verma",
        },
    )
    if created:
        seller_bob.set_password("SellerPass123")
        seller_bob.save()

    customer_alex, created = User.objects.get_or_create(
        username="alex_customer",
        defaults={
            "email": "arjun@example.com",
            "user_type": "customer",
            "first_name": "Arjun",
            "last_name": "Reddy",
        },
    )
    if created:
        customer_alex.set_password("CustomerPass123")
        customer_alex.save()

    # 2. Pet Types
    pet_types_data = [
        {"name": "Dogs", "slug": "dogs", "icon": "dog", "description": "Food and supplies selected for a dog's life stage, size, and health."},
        {"name": "Cats", "slug": "cats", "icon": "cat", "description": "Cat-specific food and supplies selected for the animal's life stage and health."},
        {"name": "Birds", "slug": "birds", "icon": "bird", "description": "Species-appropriate bird food, perches, enrichment, and care supplies."},
        {"name": "Fish & Aquatic", "slug": "fish", "icon": "fish", "description": "Aquarium foods and care supplies suited to the fish species and habitat."},
        {"name": "Rabbits & Bunnies", "slug": "rabbits", "icon": "rabbit", "description": "Hay-first rabbit diets, safe enrichment, and rabbit care supplies."},
        {"name": "Hamsters & Guinea Pigs", "slug": "hamsters", "icon": "rat", "description": "Species-specific food and supplies for hamsters, guinea pigs, and other small mammals."},
        {"name": "Small Pets", "slug": "small-pets", "icon": "rabbit", "description": "Supplies for small pets; food must be chosen for the exact species."},
        {"name": "Reptiles & Amphibians", "slug": "reptiles", "icon": "worm", "description": "Species-specific habitats and care supplies; feeding needs vary across reptiles and amphibians."},
        {"name": "Horses & Farm Pets", "slug": "horses", "icon": "horse", "description": "Forage-led care and equine supplies chosen for the animal and its needs."},
    ]

    pet_types = {}
    for pt in pet_types_data:
        obj, _ = PetType.objects.get_or_create(slug=pt["slug"], defaults=pt)
        obj.name = pt["name"]
        obj.icon = pt["icon"]
        obj.description = pt["description"]
        obj.save()
        pet_types[pt["slug"]] = obj

    # 3. Categories
    categories_data = [
        {"name": "Food & Nutrition", "slug": "food-nutrition", "icon": "utensils", "description": "Food selected for the pet's species and life stage; check labels and ask a veterinarian about individual needs."},
        {"name": "Treats & Snacks", "slug": "treats-snacks", "icon": "sparkles", "description": "Species-appropriate treats to offer in suitable portions."},
        {"name": "Toys & Play", "slug": "toys-play", "icon": "gamepad-2", "description": "Species-appropriate enrichment and play supplies."},
        {"name": "Beds & Furniture", "slug": "beds-furniture", "icon": "bed", "description": "Suitable beds, habitats, hides, and resting places for different pets."},
        {"name": "Collars, Leashes & Harnesses", "slug": "collars-leashes", "icon": "link", "description": "Properly fitted walking gear for pets for whom collars, leashes, or harnesses are appropriate."},
        {"name": "Grooming & Hygiene", "slug": "grooming-hygiene", "icon": "scissors", "description": "Grooming and hygiene supplies labeled for the pet species; not every pet should be bathed."},
        {"name": "Health & Care", "slug": "health-care", "icon": "heart-pulse", "description": "Care supplies; consult a veterinarian before treating illness or giving medicine."},
        {"name": "Health & Supplements", "slug": "health-supplements", "icon": "heart-pulse", "description": "Health supplies and supplements to use only when appropriate for the pet and directed by a veterinarian."},
    ]

    categories = {}
    for cat in categories_data:
        obj, _ = Category.objects.get_or_create(slug=cat["slug"], defaults=cat)
        obj.name = cat["name"]
        obj.description = cat["description"]
        obj.icon = cat["icon"]
        obj.save()
        categories[cat["slug"]] = obj

    # 4. Products - In Indian Rupees (₹)
    products_data = [
        # --- DOG FOODS ---
        {
            "seller": seller_alice,
            "name": "Royal Canine Grain-Free Salmon & Sweet Potato Dog Food (15kg)",
            "description": "Formulated specifically for canines with wild Alaskan salmon, sweet potatoes, and blueberries. High in Omega-3 & 6 fatty acids for a glossy coat and strong joints.",
            "price": 3499.00,
            "discount_price": 2999.00,
            "stock": 25,
            "pet_type": pet_types["dogs"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
            "rating": 4.9,
            "reviews_count": 52,
            "is_featured": True,
        },
        {
            "seller": seller_alice,
            "name": "Slow-Simmered Real Beef & Carrots Wet Dog Stew (12 Cans)",
            "description": "Tender grass-fed beef cuts simmered in hearty bone broth with garden peas and diced carrots. Complete balanced daily nutrition for adult dogs.",
            "price": 1250.00,
            "discount_price": 1099.00,
            "stock": 40,
            "pet_type": pet_types["dogs"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
            "rating": 4.85,
            "reviews_count": 38,
            "is_featured": False,
        },
        {
            "seller": seller_bob,
            "name": "Freeze-Dried Turkey & Cranberry Dog Training Bites (250g)",
            "description": "Single-ingredient freeze-dried raw turkey liver packed with cranberries for urinary tract support. Pocket-friendly, low-calorie reward treats.",
            "price": 499.00,
            "discount_price": 399.00,
            "stock": 65,
            "pet_type": pet_types["dogs"],
            "category": categories["treats-snacks"],
            "image_url": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
            "rating": 4.95,
            "reviews_count": 84,
            "is_featured": True,
        },

        {
            "seller": seller_bob,
            "name": "Pedigree Puppy Chicken & Milk Dry Dog Food (1.2kg)",
            "description": "Complete puppy food with chicken and milk for growing puppies, including Golden Retrievers, German Shepherds, Labradors, and other breeds. Follow the feeding guide for your puppy's age and weight.",
            "price": 399.00,
            "discount_price": 359.00,
            "stock": 50,
            "pet_type": pet_types["dogs"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
            "rating": 4.8,
            "reviews_count": 64,
            "is_featured": True,
        },
        {
            "seller": seller_alice,
            "name": "Royal Canin German Shepherd Adult Dry Dog Food (3kg)",
            "description": "Breed-specific complete food formulated for adult German Shepherds. Select food based on your dog's life stage and consult your veterinarian about individual dietary needs.",
            "price": 2199.00,
            "discount_price": 1999.00,
            "stock": 24,
            "pet_type": pet_types["dogs"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
            "rating": 4.9,
            "reviews_count": 42,
            "is_featured": False,
        },
        {
            "seller": seller_bob,
            "name": "Royal Canin Golden Retriever Adult Dry Dog Food (3kg)",
            "description": "Breed-specific complete food formulated for adult Golden Retrievers. Choose the appropriate life-stage formula and ask your veterinarian for advice about your dog's diet.",
            "price": 2199.00,
            "discount_price": 1999.00,
            "stock": 21,
            "pet_type": pet_types["dogs"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
            "rating": 4.85,
            "reviews_count": 36,
            "is_featured": False,
        },

        # --- CAT FOODS ---
        {
            "seller": seller_alice,
            "name": "Purrfect Ocean Wild Tuna & Salmon Mousse Cat Food (24 Cans)",
            "description": "Ultra-smooth gourmet mousse prepared with sustainably caught skipjack tuna and Atlantic salmon. High moisture content protects feline kidney health.",
            "price": 1450.00,
            "discount_price": 1249.00,
            "stock": 45,
            "pet_type": pet_types["cats"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
            "rating": 4.9,
            "reviews_count": 47,
            "is_featured": True,
        },
        {
            "seller": seller_bob,
            "name": "Indoor Hairball & Weight Control Dry Cat Kibble (5kg)",
            "description": "Wholesome deboned chicken recipe with natural miscanthus grass fibers to sweep ingested hair safely through digestive tract.",
            "price": 1199.00,
            "discount_price": 999.00,
            "stock": 35,
            "pet_type": pet_types["cats"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
            "rating": 4.75,
            "reviews_count": 29,
            "is_featured": False,
        },
        {
            "seller": seller_alice,
            "name": "Crunchy Catnip Infused Salmon Dental Cat Treats (150g)",
            "description": "Crisp porous shell with real catnip centers designed to scrape tartar and freshen feline breath during daily treat sessions.",
            "price": 299.00,
            "discount_price": 249.00,
            "stock": 80,
            "pet_type": pet_types["cats"],
            "category": categories["treats-snacks"],
            "image_url": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80",
            "rating": 4.88,
            "reviews_count": 62,
            "is_featured": False,
        },

        {
            "seller": seller_bob,
            "name": "Whiskas Adult Ocean Fish Dry Cat Food (1.2kg)",
            "description": "Complete adult cat food with an ocean fish flavor, suitable for adult cats including Persian and domestic shorthair cats. Follow the package feeding guide and provide fresh water.",
            "price": 449.00,
            "discount_price": 399.00,
            "stock": 46,
            "pet_type": pet_types["cats"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
            "rating": 4.8,
            "reviews_count": 53,
            "is_featured": True,
        },

        # --- BIRD FOODS ---
        {
            "seller": seller_alice,
            "name": "Parrot Paradise Tropical Fruit & Nut Blend (2.5kg)",
            "description": "Nutritionally balanced bird mix with sun-ripened papaya, mango, cracked walnuts, cashews, pumpkin seeds, and extruded fruit pellets for large parrots.",
            "price": 799.00,
            "discount_price": 699.00,
            "stock": 30,
            "pet_type": pet_types["birds"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
            "rating": 4.82,
            "reviews_count": 31,
            "is_featured": True,
        },
        {
            "seller": seller_bob,
            "name": "Golden Harvest Millet & Canary Seed Melodic Diet (1kg)",
            "description": "Triple-cleaned white proso millet, canary grass seeds, flaxseeds, and red millet for parakeets, lovebirds, and finches. Boosts vocal vibrancy.",
            "price": 349.00,
            "discount_price": 289.00,
            "stock": 50,
            "pet_type": pet_types["birds"],
            "category": categories["food-nutrition"],
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/71/Domestic_canary_from_Morocco.jpg",
            "rating": 4.7,
            "reviews_count": 22,
            "is_featured": False,
        },
        {
            "seller": seller_alice,
            "name": "Natural Cuttlebone Calcium & Mineral Beak Conditioning Blocks (2-Pack)",
            "description": "Pure oceanic cuttlebone providing vital bio-available calcium and minerals essential for egg shell strength and natural beak trimming.",
            "price": 249.00,
            "discount_price": 199.00,
            "stock": 60,
            "pet_type": pet_types["birds"],
            "category": categories["health-care"],
            "image_url": "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80",
            "rating": 4.9,
            "reviews_count": 45,
            "is_featured": False,
        },

        # --- FISH & AQUATIC FOODS ---
        {
            "seller": seller_bob,
            "name": "Tropical Sun Spirulina Color-Enhancing Flakes (250g)",
            "description": "Specially enriched with natural Hawaiian spirulina and carotenoids. Formulated not to cloud aquarium water while enhancing brilliant blue and red fish scales.",
            "price": 399.00,
            "discount_price": 329.00,
            "stock": 70,
            "pet_type": pet_types["fish"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80",
            "rating": 4.78,
            "reviews_count": 56,
            "is_featured": True,
        },
        {
            "seller": seller_alice,
            "name": "Freeze-Dried Whole Bloodworms & Mysis Shrimp Gourmet Jar (100g)",
            "description": "Nutrient-dense protein delicacy flash-frozen to retain live food flavor without pathogen risk. Loved by Angelfish, Bettas, Discus, and Tetras.",
            "price": 499.00,
            "discount_price": 429.00,
            "stock": 42,
            "pet_type": pet_types["fish"],
            "category": categories["treats-snacks"],
            "image_url": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
            "rating": 4.92,
            "reviews_count": 39,
            "is_featured": False,
        },
        {
            "seller": seller_bob,
            "name": "Algae Feast Sinking Wafers for Plecos & Bottom Dwellers (200g)",
            "description": "Dense sinking disks with pure ascophyllum seaweed and spirulina. Perfect graze diet for Plecostomus, Corydoras catfish, and shrimp.",
            "price": 350.00,
            "discount_price": 299.00,
            "stock": 55,
            "pet_type": pet_types["fish"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80",
            "rating": 4.84,
            "reviews_count": 27,
            "is_featured": False,
        },

        # --- RABBIT & BUNNY FOODS ---
        {
            "seller": seller_bob,
            "name": "Western Timothy Grass 1st Cut High-Fiber Hay Bales (3kg)",
            "description": "Fragrant, hand-sorted sun-cured sweet timothy grass. Essential daily bulk fiber to prevent GI stasis and maintain continuous dental wear in bunnies.",
            "price": 850.00,
            "discount_price": 749.00,
            "stock": 35,
            "pet_type": pet_types["rabbits"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
            "rating": 4.95,
            "reviews_count": 68,
            "is_featured": True,
        },
        {
            "seller": seller_alice,
            "name": "Oxbow Pure Harvest Adult Rabbit Meadow Pellets (2.2kg)",
            "description": "Uniform high-fiber timothy pellets with rosemary, prebiotics, and essential chelated vitamins. Eliminates selective feeding in rabbits.",
            "price": 599.00,
            "discount_price": 499.00,
            "stock": 40,
            "pet_type": pet_types["rabbits"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=800&q=80",
            "rating": 4.88,
            "reviews_count": 34,
            "is_featured": False,
        },
        {
            "seller": seller_bob,
            "name": "Dried Dandelion, Chamomile & Rose Blossom Rabbit Crunch (150g)",
            "description": "100% all-natural dried herb blend including chamomile flowers, rose petals, and dandelion leaves to encourage rabbit natural foraging behavior.",
            "price": 299.00,
            "discount_price": 249.00,
            "stock": 50,
            "pet_type": pet_types["rabbits"],
            "category": categories["treats-snacks"],
            "image_url": "https://images.unsplash.com/photo-1591382386627-349b692688ff?auto=format&fit=crop&w=800&q=80",
            "rating": 4.9,
            "reviews_count": 26,
            "is_featured": False,
        },

        # --- HAMSTER & GUINEA PIG FOODS ---
        {
            "seller": seller_alice,
            "name": "Vitamin-C Supreme Stabilized Guinea Pig Food (2kg)",
            "description": "Guinea pigs cannot produce their own Vitamin C! This vet-formulated formula provides 100% daily stabilized ascorbic acid to prevent scurvy and promote immune health.",
            "price": 549.00,
            "discount_price": 479.00,
            "stock": 38,
            "pet_type": pet_types["hamsters"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80",
            "rating": 4.93,
            "reviews_count": 41,
            "is_featured": True,
        },
        {
            "seller": seller_bob,
            "name": "Dwarf & Syrian Hamster Seed & Grain Feast with Mealworms (1kg)",
            "description": "High-protein species-adapted mix with pumpkin seeds, milo, dried mealworms, rolled barley, and extruded green peas for energetic hamsters.",
            "price": 399.00,
            "discount_price": 349.00,
            "stock": 48,
            "pet_type": pet_types["hamsters"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80",
            "rating": 4.85,
            "reviews_count": 33,
            "is_featured": False,
        },
        {
            "seller": seller_bob,
            "name": "Timothy Hay Sun-Cured Small Pet Grass (2kg)",
            "description": "First-cut timothy hay for herbivorous small pets such as rabbits and guinea pigs. Provide unlimited hay where appropriate for the species, and ask a veterinarian about individual diet needs.",
            "price": 699.00,
            "discount_price": 599.00,
            "stock": 30,
            "pet_type": pet_types["small-pets"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
            "rating": 4.88,
            "reviews_count": 29,
            "is_featured": True,
        },

        # --- REPTILES & AMPHIBIANS FOODS ---
        {
            "seller": seller_alice,
            "name": "ReptiBite Omnivore Bearded Dragon Salad & Insect Bites (350g)",
            "description": "Moist, soft pellets enriched with dried crickets, dandelion greens, calcium carbonate, and vitamin D3 to prevent metabolic bone disease.",
            "price": 649.00,
            "discount_price": 549.00,
            "stock": 30,
            "pet_type": pet_types["reptiles"],
            "category": categories["food-nutrition"],
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Eastern-Bearded-Dragon-2.2%2C-Vic%2C-3.1.2008.jpg",
            "rating": 4.86,
            "reviews_count": 29,
            "is_featured": True,
        },
        {
            "seller": seller_bob,
            "name": "Aquatic Turtle Floating Sticks with River Gammarus Shrimp (400g)",
            "description": "Calcium-to-phosphorus balanced floating pellets for Red-Eared Sliders and Painted Turtles with whole dried gammarus shrimp for strong shell development.",
            "price": 449.00,
            "discount_price": 389.00,
            "stock": 45,
            "pet_type": pet_types["reptiles"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
            "rating": 4.79,
            "reviews_count": 24,
            "is_featured": False,
        },
        {
            "seller": seller_alice,
            "name": "Crested Gecko Papaya & Black Soldier Fly Larva Nectar Mash (250g)",
            "description": "Just add water! Wholesome powdered meal replacement with real tropical papaya, banana, and insect protein for fruit-eating geckos.",
            "price": 699.00,
            "discount_price": 599.00,
            "stock": 25,
            "pet_type": pet_types["reptiles"],
            "category": categories["food-nutrition"],
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Gekkoninae_Rhacodactylus_ciliatus_tete.png",
            "rating": 4.94,
            "reviews_count": 37,
            "is_featured": False,
        },

        # --- HORSE & FARM PET FOODS ---
        {
            "seller": seller_bob,
            "name": "EquiGlow Molasses Rolled Oats & Alfalfa Horse Mash (20kg)",
            "description": "Traditional warm conditioning feed combining steam-crimped oats, alfalfa chaff, black oil sunflower seeds, and sweet cane molasses for active horses.",
            "price": 2499.00,
            "discount_price": 2199.00,
            "stock": 15,
            "pet_type": pet_types["horses"],
            "category": categories["food-nutrition"],
            "image_url": "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=800&q=80",
            "rating": 4.91,
            "reviews_count": 19,
            "is_featured": True,
        },
        {
            "seller": seller_alice,
            "name": "Crispy Apple & Field Carrot Reward Horse Biscuits (2kg)",
            "description": "Oven-baked crunchy pocket treats made with whole oats, ground flaxseed, and real orchard apples. Won't crumble in your riding jacket.",
            "price": 799.00,
            "discount_price": 649.00,
            "stock": 28,
            "pet_type": pet_types["horses"],
            "category": categories["treats-snacks"],
            "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            "rating": 4.88,
            "reviews_count": 31,
            "is_featured": False,
        },
    ]

    for pdata in products_data:
        prod, created = Product.objects.get_or_create(
            name=pdata["name"],
            defaults=pdata,
        )
        if not created:
            for k, v in pdata.items():
                setattr(prod, k, v)
            prod.save()

    # Update demo cart & order for alex_customer
    cart, _ = Cart.objects.get_or_create(user=customer_alex)
    sample_prod = Product.objects.filter(is_featured=True).first()
    if sample_prod and not cart.items.exists():
        CartItem.objects.create(cart=cart, product=sample_prod, quantity=1)

    print("[SUCCESS] Seed completed successfully with INR prices!")

if __name__ == "__main__":
    run_seed()
