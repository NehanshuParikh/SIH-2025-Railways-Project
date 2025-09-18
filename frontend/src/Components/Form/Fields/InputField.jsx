import React from "react";

const InputField = ({ label, type, value, onChange, placeholder }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
    />
  </div>
);

export default InputField;
