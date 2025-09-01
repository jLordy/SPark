import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Save user and token in context
        login(response.data.data.user, response.data.data.token);

        // Redirect to home page
        navigate("/");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
      //console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-b from-brandGray to-brandBlack">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center px-6 md:px-12 text-center">
        <h1 className="font-tesla text-6xl md:text-7xl font-bold mb-2 text-white drop-shadow-lg">
          SPARK
        </h1>
        <p className="font-bakbak text-xl md:text-2xl max-w-md text-gray-200">
          Your shortcut to a parking slot.
        </p>
      </div>

      {/* Right Section - Login Form */}
      <div className="font-bakbak flex justify-center items-start md:items-center px-6 md:px-12 mt-6 md:mt-0">
        <div className="card w-full max-w-md bg-gray-400 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 shadow-2xl">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4 text-left text-white">
              Log In
            </h2>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-200">Username</span>
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="input input-bordered input-md w-full"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-gray-200">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input input-bordered input-md w-full"
                  required
                  disabled={loading}
                />
              </div>

              {/* Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-md w-full bg-green-600 hover:bg-green-700 text-gray-100 text-base tracking-wide normal-case"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-gray-300">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
