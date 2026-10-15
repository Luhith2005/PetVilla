import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Store, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getPetImage } from '../data/petCareGuide';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;
  const isFoodProduct = product.category_name?.toLowerCase().includes('food');

  const handleAddToCart = async () => {
    if (!product.in_stock) return;
    setIsAdding(true);
    const res = await addToCart(product.id, quantity);
    setIsAdding(false);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content product-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="detail-grid">
          {/* Left: Product Image */}
          <div className="detail-media">
            <img
              src={
                product.image_url ||
                getPetImage(product.pet_type_name)
              }
              alt={product.name}
              className="detail-main-img"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getPetImage(product.pet_type_name);
              }}
            />
            {discountPercent && (
              <span className="badge badge-warning detail-discount-pill">
                Save {discountPercent}% Today
              </span>
            )}
          </div>

          {/* Right: Info and Actions */}
          <div className="detail-body">
            <div className="detail-category-row">
              <span className="badge badge-primary">
                {product.pet_type_name || 'Pet Care'}
              </span>
              <span className="badge badge-secondary">
                {product.category_name || 'General Supplies'}
              </span>
            </div>

            <h2 className="detail-title">{product.name}</h2>

            <div className="detail-seller-rating">
              <div className="rating-box">
                <Star size={16} className="star-filled" />
                <strong>{parseFloat(product.rating || 4.8).toFixed(1)}</strong>
                <span className="text-muted">({product.reviews_count || 12} reviews)</span>
              </div>
              <div className="seller-tag">
                <Store size={14} />
                <span>Verified Seller: <strong>{product.seller_username}</strong></span>
              </div>
            </div>

            {/* Price Row */}
            <div className="detail-price-box">
              <span className="detail-current-price">
                ₹{parseFloat(product.final_price).toLocaleString('en-IN')}
              </span>
              {discountPercent && (
                <span className="detail-old-price">
                  ₹{parseFloat(product.price).toLocaleString('en-IN')}
                </span>
              )}
              <span className={`stock-status-pill ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                {product.in_stock ? `● In Stock (${product.stock} available)` : '✕ Out of Stock'}
              </span>
            </div>

            <div className="detail-divider" />

            <p className="detail-description">{product.description}</p>
            {product.pet_type_name && (
              <p className="detail-suitable-for">
                {isFoodProduct ? 'Food for' : 'Made for'}: {product.pet_type_name}
              </p>
            )}

            {/* Quantity Selector & Add Button */}
            <div className="detail-actions-box">
              <div className="quantity-stepper">
                <button
                  className="step-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !product.in_stock}
                >
                  -
                </button>
                <span className="step-val">{quantity}</span>
                <button
                  className="step-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || !product.in_stock}
                >
                  +
                </button>
              </div>

              <button
                className={`btn btn-lg ${addedSuccess ? 'btn-success' : 'btn-primary'} flex-1`}
                onClick={handleAddToCart}
                disabled={!product.in_stock || isAdding}
              >
                {addedSuccess ? (
                  <>
                    <Check size={20} /> Added to Basket!
                  </>
                ) : isAdding ? (
                  'Adding...'
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add ({quantity}) to Basket
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="detail-perks">
              <div className="perk">
                <Truck size={16} /> <span>Fast Track Delivery</span>
              </div>
              <div className="perk">
                <ShieldCheck size={16} /> <span>100% Genuine Pet Product</span>
              </div>
              <div className="perk">
                <RotateCcw size={16} /> <span>14-Day Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
