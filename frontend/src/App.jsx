import React, { useState, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  Search,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { productsService } from './services/api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import ProfileModal from './components/ProfileModal';
import AuthModal from './components/AuthModal';
import SellerDashboard from './components/SellerDashboard';
import Footer from './components/Footer';
import petCareGuides from './data/petCareGuide';

function App() {
  const { user, isSeller } = useAuth();
  const { toastMessage, setIsCartOpen } = useCart();

  // Navigation & View State
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Catalog State
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetSection, setSelectedPetSection] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [carePostalCode] = useState('500054');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activePetType, setActivePetType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price_asc', 'price_desc', 'rating'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);

  // Load initial static datasets (Categories, Pet Types, Featured)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catRes, petRes, featRes] = await Promise.all([
          productsService.getCategories(),
          productsService.getPetTypes(),
          productsService.getFeatured(),
        ]);
        setCategories(catRes.data || []);
        setPetTypes(petRes.data || []);
        setFeaturedProducts(featRes.data || []);
      } catch (err) {
        console.error('Failed to load initial catalog data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Fetch filtered products from backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      if (sortBy === 'price_asc') params.ordering = 'price';
      else if (sortBy === 'price_desc') params.ordering = '-price';
      else if (sortBy === 'rating') params.ordering = '-rating';
      else params.ordering = '-created_at';

      const petTypeFilters = ['hamsters', 'small-pets'].includes(activePetType)
        ? ['hamsters', 'small-pets']
        : [activePetType];
      const productLists = await Promise.all(petTypeFilters.map(async (petType) => {
        const petParams = { ...params };
        if (activePetType !== 'all') petParams.pet_type = petType;

        let page = 1;
        let hasNextPage = true;
        let list = [];
        while (hasNextPage) {
          const res = await productsService.getProducts({ ...petParams, page });
          const data = res.data;
          list = list.concat(data.results || data || []);
          hasNextPage = Boolean(data.next);
          page += 1;
        }
        return list;
      }));
      let list = [...new Map(productLists.flat().map((product) => [product.id, product])).values()];

      // Client-side quick refinement for price and in-stock toggle
      if (inStockOnly) {
        list = list.filter((p) => p.in_stock);
      }
      if (maxPrice < 5000) {
        list = list.filter((p) => parseFloat(p.final_price) <= maxPrice);
      }

      setProducts(list);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250); // slight debounce for live search
    return () => clearTimeout(timer);
  }, [searchQuery, activePetType, selectedCategory, sortBy, inStockOnly, maxPrice]);

  const selectPetType = (petType, scrollToGuide = true) => {
    setActivePetType(petType);
    setSelectedPetSection(petCareGuides[petType] ? { slug: petType, ...petCareGuides[petType] } : null);
    setSelectedPet(null);
    setSelectedCategory('all');
    setSearchQuery('');
    if (scrollToGuide) {
      window.requestAnimationFrame(() => {
        document.getElementById('pet-guide-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const browsePet = (petType) => {
    selectPetType(petType, false);
    window.requestAnimationFrame(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const choosePetSection = (section) => {
    selectPetType(section.slug, false);
  };

  const relatedPetTypeSlugs = ['hamsters', 'small-pets'].includes(selectedPetSection?.slug)
    ? ['hamsters', 'small-pets']
    : [selectedPetSection?.slug];
  const sectionPetTypes = petTypes.filter((type) => relatedPetTypeSlugs.includes(type.slug));
  const productsForPetType = selectedPetSection
    ? products.filter((product) =>
        sectionPetTypes.length > 0
          ? sectionPetTypes.some((type) => String(product.pet_type) === String(type.id))
          : product.pet_type_name?.toLowerCase().includes(selectedPetSection.title.toLowerCase())
      )
    : [];
  const breedMatches = selectedPet
    ? productsForPetType.filter((product) =>
        selectedPet.tags.some((tag) =>
          `${product.name} ${product.description}`.toLowerCase().includes(tag)
        )
      )
    : [];
  const productsForSelectedPet = selectedPet ? breedMatches : productsForPetType;
  const selectedCategoryInfo = categories.find((category) => category.slug === selectedCategory);
  const nearbyVetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`veterinary hospital near ${carePostalCode}, Hyderabad, Telangana`)}`;
  const nearbyPharmacyUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`veterinary pharmacy pet medicine shop near ${carePostalCode}, Hyderabad, Telangana`)}`;

  return (
    <div className="petvilla-app">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`toast-banner toast-${toastMessage.type}`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activePetType={activePetType}
        setActivePetType={selectPetType}
        petTypes={petTypes}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isSellerMode={isSellerMode}
        setIsSellerMode={setIsSellerMode}
      />

      {isSellerMode ? (
        /* Seller Management Dashboard */
        <main className="main-content">
          <SellerDashboard />
        </main>
      ) : (
        /* Customer Storefront */
        <main className="main-content">
          {/* Hero Banner with value props */}
          <HeroBanner
            onShopNowClick={() => {
              const catalogEl = document.getElementById('catalog-section');
              if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectPet={browsePet}
          />

          <section className="pet-guide-section" aria-labelledby="pet-guide-heading">
            <div className="container">
              <div className="section-title-wrap">
                <div className="badge badge-accent">Shop and care by pet</div>
                <h2 className="section-heading" id="pet-guide-heading">Choose your pet</h2>
                <p className="section-subheading">
                  Choose an animal group, then a breed or species to see suitable supplies and care guidance.
                </p>
              </div>
              <div className="pet-section-grid">
                {Object.entries(petCareGuides).map(([slug, section]) => (
                  <button
                    className={`pet-section-card card ${selectedPetSection?.slug === slug ? 'active' : ''}`}
                    key={slug}
                    onClick={() => choosePetSection({ slug })}
                    aria-pressed={selectedPetSection?.slug === slug}
                  >
                    <img
                      className="pet-section-image"
                      src={section.image}
                      alt={section.title}
                      loading="lazy"
                    />
                    <strong className="pet-guide-name">{section.title}</strong>
                    <span className="pet-guide-link">View breeds & species →</span>
                  </button>
                ))}
              </div>
              {selectedPetSection && (
                <div className="pet-guide-stage">
                  <div className="pet-guide-stage-heading">
                    <div>
                      <span className="pet-guide-group">Step 1 · {selectedPetSection.title}</span>
                      <h3>Choose a breed or species</h3>
                    </div>
                    <button className="btn-link-reset" onClick={() => selectPetType('all')}>
                      Show all pets
                    </button>
                  </div>
                  <div className="species-grid">
                    {selectedPetSection.animals.map((animal) => (
                      <button
                        key={animal.name}
                        className={`species-card ${selectedPet?.name === animal.name ? 'active' : ''}`}
                        onClick={() => setSelectedPet(animal)}
                        aria-pressed={selectedPet?.name === animal.name}
                      >
                        <img
                          className="species-card-image"
                          src={animal.image || selectedPetSection.image}
                          alt={animal.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = selectedPetSection.image;
                          }}
                        />
                        <span className="species-card-name">{animal.name}</span>
                      </button>
                    ))}
                  </div>
                  {selectedPetSection.imageCredits?.length > 0 && (
                    <p className="pet-image-credits">
                      <strong>Image credits:</strong>{' '}
                      {selectedPetSection.imageCredits.map((credit, index) => (
                        <span key={credit.label}>
                          <a href={credit.source} target="_blank" rel="noreferrer">{credit.label}</a>
                          {' '}(<a href={credit.license} target="_blank" rel="noreferrer">{credit.licenseName}</a>)
                          {index < selectedPetSection.imageCredits.length - 1 ? '; ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}
              {selectedPet && (
                <div className="pet-food-results">
                  <div className="pet-guide-stage-heading">
                    <div>
                      <span className="pet-guide-group">Step 2 · {selectedPetSection.title}</span>
                      <h3>{selectedPet.name}: matching supplies & care</h3>
                    </div>
                  </div>
                  <div className="species-profile">
                    <img
                      className="species-profile-image"
                      src={selectedPet.image || selectedPetSection.image}
                      alt={selectedPet.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = selectedPetSection.image;
                      }}
                    />
                    <div>
                      <h4>Food & nutrition</h4>
                      <p>{selectedPet.food}</p>
                    </div>
                  </div>
                  <h4 className="pet-category-guide-title">What to look for in each product section</h4>
                  <div className="pet-category-guides">
                    {categories.map((category) => (
                      <button
                        className={`pet-category-guide ${selectedCategory === category.slug ? 'active' : ''}`}
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                      >
                        <strong>{category.name}</strong>
                        <span>
                          {selectedPetSection.care[category.slug] ||
                            `Choose products specifically labeled for ${selectedPet.name}; check suitability and instructions before use.`}
                        </span>
                        <em>Show matching products →</em>
                      </button>
                    ))}
                  </div>
                  {selectedCategoryInfo && selectedPetSection.care[selectedCategoryInfo.slug] && (
                    <p className="pet-category-selected-advice">
                      <strong>{selectedCategoryInfo.name} for {selectedPet.name}:</strong>{' '}
                      {selectedPetSection.care[selectedCategoryInfo.slug]}
                    </p>
                  )}
                  <div className="local-care-panel">
                    <div>
                      <span className="pet-guide-group">Local veterinary care · {carePostalCode}</span>
                      <h4>Find a nearby pet hospital or medicine shop</h4>
                      <p>Open current map listings near PIN {carePostalCode}, Hyderabad. Call the provider to confirm species accepted, hours, and medicine availability.</p>
                    </div>
                    <a href={nearbyVetUrl} target="_blank" rel="noreferrer">
                      Veterinary hospitals
                    </a>
                    <a href={nearbyPharmacyUrl} target="_blank" rel="noreferrer">
                      Pet medicine shops
                    </a>
                    <p className="pet-care-warning">
                      Do not give human medicines or start pet medicines without a veterinarian’s direction.
                    </p>
                  </div>
                  <div className="pet-products-results">
                    <div className="pet-guide-stage-heading">
                      <div>
                        <span className="pet-guide-group">Matching catalog items</span>
                        <h4>
                          {selectedCategoryInfo?.name || 'All product types'} for {selectedPetSection.title}
                        </h4>
                      </div>
                    </div>
                    {productsForSelectedPet.length > 0 ? (
                      <div className="products-grid pet-food-grid">
                        {productsForSelectedPet.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={(item) => setQuickViewProduct(item)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="pet-food-empty">
                        No catalog item matches this species and product type yet. We won’t show another species’ food or supplies as a substitute.
                      </p>
                    )}
                  </div>
                </div>
              )}
              <p className="pet-guide-note">
                Pet needs differ by species, age, and health. Check the label and consult a qualified veterinarian for individual advice.
              </p>
              <div className="pet-care-sources">
                <strong>Care references:</strong>
                <a href="https://www.aspca.org/pet-care/dog-care/dog-nutrition-tips" target="_blank" rel="noreferrer">ASPCA dog nutrition</a>
                <a href="https://www.aspca.org/pet-care/cat-care/cat-nutrition-tips" target="_blank" rel="noreferrer">ASPCA cat nutrition</a>
                <a href="https://www.rspca.org.uk/adviceandwelfare/pets/dogs/diet" target="_blank" rel="noreferrer">RSPCA dog diet</a>
                <a href="https://www.rspca.org.uk/adviceandwelfare/pets/cats/diet" target="_blank" rel="noreferrer">RSPCA cat diet</a>
                <a href="https://www.rspca.org.uk/adviceandwelfare/pets/birds/diet" target="_blank" rel="noreferrer">RSPCA bird diet</a>
                <a href="https://www.rspca.org.uk/adviceandwelfare/pets/rabbits/diet" target="_blank" rel="noreferrer">RSPCA rabbit diet</a>
                <a href="https://www.rspca.org.uk/adviceandwelfare/pets/fish" target="_blank" rel="noreferrer">RSPCA fish care</a>
                <a href="https://www.rspca.org.uk/adviceandwelfare/pets/rodents/hamsters" target="_blank" rel="noreferrer">RSPCA hamster care</a>
                <a href="https://www.petmd.com/exotic/what-can-hamsters-eat" target="_blank" rel="noreferrer">PetMD hamster diet</a>
                <a href="https://www.petmd.com/exotic/what-can-guinea-pigs-eat" target="_blank" rel="noreferrer">PetMD guinea pig diet</a>
                <a href="https://www.petmd.com/reptile/nutrition/what-do-turtles-eat" target="_blank" rel="noreferrer">PetMD turtle diet</a>
                <a href="https://www.aspca.org/pet-care/aspca-poison-control/people-foods-avoid-feeding-your-pets" target="_blank" rel="noreferrer">ASPCA foods to avoid</a>
                <span>Reptile and amphibian diets vary by species; turtle guidance does not apply to every species.</span>
              </div>
            </div>
          </section>

          {/* Featured Spotlight Section */}
          {featuredProducts.length > 0 && !searchQuery && activePetType === 'all' && (
            <section className="featured-section">
              <div className="container">
                <div className="section-title-wrap">
                  <div className="badge badge-accent">
                    <Sparkles size={14} /> Top Pet Picks
                  </div>
                  <h2 className="section-heading">Featured Bestsellers</h2>
                  <p className="section-subheading">
                    Handpicked essentials loved by pet parents and verified by veterinarians.
                  </p>
                </div>

                <div className="products-grid featured-grid">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main Catalog & Filter Section */}
          <section id="catalog-section" className="catalog-section">
            <div className="container">
              <div className="catalog-layout">
                {/* Left: Filter Sidebar */}
                <aside className="filter-sidebar card">
                  <div className="filter-header">
                    <div className="filter-header-title">
                      <SlidersHorizontal size={18} className="text-primary" />
                      <h3>Filter Supplies</h3>
                    </div>
                    {(activePetType !== 'all' ||
                      selectedCategory !== 'all' ||
                      inStockOnly ||
                      maxPrice < 5000 ||
                      searchQuery) && (
                      <button
                        className="btn-link-reset"
                        onClick={() => {
                          selectPetType('all');
                          setSelectedCategory('all');
                          setInStockOnly(false);
                          setMaxPrice(5000);
                          setSearchQuery('');
                        }}
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Filter: Pet Type */}
                  <div className="filter-group">
                    <label className="filter-group-title">Pet Category</label>
                    <div className="filter-options-stack">
                      <button
                        className={`filter-chip ${activePetType === 'all' ? 'active' : ''}`}
                        onClick={() => selectPetType('all')}
                      >
                        All Pets
                      </button>
                      {petTypes.map((pt) => (
                        <button
                          key={pt.id}
                          className={`filter-chip ${activePetType === pt.slug ? 'active' : ''}`}
                          onClick={() => selectPetType(pt.slug)}
                        >
                          {pt.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter: Category */}
                  <div className="filter-group">
                    <label className="filter-group-title">Product Type</label>
                    <div className="filter-options-stack">
                      <button
                        className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                      >
                        All Categories
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          className={`filter-chip ${selectedCategory === c.slug ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(c.slug)}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter: Price Range */}
                  <div className="filter-group">
                    <div className="filter-price-header">
                      <label className="filter-group-title">Max Price</label>
                      <span className="font-bold text-primary">₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="5000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="price-slider"
                    />
                    <div className="price-slider-labels text-muted">
                      <span>₹200</span>
                      <span>₹5,000+</span>
                    </div>
                  </div>

                  {/* Filter: In Stock Only */}
                  <div className="filter-group checkbox-filter">
                    <label className="custom-toggle-label">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                      />
                      <span>In Stock Items Only</span>
                    </label>
                  </div>
                </aside>

                {/* Right: Products Area */}
                <div className="catalog-products-area">
                  {/* Sorting Bar */}
                  <div className="catalog-toolbar">
                    <div className="results-count-text">
                      Showing <strong>{products.length}</strong> pet supplies
                      {searchQuery && (
                        <span>
                          {' '}
                          for <em>"{searchQuery}"</em>
                        </span>
                      )}
                    </div>

                    <div className="sort-box">
                      <ArrowUpDown size={16} className="text-muted" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                        aria-label="Sort products by"
                      >
                        <option value="newest">Sort by: Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated Pet Favs</option>
                      </select>
                    </div>
                  </div>

                  {/* Products Grid */}
                  {loading ? (
                    <div className="loading-grid-state">
                      <div className="loading-spinner">🐾</div>
                      <p>Fetching fresh pet goodies...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="empty-catalog-card card">
                      <Search size={48} className="text-muted mb-2" />
                      <h3>No Matching Pet Supplies Found</h3>
                      <p className="text-muted">
                        Try adjusting your filters, clearing your search query, or checking back soon!
                      </p>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                          selectPetType('all');
                          setSelectedCategory('all');
                          setSearchQuery('');
                          setMaxPrice(5000);
                          setInStockOnly(false);
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="products-grid">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onQuickView={(p) => setQuickViewProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        onCheckoutClick={() => setIsCheckoutModalOpen(true)}
        onContinueShopping={() => {
          const catalogEl = document.getElementById('catalog-section');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {isCheckoutModalOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutModalOpen(false)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {isOrdersModalOpen && (
        <OrdersModal onClose={() => setIsOrdersModalOpen(false)} />
      )}

      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
