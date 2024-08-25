import React from "react";
import { logout } from "../utils/axios";
import axios from "../utils/axios";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await logout();
      // Clear the tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userid");
      // Remove the authorization header from axios
      delete axios.defaults.headers.common["Authorization"];
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-bold text-black bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
};

export default Logout;
