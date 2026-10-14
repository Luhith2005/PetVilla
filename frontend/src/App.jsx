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
      if (activePetType !== 'all') params.pet_type = activePetType;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      if (sortBy === 'price_asc') params.ordering = 'price';
      else if (sortBy === 'price_desc') params.ordering = '-price';
      else if (sortBy === 'rating') params.ordering = '-rating';
      else params.ordering = '-created_at';

      const res = await productsService.getProducts(params);
      let list = res.data.results || res.data || [];

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
        setActivePetType={setActivePetType}
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
            onSelectPet={(slug) => setActivePetType(slug)}
          />

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
                          setActivePetType('all');
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
                        onClick={() => setActivePetType('all')}
                      >
                        All Pets
                      </button>
                      {petTypes.map((pt) => (
                        <button
                          key={pt.id}
                          className={`filter-chip ${activePetType === pt.slug ? 'active' : ''}`}
                          onClick={() => setActivePetType(pt.slug)}
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
                          setActivePetType('all');
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
