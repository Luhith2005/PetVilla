import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle, AlertCircle, Ban } from 'lucide-react';
import { ordersService } from '../services/api';

const OrdersModal = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersService.getOrders();
      setOrders(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancellingId(orderId);
      await ordersService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge badge-success"><CheckCircle size={12} /> Delivered</span>;
      case 'shipped':
        return <span className="badge badge-primary"><Clock size={12} /> In Transit</span>;
      case 'processing':
        return <span className="badge badge-accent"><Clock size={12} /> Processing</span>;
      case 'cancelled':
        return <span className="badge badge-warning"><Ban size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-secondary"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content orders-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Package className="text-primary" size={24} />
            <h2>Your Order History</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="orders-body">
          {loading ? (
            <div className="loading-state">Loading your pet orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-orders-state">
              <Package size={48} className="text-muted" />
              <h3>No Orders Found</h3>
              <p>You haven't placed any pet supply orders yet.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card card">
                  <div className="order-card-header">
                    <div>
                      <div className="order-number font-bold">
                        Order #{order.order_number}
                      </div>
                      <div className="order-date text-muted">
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="order-items-snippet">
                    {order.items?.map((item) => (
                      <div key={item.id} className="order-item-mini-row">
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80'}
                          alt={item.product_name}
                          className="item-mini-thumb"
                        />
                        <div className="item-mini-info">
                          <span className="item-mini-title">{item.product_name}</span>
                          <span className="item-mini-qty text-muted">
                            {item.quantity}x @ ₹{parseFloat(item.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="item-mini-total font-semibold">
                          ₹{parseFloat(item.line_total).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="shipping-to-summary text-muted">
                      Ship to: {order.shipping_full_name}, {order.shipping_city}
                    </div>

                    <div className="order-footer-actions">
                      <div className="order-grand-total">
                        Total: <strong>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</strong>
                      </div>

                      {order.status === 'pending' && (
                        <button
                          className="btn btn-outline btn-sm text-danger"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                        >
                          {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;
