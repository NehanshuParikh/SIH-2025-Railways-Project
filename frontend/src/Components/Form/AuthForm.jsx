import React, { useState } from "react";
import InputField from "./Fields/InputField";
import RoleSelector from "./Fields/RoleSelector";

const AuthForm = ({ type, onSubmit }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, role, userId, password });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-center mb-6">{type === "login" ? "Login" : "Register"}</h2>
      {type !== "login" && <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />}
      <RoleSelector value={role} onChange={(e) => setRole(e.target.value)} />
      {type !== "register" && <InputField label="User ID" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter your unique User Id" />}
      <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700 transition">
        {type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
