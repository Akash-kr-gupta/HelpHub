import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <h1 className="hero-title">
          HelpHub
          <span className="hero-subtitle">
            Emergency Help & Animal Rescue
          </span>
        </h1>

        <p className="hero-description">
          Connect with volunteers, NGOs, and donors instantly.
        </p>

        <div className="hero-actions">
          <Link to="/request-help" className="btn primary">
            Request Help
          </Link>

          <Link to="/donate" className="btn secondary">
            Donate
          </Link>
        </div>

      </div>
    </section>
  );
}