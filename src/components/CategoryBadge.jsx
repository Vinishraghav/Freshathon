const CategoryBadge = ({ category }) => {
  // Map category names to Bootstrap color classes
  const getCategoryColor = (categoryName) => {
    if (!categoryName) return "secondary";
    
    const categoryMap = {
      "Technology": "primary",
      "Business": "warning",
      "Education": "info",
      "Arts": "danger",
      "Music": "purple",
      "Sports": "success",
      "Food": "pink",
      "Health": "teal",
      "Other": "secondary"
    };
    
    return categoryMap[categoryName] || "secondary";
  };
  
  // Get the appropriate color for this category
  const colorClass = getCategoryColor(category);
  
  return (
    <span className={`badge bg-${colorClass}`}>
      {category || "Uncategorized"}
    </span>
  );
};

export default CategoryBadge;
