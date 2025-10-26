import React, { useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    const handleLoad = () => {
      const heroTitle = document.querySelector(".hero-content h1");
      const heroParagraph = document.querySelector(".hero-content p");
      const heroButton = document.querySelector(".btn-primary");

      if (heroTitle) heroTitle.classList.add("show");
      setTimeout(() => {
        if (heroParagraph) heroParagraph.classList.add("show");
      }, 700);
      setTimeout(() => {
        if (heroButton) heroButton.classList.add("show");
      }, 1400);
    };

     if (document.readyState === "complete") {
    // page already loaded → run immediately
    handleLoad();
  } else {
    // otherwise wait for load event
    window.addEventListener("load", handleLoad);
  }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="homepage-container">
      <header className="hero">
        <div className="top-bar">
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
        <div className="hero-content">
          <h1>Streamline Your Trucking Operations</h1>
          <p>
            Manage drivers, assign trucks, generate invoices, and track
            incidents — all from one powerful dashboard.
          </p>
          <a href="#get-started" className="btn-primary">
            Start Free Trial
          </a>
        </div>
      </header>

      <section className="features">
        <h2 className="features-title">Complete Truck Management Suite</h2>
        <p className="features-subtitle">
          Everything you need to manage drivers, trucks, assignments, invoices,
          and incidents — all in one place.
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍✈️</div>
            <h3>Driver Management</h3>
            <p>
              Maintain driver profiles, licenses, and availability with a
              simple, organized dashboard.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Truck Assignment</h3>
            <p>
              Quickly assign trucks to drivers and track assignment history for
              full accountability.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧾</div>
            <h3>Invoice Generation</h3>
            <p>
              Generate trip invoices in seconds with detailed cost breakdowns
              and export options.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚠️</div>
            <h3>Incident Reporting</h3>
            <p>
              Log accidents, breakdowns, and maintenance issues to take swift
              action and reduce downtime.
            </p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <img
          src="https://dummyimage.com/600x400/ddd/333&text=Fleet+Dashboard"
          alt="Fleet Dashboard"
        />
        <div className="benefits-content">
          <h2>Why Choose FleetX?</h2>
          <ul>
            <li>Centralized dashboard for complete visibility</li>
            <li>Reduce downtime with quick incident resolution</li>
            <li>Boost driver productivity & safety</li>
            <li>Get real-time reports and analytics</li>
          </ul>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Take Control of Your Fleet?</h2>
        <p>Sign up today and experience smarter trucking operations.</p>
        <a href="#signup">Get Started</a>
      </section>
    </div>
  );
};

export default HomePage;
