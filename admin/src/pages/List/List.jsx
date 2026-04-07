import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./List.css";

const List = () => {
  const { apiUrl, token, owner } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/food/owner/list`, {
        headers: { token },
      });
      if (res.data.success) setList(res.data.data);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
      toast.error("Failed to fetch food items.");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (id) => {
    if (!window.confirm("Remove this food item?")) return;

    try {
      const res = await axios.post(
        `${apiUrl}/api/food/remove`,
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Food item removed.");
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to remove food item:", error);
      toast.error("Failed to remove food item.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filtered = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="list-page animate-up">
      <div className="list-page__header">
        <div>
          <h2 className="admin-page-title">
            Food <span>List</span>
          </h2>
          <p className="admin-page-subtitle">Showing menu items for {owner?.restaurantName}.</p>
        </div>
        <input
          type="text"
          placeholder="Search food items..."
          className="input-field list-page__search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="food-list-search"
        />
      </div>

      <div className="list-page__count">
        <span>{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="list-page__loading">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 80, background: "#f0f0f0", borderRadius: 12, marginBottom: 10 }} />
          ))}
        </div>
      ) : (
        <div className="list-page__table card">
          <div className="list-page__row list-page__row--header">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Rating</span>
            <span>Action</span>
          </div>

          {filtered.length === 0 ? (
            <div className="list-page__empty">
              <span>Menu</span>
              <p>No food items found</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item._id}
                className="list-page__row list-page__row--data"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <div className="list-page__image-wrap">
                  <img
                    src={`${apiUrl}/images/${item.image}`}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50x50?text=Food";
                    }}
                  />
                </div>
                <span className="list-page__name">{item.name}</span>
                <span className="list-page__category">
                  <span className="list-page__category-badge">{item.category}</span>
                </span>
                <span className="list-page__price">Rs {item.price}</span>
                <span className="list-page__rating">Rating {item.rating}</span>
                <button
                  className="list-page__remove"
                  onClick={() => removeFood(item._id)}
                  id={`remove-food-${item._id}`}
                  title="Remove item"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default List;
