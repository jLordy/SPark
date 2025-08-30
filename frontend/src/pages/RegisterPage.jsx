import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const createUser = useUserStore((state) => state.createUser);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const navigate = useNavigate();
  const { login } = useAuth(); // use AuthContext
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    position: "",
    preferences: "",
    vehicle_type: "",
    plate_no: "",
    id_picture: null,
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagePreview(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      e.target.value = "";
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    handleChange(e);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call Zustand to create user (handles FormData)
      const user = await createUser(formData);

      // After success, log in the user via AuthContext
      const token = user.token  
      login(user, token);

      // Redirect to dashboard or home
      navigate("/");
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brandGray to-brandBlack font-bakbak tracking-wide flex flex-col">
      {/* Header */}
      <Link to="/">
        <h1 className="font-tesla text-5xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-100 mt-10 sm:mt-12 md:mt-16 lg:mt-20 text-center cursor-pointer hover:opacity-80 transition">
          SPARK
        </h1>
      </Link>

      {/* Form Section */}
      <div className="flex flex-1 justify-center items-center px-4 sm:px-6 md:px-10 lg:px-16 pb-6">
        <div className="card w-full max-w-2xl bg-gray-400 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200 shadow-2xl">
          <div className="card-body p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-gray-100 tracking-wide">
              Register
            </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-100">First Name</span>
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="Enter first name"
                    className="input input-bordered w-full"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Middle Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-100">Middle Name</span>
                  </label>
                  <input
                    name="middle_name"
                    type="text"
                    placeholder="Enter middle name"
                    className="input input-bordered w-full"
                    onChange={handleChange}
                  />
                </div>

                {/* Last Name */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-100">Last Name</span>
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    placeholder="Enter last name"
                    className="input input-bordered w-full"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Position */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-100">Position</span>
                  </label>
                  <select
                    name="position"
                    className="select select-bordered w-full"
                    required
                    onChange={handleChange}
                  >
                    <option disabled selected>Select your position</option>
                    <option>Student</option>
                    <option>Faculty</option>
                    <option>Staff</option>
                    <option>Visitor</option>
                  </select>
                </div>

                {/* Preferences */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-100">Preferences</span>
                  </label>
                  <select
                    name="preferences"
                    className="select select-bordered w-full"
                    onChange={handleChange}
                  >
                    <option disabled selected>Select your parking preference</option>
                    <option>Near Entrance</option>
                    <option>Covered Parking</option>
                    <option>Accessible Parking</option>
                    <option>Motorcycle Zone</option>
                  </select>
                </div>

                {/* Vehicle Type */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-200">Vehicle Type</span>
                  </label>
                  <select
                    name="vehicle_type"
                    className="select select-bordered w-full"
                    onChange={handleChange}
                  >
                    <option disabled selected>Choose vehicle type</option>
                    <option>Car</option>
                    <option>Motorcycle</option>
                    <option>Van</option>
                    <option>Truck</option>
                  </select>
                </div>

                {/* Plate Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-100">Plate No.</span>
                  </label>
                  <input
                    name="plate_no"
                    type="text"
                    placeholder="Enter plate number"
                    className="input input-bordered w-full"
                    onChange={handleChange}
                  />
                </div>

                {/* ID Picture */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="text-gray-100">ID Picture</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    name="id_picture"
                    type="file"
                    className="file-input file-input-bordered w-full text-gray-100"
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
                  />
                  <label className="label">
                    <span className="text-gray-400 text-sm">
                      Accepted: JPEG, PNG, GIF, WEBP (Max 5MB)
                    </span>
                  </label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Username */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-100">Username</span>
                  </label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    className="input input-bordered w-full"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-100">Password</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="input input-bordered w-full"
                    required
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <div className="form-control md:col-span-2 mt-2 sm:mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-3 sm:py-4 btn-lg w-full bg-green-600 hover:bg-green-700 text-gray-200 text-base sm:text-lg normal-case tracking-wider"
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </form>

             

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-100">
              Already have an account? <Link to="/" className="link link-primary">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
