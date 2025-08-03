import React from "react";

const PropertyFeature: React.FC<{ icon: React.ReactNode; value: string }> = ({
  icon,
  value,
}) => {
  return (
    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
      {icon}
      <p>{value}</p>
    </div>
  );
};

export default PropertyFeature;
