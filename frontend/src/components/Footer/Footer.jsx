import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">FH</span>
              <span className="footer__logo-text">
                Foodie<span>HUB</span>
              </span>
            </div>
            <p>
              Delivering happiness to your doorstep with fresh, fast, and
              delicious meals from the best restaurants near you.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook" className="footer__social">f</a>
              <a href="#" aria-label="Instagram" className="footer__social">ig</a>
              <a href="#" aria-label="Twitter" className="footer__social">x</a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Get in Touch</h4>
            <ul>
              <li>support@foodiehub.in</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, Maharashtra</li>
            </ul>
            <div className="footer__app-btns">
              <a href="#" className="footer__app-btn">App Store</a>
              <a href="#" className="footer__app-btn">Google Play</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>Copyright 2024 FoodieHUB. All rights reserved.</p>
          <p>Made in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
