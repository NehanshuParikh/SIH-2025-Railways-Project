import React from "react";

const RoleSelector = ({ value, onChange }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-medium mb-1">Select Role</label>
    <select
      value={value}
      onChange={onChange}
      className="p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
    >
      <option value="">-- Choose Role --</option>
      <option value="Admin">Admin</option>
      <option value="Operator">Operator</option>
      <option value="SectionController">Section Controller</option>
    </select>
  </div>
);

export default RoleSelector;
