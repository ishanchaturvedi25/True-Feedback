import React from "react";

const ContextCard = ({ title, slug, description }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="mt-2">
        <span className="text-sm text-blue-600 break-all">/submit-feedback/{slug}</span>
      </div>
    </div>
  );
};

export default ContextCard;