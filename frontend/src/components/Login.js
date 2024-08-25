import axios from "../utils/axios";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    const user = { username, password };

    try {
      const { data } = await axios.post("/token/", user, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(data);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      const response = await axios.get("/user");
      setUserDetails(response.data);
      localStorage.setItem("userRole", response.data[0].role.name);
      localStorage.setItem("userid", response.data[0].id);
      console.log(response.data[0].role.name);
      console.log(response.data[0].id);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div>
              <h2 className="font-semibold text-3xl text-center mb-6">
                Sign In
              </h2>
            </div>
            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:ring-1 focus:ring-indigo-300"
                      placeholder="Enter Username"
                      name="username"
                      type="text"
                      value={username}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      name="password"
                      type="password"
                      className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:ring-1 focus:ring-indigo-300"
                      placeholder="Enter password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
