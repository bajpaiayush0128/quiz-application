import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api/";

let refresh = false;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !refresh) {
      refresh = true;

      try {
        const response = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          { refresh: localStorage.getItem("refresh_token") },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data["access"]}`;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);

          return axios(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle token refresh failure, e.g., redirect to login page
      } finally {
        refresh = false;
      }
    }
    return Promise.reject(error);
  }
);

// Function to handle user logout
export const logout = async () => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    await axios.post(
      "http://localhost:8000/api/logout/",
      { refresh_token },
      {
        headers: { "Content-Type": "application/json" },
        data: { refresh_token: refresh_token },
      }
    );

    // Clear the tokens from localStorage
    console.log("Removing tokens from local storage...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Remove the authorization header from axios
    delete axios.defaults.headers.common["Authorization"];

    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default axios;
