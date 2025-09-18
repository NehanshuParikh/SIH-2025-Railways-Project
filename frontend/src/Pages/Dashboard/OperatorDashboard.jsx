import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Services/AuthService";


const OperatorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">⚒️ Operator Dashboard</h1>

      {/* Dummy Components */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow rounded">📝 Daily Tasks</div>
        <div className="p-4 bg-white shadow rounded">📥 Data Entry</div>
        <div className="p-4 bg-white shadow rounded">📤 Submit Reports</div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default OperatorDashboard;
