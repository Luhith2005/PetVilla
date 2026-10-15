import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getPetImage } from '../data/petCareGuide';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!product.in_stock) return;
    setIsAdding(true);
    const res = await addToCart(product.id, 1);
    setIsAdding(false);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;
  const isFoodProduct = product.category_name?.toLowerCase().includes('food');

  return (
    <div className="product-card card" onClick={() => onQuickView(product)}>
      {/* Thumbnail & Badges */}
      <div className="product-img-wrap">
        <img
          src={
            product.image_url ||
            getPetImage(product.pet_type_name)
          }
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getPetImage(product.pet_type_name);
          }}
        />

        <div className="card-top-badges">
          {discountPercent && (
            <span className="badge badge-warning discount-tag">
              -{discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="badge badge-accent featured-tag">
              ★ Popular
            </span>
          )}
        </div>

        <button
          className="quick-view-overlay-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          aria-label="Quick View Details"
        >
          <Eye size={18} /> Quick View
        </button>
      </div>

      {/* Details */}
      <div className="product-info">
        <div className="product-meta">
          <span className="product-category-label">
            {product.pet_type_name ? `${product.pet_type_name} • ` : ''}
            {product.category_name || 'Supplies'}
          </span>
          <div className="product-rating">
            <Star size={14} className="star-filled" />
            <span>{parseFloat(product.rating || 4.8).toFixed(1)}</span>
            <span className="reviews-sub">({product.reviews_count || 12})</span>
          </div>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc-snippet">{product.description}</p>
        {product.pet_type_name && (
          <p className="product-suitable-for">
            {isFoodProduct ? 'Food for' : 'For'}: {product.pet_type_name}
          </p>
        )}

        {/* Pricing & Stock */}
        <div className="product-footer">
          <div className="price-container">
            <span className="current-price">
              ₹{parseFloat(product.final_price).toLocaleString('en-IN')}
            </span>
            {discountPercent && (
              <span className="original-price">
                ₹{parseFloat(product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            className={`btn btn-sm ${
              justAdded
                ? 'btn-success'
                : product.in_stock
                ? 'btn-primary'
                : 'btn-secondary disabled'
            }`}
            onClick={handleAdd}
            disabled={!product.in_stock || isAdding}
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added
              </>
            ) : isAdding ? (
              'Adding...'
            ) : product.in_stock ? (
              <>
                <ShoppingBag size={16} /> Add
              </>
            ) : (
              'Sold Out'
            )}
          </button>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <div className="low-stock-alert">
            Only {product.stock} items left in stock!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
