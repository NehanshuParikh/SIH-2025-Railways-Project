import axios from "axios";

const API_BASE = "http://localhost:3000/api/auth"; // change if needed

export const registerUser = async (data) => {
  try {
    let res;

    if (data.role === "Admin") {
      res = await fetch(`${API_BASE}/v1/register/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(data),
      });
    } 
    
    else if (data.role === "SectionController") {
      res = await fetch(`${API_BASE}/v1/register/sectioncontroller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(data),
      });
    } 
    
    else if (data.role === "Operator") {
      res = await fetch(`${API_BASE}/v1/register/operator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(data),
      });
    }

    // Invalid role check
    if (!res) throw { message: "Invalid role", success: false };

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    const result = await res.json();
    return result;

  } catch (err) {
    console.error("❌ registerUser error:", err);
    throw err;
  }
};
export const loginUser = async (data) => {
  try {
    let res;

    if (data.role === "Admin") {
      res = await fetch(`${API_BASE}/v1/login/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
    } 
    
    else if (data.role === "SectionController") {
      res = await fetch(`${API_BASE}/v1/login/sectioncontroller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
    } 
    
    else if (data.role === "Operator") {
      res = await fetch(`${API_BASE}/v1/login/operator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
    }

    // If res is still undefined (invalid role)
    if (!res) throw { message: "Invalid role", success: false };

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    const result = await res.json();
    return result;

  } catch (err) {
    console.error("❌ loginUser error:", err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/auth/v1/logout`, {
      method: "GET",
      credentials: "include", // needed to clear cookie on backend
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    const result = await res.json();
    return result;
  } catch (err) {
    console.error("❌ logout error:", err);
    throw err;
  }
};
