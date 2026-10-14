import React, { useState } from 'react';
import { Heart, Send, ShieldCheck, Truck, Headphones, Check } from 'lucide-react';

const Footer = ({ onSelectCategory, categories }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="footer-section">
      {/* Trust Badges */}
      <div className="container">
        <div className="footer-perks-grid">
          <div className="footer-perk-card">
            <Truck size={28} className="text-primary" />
            <div>
              <h4>Free Express Shipping</h4>
              <p>On all pet orders over ₹799 across India</p>
            </div>
          </div>
          <div className="footer-perk-card">
            <ShieldCheck size={28} className="text-primary" />
            <div>
              <h4>Vet-Approved Quality</h4>
              <p>Every product is certified 100% pet-safe</p>
            </div>
          </div>
          <div className="footer-perk-card">
            <Headphones size={28} className="text-primary" />
            <div>
              <h4>24/7 Pet Care Support</h4>
              <p>Live assistance for pet health and ordering</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="brand-logo footer-logo">
              <span className="footer-paw-emoji">🐾</span>
              <span className="logo-title text-white">PetVilla</span>
            </div>
            <p className="footer-bio">
              PetVilla is your trusted premier pet care and marketplace destination.
              Connecting verified pet artisans and quality brands directly with loving pet parents.
            </p>
            <div className="footer-tech-stack">
              <span className="tech-tag">React.js</span>
              <span className="tech-tag">Python Django</span>
              <span className="tech-tag">Django REST Framework</span>
              <span className="tech-tag">Postman Tested</span>
              <span className="tech-tag">JWT Auth</span>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop by Category</h4>
            <ul className="footer-links">
              {categories && categories.length > 0 ? (
                categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      className="footer-link-btn"
                      onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li><span>Food & Nutrition</span></li>
                  <li><span>Toys & Play</span></li>
                  <li><span>Beds & Furniture</span></li>
                  <li><span>Grooming & Care</span></li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Pet Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Pet Types</h4>
            <ul className="footer-links">
              <li><span>🐶 Dogs & Puppies</span></li>
              <li><span>🐱 Cats & Kittens</span></li>
              <li><span>🦜 Birds & Parrots</span></li>
              <li><span>🐠 Aquatic & Fish</span></li>
              <li><span>🐰 Rabbits & Bunnies</span></li>
              <li><span>🐹 Hamsters & Guinea Pigs</span></li>
              <li><span>🦎 Reptiles & Turtles</span></li>
              <li><span>🐴 Horses & Equine</span></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-col-title">Pet Perks & Treats</h4>
            <p className="newsletter-desc">
              Subscribe to get ₹150 off your first pet care order plus weekly expert pet advice.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="btn btn-primary newsletter-btn">
                  {subscribed ? <Check size={18} /> : <Send size={18} />}
                </button>
              </div>
              {subscribed && (
                <span className="text-success text-xs mt-1 block">
                  🎉 Thank you! Check your inbox for your treat code.
                </span>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>
            © {new Date().getFullYear()} PetVilla Inc. Built with love for pets & developers.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#sellers">Seller Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
