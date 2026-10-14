import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersService } from '../services/api';

const CheckoutModal = ({ onClose, onOrderSuccess, onOpenAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart, fetchCart } = useCart();

  const [formData, setFormData] = useState({
    shipping_full_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.username || ''),
    shipping_email: user?.email || '',
    shipping_phone: '+91 98765 43210',
    shipping_address: 'Flat 302, Palm Meadows, Whitefield',
    shipping_city: 'Bengaluru',
    shipping_postal_code: '560066',
    payment_method: 'UPI (GPay / PhonePe / Paytm)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = parseFloat(cart.total_price || 0);
  const shippingFee = subtotal >= 799 ? 0 : 49;
  const orderTotal = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await ordersService.createOrder(formData);
      setPlacedOrder(res.data.order);
      await fetchCart(); // Cart is cleared on backend
      if (onOrderSuccess) onOrderSuccess(res.data.order);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Failed to place order. Please review your shipping details.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {placedOrder ? (
          /* Order Confirmation Screen */
          <div className="order-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={56} className="text-success" />
            </div>
            <h2>Order Confirmed!</h2>
            <p className="order-num-pill">
              Order #{placedOrder.order_number}
            </p>
            <p className="success-msg">
              Thank you for shopping at PetVilla! Your pet supplies are being carefully packed and prepared for dispatch.
            </p>

            <div className="order-summary-box">
              <div className="summary-row">
                <span>Items:</span>
                <span>{placedOrder.items?.length || 0} items</span>
              </div>
              <div className="summary-row">
                <span>Shipping to:</span>
                <span>{placedOrder.shipping_full_name}, {placedOrder.shipping_city}</span>
              </div>
              <div className="summary-row font-bold">
                <span>Total Paid:</span>
                <span className="text-primary">₹{parseFloat(placedOrder.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="checkout-header">
              <h2>Secure Pet Checkout</h2>
              <p>Complete your delivery and payment details</p>
            </div>

            {!isAuthenticated ? (
              <div className="auth-required-banner">
                <p>Please log in or create an account to finalize your order.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                >
                  Sign In to Continue
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="checkout-form">
                {errorMsg && (
                  <div className="form-error-banner">
                    {errorMsg}
                  </div>
                )}

                <div className="checkout-section-title">
                  <Truck size={18} /> Shipping Information
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="shipping_full_name"
                      value={formData.shipping_full_name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="shipping_phone"
                      value={formData.shipping_phone}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="checkout-section-title">
                  <CreditCard size={18} /> Payment Method
                </div>

                <div className="payment-options-grid">
                  {[
                    { label: 'UPI (GPay / PhonePe / Paytm)', icon: '📱' },
                    { label: 'Credit / Debit Card (Visa / RuPay)', icon: '💳' },
                    { label: 'Cash on Delivery (COD)', icon: '💵' },
                  ].map((method) => (
                    <label
                      key={method.label}
                      className={`payment-option-card ${
                        formData.payment_method === method.label ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.label}
                        checked={formData.payment_method === method.label}
                        onChange={handleChange}
                      />
                      <span className="pay-icon">{method.icon}</span>
                      <span className="pay-label">{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Order Summary Breakdown */}
                <div className="checkout-totals-card">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping:</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total Due:</span>
                    <span className="text-primary">₹{orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block place-order-btn"
                  disabled={isSubmitting || cart.total_items === 0}
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : (
                    `Place Order • ₹${orderTotal.toLocaleString('en-IN')}`
                  )}
                </button>

                <div className="security-notice">
                  <ShieldCheck size={16} /> 256-Bit SSL Encrypted & Protected Checkout
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
