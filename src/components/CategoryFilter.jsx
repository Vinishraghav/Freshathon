import { useState } from "react";

// Define event categories with their colors
const categories = [
  { id: "all", name: "All Categories", color: "secondary" },
  { id: "technology", name: "Technology", color: "primary" },
  { id: "business", name: "Business", color: "warning" },
  { id: "education", name: "Education", color: "info" },
  { id: "arts", name: "Arts", color: "danger" },
  { id: "music", name: "Music", color: "purple" },
  { id: "sports", name: "Sports", color: "success" },
  { id: "food", name: "Food", color: "pink" },
  { id: "health", name: "Health", color: "teal" },
  { id: "other", name: "Other", color: "secondary" }
];

const CategoryFilter = ({ onCategoryChange, selectedCategory = "all" }) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId === "all" ? "" : categoryId);
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">
        <i className="bi bi-tags me-2"></i>
        Categories
      </h5>
      <div className="d-flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn ${
              activeCategory === category.id
                ? `btn-${category.color}`
                : `btn-outline-${category.color}`
            } btn-sm`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
