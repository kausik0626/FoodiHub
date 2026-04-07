import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import "./Home.css";

const Home = ({ setShowLogin }) => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home">
      <Header setShowLogin={setShowLogin} />

      {/* Features Strip */}
      <section className="home__features">
        <div className="container">
          <div className="home__features-grid">
            {[
              { icon: "⚡", title: "Fast Delivery", desc: "30 mins or less" },
              { icon: "🌟", title: "Fresh Quality", desc: "Restaurant-fresh meals" },
              { icon: "💰", title: "Best Prices", desc: "No hidden charges" },
              { icon: "🔒", title: "Secure Payment", desc: "100% safe & encrypted" },
            ].map((f) => (
              <div key={f.title} className="home__feature">
                <div className="home__feature-icon">{f.icon}</div>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />

      {/* About Section */}
      <section className="home__about" id="about">
        <div className="container home__about-content">
          <div className="home__about-text animate-fadeUp">
            <span className="badge badge-orange">About Us</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>
              Why Choose <span>FoodieHUB?</span>
            </h2>
            <p className="section-subtitle">
              We connect you with the best local restaurants and ensure your
              food arrives fresh, hot, and on time. Our platform supports 500+
              restaurants and serves 50,000+ happy customers every day.
            </p>
            <div className="home__about-points">
              {[
                "✅ Live order tracking via SMS & app",
                "✅ Contactless delivery available",
                "✅ All allergies & diet preferences supported",
                "✅ 24/7 customer support",
              ].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="home__about-visual">
            <div className="home__about-card">
              <div className="home__about-emoji">🚴</div>
              <h3>Super Fast</h3>
              <p>Our delivery partners bring food to your door in record time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
