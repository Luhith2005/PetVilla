import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ onCheckoutClick, onContinueShopping }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const items = cart.items || [];
  const totalPrice = parseFloat(cart.total_price || 0);
  const freeShippingThreshold = 799.0;
  const freeShippingProgress = Math.min(
    100,
    (totalPrice / freeShippingThreshold) * 100
  );

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <ShoppingBag className="text-primary" size={22} />
            <h2 className="drawer-title">Your Pet Basket</h2>
            <span className="badge badge-primary">{cart.total_items || 0}</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="shipping-meter-box">
          <div className="shipping-text">
            {totalPrice >= freeShippingThreshold ? (
              <span className="text-success font-semibold">
                🎉 Congratulations! You have unlocked Free Pet Delivery!
              </span>
            ) : (
              <span>
                Add{' '}
                <strong>
                  ₹{Math.max(0, Math.round(freeShippingThreshold - totalPrice)).toLocaleString('en-IN')}
                </strong>{' '}
                more for <strong>FREE Delivery</strong>
              </span>
            )}
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-paw-icon">🐾</div>
              <h3>Your basket is empty</h3>
              <p>Looks like your furry friend is waiting for some goodies!</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsCartOpen(false);
                  if (onContinueShopping) onContinueShopping();
                }}
              >
                Browse Pet Catalog
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img
                    src={
                      item.product.image_url ||
                      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={item.product.name}
                    className="cart-item-img"
                  />

                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.product.name}</h4>
                    <div className="cart-item-price-row">
                      <span className="item-unit-price">
                        ₹{parseFloat(item.product.final_price).toLocaleString('en-IN')} each
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <div className="item-stepper">
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-val">{item.quantity}</span>
                        <button
                          className="stepper-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="item-line-total">
                        ₹{parseFloat(item.line_total).toLocaleString('en-IN')}
                      </div>

                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <span className="subtotal-val">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="subtotal-row text-muted" style={{ fontSize: '0.85rem' }}>
              <span>Delivery:</span>
              <span>
                {totalPrice >= freeShippingThreshold ? 'FREE' : '₹49'}
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg btn-block checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                onCheckoutClick();
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-outline btn-sm btn-clear-cart"
              onClick={clearCart}
            >
              Clear Basket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
