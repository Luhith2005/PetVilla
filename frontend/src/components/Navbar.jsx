import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Store,
  LogOut,
  Package,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  activePetType,
  setActivePetType,
  petTypes,
  onOpenAuth,
  onOpenOrders,
  onOpenProfile,
  isSellerMode,
  setIsSellerMode,
}) => {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky-navbar">
      <div className="container nav-content">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => {
            setIsSellerMode(false);
            setActivePetType('all');
            setSearchQuery('');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon-wrap">
            <svg
              className="logo-paw"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="26"
              height="26"
            >
              <circle cx="12" cy="14" r="4" />
              <circle cx="6.5" cy="8" r="2.5" />
              <circle cx="17.5" cy="8" r="2.5" />
              <circle cx="3.5" cy="14" r="2" />
              <circle cx="20.5" cy="14" r="2" />
            </svg>
          </div>
          <div className="logo-text-wrap">
            <span className="logo-title">PetVilla</span>
            <span className="logo-subtitle">Care & Marketplace</span>
          </div>
        </div>

        {/* Search Bar */}
        {!isSellerMode && (
          <div className="nav-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search pet food, cozy beds, toys, vitamins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Actions & User Menu */}
        <div className="nav-actions">
          {/* Seller Mode Toggle */}
          {isSeller && (
            <button
              className={`btn btn-sm ${isSellerMode ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setIsSellerMode(!isSellerMode)}
            >
              <Store size={16} />
              {isSellerMode ? 'Customer Store' : 'Seller Portal'}
            </button>
          )}

          {/* Cart Trigger */}
          {!isSellerMode && (
            <button
              className="btn btn-secondary btn-cart"
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Basket"
            >
              <ShoppingBag size={20} />
              <span className="cart-total-badge">
                {cart.total_items || 0}
              </span>
            </button>
          )}

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button
                className="btn btn-secondary user-menu-trigger"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-avatar-circle">
                  {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                </div>
                <span className="user-name-label">
                  {user.first_name || user.username}
                </span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  className="user-dropdown-menu"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="dropdown-header">
                    <strong>{user.username}</strong>
                    <span className="badge badge-primary">{user.user_type}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenProfile();
                    }}
                  >
                    <UserIcon size={16} /> My Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenOrders();
                    }}
                  >
                    <Package size={16} /> Order History
                  </button>
                  {isSeller && (
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsSellerMode(true);
                      }}
                    >
                      <Layers size={16} /> Seller Dashboard
                    </button>
                  )}
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
              <UserIcon size={16} /> Sign In / Register
            </button>
          )}
        </div>
      </div>

      {/* Pet Quick Filter Sub-bar */}
      {!isSellerMode && petTypes && petTypes.length > 0 && (
        <div className="pet-subnav">
          <div className="container pet-subnav-scroll">
            <button
              className={`pet-pill-btn ${activePetType === 'all' ? 'active' : ''}`}
              onClick={() => setActivePetType('all')}
            >
              🐾 All Pets
            </button>
            {petTypes.map((pt) => {
              const iconMap = {
                dogs: '🐶',
                cats: '🐱',
                birds: '🦜',
                fish: '🐠',
                rabbits: '🐰',
                hamsters: '🐹',
                reptiles: '🦎',
                horses: '🐴',
                'small-pets': '🐾',
              };
              return (
                <button
                  key={pt.id}
                  className={`pet-pill-btn ${activePetType === pt.slug ? 'active' : ''}`}
                  onClick={() => setActivePetType(pt.slug)}
                >
                  <span>{iconMap[pt.slug] || '🐾'}</span>
                  <span>{pt.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
