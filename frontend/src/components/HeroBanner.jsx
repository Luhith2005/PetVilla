import React from 'react';
import { Sparkles, ShieldCheck, Truck, HeartHandshake, ArrowRight } from 'lucide-react';

const HeroBanner = ({ onShopNowClick, onSelectPet }) => {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Left Column: Headline and CTAs */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} className="sparkle-icon" />
            <span>The #1 Trusted Pet Marketplace</span>
          </div>
          <h1 className="hero-title">
            Where Every Tail Wags & Every Whiskers Smile.
          </h1>
          <p className="hero-subtitle">
            Premium veterinary-approved nutrition, ergonomic orthopedic beds,
            playful toys, and wellness supplies delivered right to your doorstep.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={onShopNowClick}>
              Explore Pet Catalog <ArrowRight size={18} />
            </button>
            <div className="hero-social-proof">
              <div className="avatar-stack">
                <span className="proof-emoji">🐶</span>
                <span className="proof-emoji">🐱</span>
                <span className="proof-emoji">🦜</span>
              </div>
              <div className="proof-text">
                <strong>4.9 / 5.0 Rating</strong>
                <span>Over 12,000+ pampered pets</span>
              </div>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="hero-features">
            <div className="feature-item">
              <Truck size={20} className="feat-icon" />
              <span>Same-Day Express Dispatch</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} className="feat-icon" />
              <span>100% Non-Toxic & Vet Certified</span>
            </div>
            <div className="feature-item">
              <HeartHandshake size={20} className="feat-icon" />
              <span>Direct-from-Seller Assurance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Visual Showcase */}
        <div className="hero-visual">
          <div className="hero-card-floating main-hero-img-box">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
              alt="Happy golden retriever dog with toy"
              className="hero-main-img"
            />
            <div className="floating-badge badge-top-right">
              <span className="badge-icon">🌟</span>
              <div>
                <strong>Bestseller</strong>
                <span>Natural Salmon Dog Feast</span>
              </div>
            </div>
            <div className="floating-badge badge-bottom-left">
              <span className="badge-icon">🌿</span>
              <div>
                <strong>Organic & Pure</strong>
                <span>Grain-Free Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
