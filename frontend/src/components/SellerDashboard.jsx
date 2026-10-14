import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Store,
  Layers,
  ShoppingBag,
  X,
  Save,
  CheckCircle,
} from 'lucide-react';
import { sellerService, productsService } from '../services/api';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [petTypes, setPetTypes] = useState([]);

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [loading, setLoading] = useState(true);

  // Edit / Add Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    stock: 10,
    category: '',
    pet_type: '',
    image_url: '',
    is_featured: false,
    is_active: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, catRes, petRes] = await Promise.all([
        sellerService.getDashboardStats(),
        sellerService.getProducts(),
        sellerService.getOrders(),
        productsService.getCategories(),
        productsService.getPetTypes(),
      ]);

      setStats(statsRes.data);
      setProducts(productsRes.data.results || productsRes.data || []);
      setOrders(ordersRes.data?.orders || []);
      setCategories(catRes.data || []);
      setPetTypes(petRes.data || []);
    } catch (err) {
      console.error('Failed to load seller dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      discount_price: '',
      stock: 15,
      category: categories[0]?.id || '',
      pet_type: petTypes[0]?.id || '',
      image_url:
        'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      is_featured: false,
      is_active: true,
    });
    setFormError(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      discount_price: prod.discount_price || '',
      stock: prod.stock,
      category: prod.category || '',
      pet_type: prod.pet_type || '',
      image_url: prod.image_url || '',
      is_featured: prod.is_featured,
      is_active: prod.is_active,
    });
    setFormError(null);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await sellerService.deleteProduct(id);
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      discount_price: productForm.discount_price
        ? parseFloat(productForm.discount_price)
        : null,
      stock: parseInt(productForm.stock, 10),
      category: productForm.category || null,
      pet_type: productForm.pet_type || null,
    };

    try {
      if (editingProduct) {
        await sellerService.updateProduct(editingProduct.id, payload);
      } else {
        await sellerService.createProduct(payload);
      }
      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err) {
      setFormError(
        err.response?.data?.detail ||
          'Failed to save product. Please check required fields.'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="seller-dashboard-wrapper">
      <div className="container">
        {/* Dashboard Header */}
        <div className="seller-header">
          <div>
            <div className="seller-badge">
              <Store size={16} /> Verified Pet Seller
            </div>
            <h1 className="seller-title">
              Seller Hub: <span>{stats?.seller || 'Pet Vendor'}</span>
            </h1>
            <p className="seller-subtitle">
              Manage your pet inventory, track incoming fulfillment orders, and review store revenue.
            </p>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleOpenAddModal}>
            <Plus size={18} /> Add New Pet Product
          </button>
        </div>

        {/* KPI Cards */}
        <div className="seller-kpi-grid">
          <div className="kpi-card card">
            <div className="kpi-icon-wrap bg-primary-soft">
              <Package size={24} className="text-primary" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Active Catalog</span>
              <h2 className="kpi-value">{stats?.total_products || 0}</h2>
              <span className="kpi-sub text-muted">Listed pet products</span>
            </div>
          </div>

          <div className="kpi-card card">
            <div className="kpi-icon-wrap bg-success-soft">
              <DollarSign size={24} className="text-success" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Total Revenue</span>
              <h2 className="kpi-value">
                ₹{(stats?.total_revenue || 0).toLocaleString('en-IN')}
              </h2>
              <span className="kpi-sub text-success">From customer orders</span>
            </div>
          </div>

          <div className="kpi-card card">
            <div className="kpi-icon-wrap bg-accent-soft">
              <TrendingUp size={24} className="text-accent" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Items Sold</span>
              <h2 className="kpi-value">{stats?.total_items_sold || 0}</h2>
              <span className="kpi-sub text-muted">Units dispatched</span>
            </div>
          </div>

          <div className="kpi-card card">
            <div className="kpi-icon-wrap bg-warning-soft">
              <AlertTriangle size={24} className="text-warning" />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Low Stock Alerts</span>
              <h2 className="kpi-value">{stats?.low_stock_count || 0}</h2>
              <span className="kpi-sub text-warning">Needs replenishment</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="seller-tabs-bar">
          <button
            className={`seller-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Layers size={18} /> My Listed Products ({products.length})
          </button>
          <button
            className={`seller-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Received Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="seller-table-card card">
            <div className="table-responsive">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-muted">
                        No products listed yet. Click "Add New Pet Product" to begin!
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <div className="table-product-cell">
                            <img
                              src={
                                prod.image_url ||
                                'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80'
                              }
                              alt={prod.name}
                              className="table-product-thumb"
                            />
                            <div>
                              <div className="font-semibold text-main">{prod.name}</div>
                              <span className="text-muted text-xs">
                                {prod.pet_type_name || 'All Pets'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{prod.category_name || 'General'}</td>
                        <td>
                          <div className="font-bold text-primary">
                            ₹{parseFloat(prod.final_price).toLocaleString('en-IN')}
                          </div>
                          {prod.discount_price && (
                            <span className="text-muted line-through text-xs">
                              ₹{parseFloat(prod.price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              prod.stock > 5
                                ? 'badge-success'
                                : prod.stock > 0
                                ? 'badge-warning'
                                : 'badge-secondary'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                        </td>
                        <td>
                          {prod.is_featured ? (
                            <span className="badge badge-accent">Featured</span>
                          ) : (
                            <span className="text-muted text-xs">Standard</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEditModal(prod)}
                              title="Edit Product"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-outline btn-sm text-danger"
                              onClick={() => handleDeleteProduct(prod.id)}
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Table */}
        {activeTab === 'orders' && (
          <div className="seller-table-card card">
            <div className="table-responsive">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-muted">
                        No orders received for your products yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="font-bold">#{ord.order_number}</td>
                        <td>
                          <div>{ord.customer_name}</div>
                          <span className="text-muted text-xs">{ord.shipping_city}</span>
                        </td>
                        <td>{ord.product_name}</td>
                        <td>
                          <strong>{ord.quantity}</strong> pcs
                        </td>
                        <td className="font-bold text-primary">
                          ₹{parseFloat(ord.line_total).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className="badge badge-primary">
                            {ord.order_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div
            className="modal-content product-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-row">
                <Store className="text-primary" size={22} />
                <h2>
                  {editingProduct ? 'Edit Product' : 'List New Pet Product'}
                </h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="product-form-body">
              {formError && (
                <div className="form-error-banner">{formError}</div>
              )}

              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Ultra-Soft Velvet Cat Bed"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Pet Type *</label>
                  <select
                    value={productForm.pet_type}
                    onChange={(e) =>
                      setProductForm({ ...productForm, pet_type: e.target.value })
                    }
                    required
                    className="form-select"
                  >
                    <option value="">Select Pet Type</option>
                    {petTypes.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    required
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Regular Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    required
                    placeholder="1299"
                    className="form-input"
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Discount Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={productForm.discount_price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        discount_price: e.target.value,
                      })
                    }
                    placeholder="Optional promo price (e.g. 999)"
                    className="form-input"
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Initial Stock *</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Unsplash or direct CDN)</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image_url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  required
                  placeholder="Detailed description of materials, benefits, pet sizing and directions..."
                  className="form-textarea"
                />
              </div>

              <div className="form-row-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        is_featured: e.target.checked,
                      })
                    }
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={productForm.is_active}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <span>Active & Visible in Store</span>
                </label>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formSubmitting}
                >
                  <Save size={16} />{' '}
                  {formSubmitting
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
