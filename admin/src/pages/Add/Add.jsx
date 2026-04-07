import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./Add.css";

const categories = [
  "Pizza",
  "Burgers",
  "Biryani",
  "Sushi",
  "Pasta",
  "Desserts",
  "Drinks",
  "Salads",
  "Sandwiches",
  "Other",
];

const Add = () => {
  const { apiUrl, token, owner } = useAuth();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Pizza",
    rating: 4.0,
    preparationTime: 30,
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image.");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("rating", Number(data.rating));
    formData.append("preparationTime", Number(data.preparationTime));
    formData.append("image", image);

    try {
      const res = await axios.post(`${apiUrl}/api/food/add`, formData, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("Food item added successfully.");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Pizza",
          rating: 4.0,
          preparationTime: 30,
        });
        setImage(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to add food item:", error);
      toast.error("Failed to add food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add animate-up">
      <h2 className="admin-page-title">
        Add <span>Food Item</span>
      </h2>
      <p className="admin-page-subtitle">New items will be linked to {owner?.restaurantName}.</p>

      <form onSubmit={onSubmitHandler} className="add__form card">
        <div className="add__image-section">
          <label className="add__image-label" htmlFor="image-upload" id="image-upload-label">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="add__image-preview" />
            ) : (
              <div className="add__image-placeholder">
                <span>Upload</span>
                <p>Click to upload image</p>
                <p className="add__image-sub">PNG, JPG up to 5MB</p>
              </div>
            )}
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: "none" }}
          />
        </div>

        <div className="add__fields">
          <div className="add__field">
            <label>Food Name *</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Margherita Pizza"
              required
              className="input-field"
              value={data.name}
              onChange={onChangeHandler}
            />
          </div>

          <div className="add__field">
            <label>Description *</label>
            <textarea
              name="description"
              placeholder="Describe the dish, ingredients, flavors..."
              required
              className="input-field add__textarea"
              value={data.description}
              onChange={onChangeHandler}
              rows={3}
            />
          </div>

          <div className="add__row">
            <div className="add__field">
              <label>Category *</label>
              <select
                name="category"
                className="input-field"
                value={data.category}
                onChange={onChangeHandler}
                id="category-select"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="add__field">
              <label>Price (Rs) *</label>
              <input
                name="price"
                type="number"
                placeholder="e.g. 299"
                required
                min="1"
                className="input-field"
                value={data.price}
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div className="add__row">
            <div className="add__field">
              <label>Rating (1-5)</label>
              <input
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                className="input-field"
                value={data.rating}
                onChange={onChangeHandler}
              />
            </div>

            <div className="add__field">
              <label>Prep Time (minutes)</label>
              <input
                name="preparationTime"
                type="number"
                min="1"
                className="input-field"
                value={data.preparationTime}
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary add__submit" disabled={loading} id="add-food-submit">
            {loading ? "Adding..." : "Add Food Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
