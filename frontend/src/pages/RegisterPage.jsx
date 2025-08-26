import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useRef, useState } from "react";

export default function RegisterPage() {
  // Zustand store hooks
  const createUser = useUserStore((state) => state.createUser);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  
  // Navigation
  const navigate = useNavigate();
  
  // Refs and state
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  // Constants
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Handler functions
  const handleInputChange = (e) => {
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

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      e.target.value = '';
      setImagePreview(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB');
      e.target.value = '';
      setImagePreview(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Update form data
    handleInputChange(e);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData(prev => ({ ...prev, id_picture: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      navigate("/");
    } catch (err) {
      console.error("Register failed", err);
    }
  };

  // Form field components for better organization
  const TextInput = ({ name, label, placeholder, required = false, spanFull = false }) => (
    <div className={`form-control ${spanFull ? 'md:col-span-2' : ''}`}>
      <label className="label">
        <span className="label-text text-gray-100">{label}</span>
      </label>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full"
        required={required}
        onChange={handleInputChange}
      />
    </div>
  );

  const SelectInput = ({ name, label, options, required = false, spanFull = false }) => (
    <div className={`form-control ${spanFull ? 'md:col-span-2' : ''}`}>
      <label className="label">
        <span className="label-text text-gray-100">{label}</span>
      </label>
      <select 
        name={name} 
        className="select select-bordered w-full" 
        required={required} 
        onChange={handleInputChange}
        defaultValue=""
      >
        <option value="" disabled>Select your {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const ImageUpload = () => (
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
        accept={ALLOWED_IMAGE_TYPES.join(',')}
      />
      
      <label className="label">
        <span className="text-gray-400 text-sm">
          Accepted: JPEG, PNG, GIF, WEBP (Max 5MB)
        </span>
      </label>

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
  );

  const PasswordInput = () => (
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
        onChange={handleInputChange}
      />
    </div>
  );

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

            {/* Form */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" onSubmit={handleSubmit}>
              <TextInput name="first_name" label="First Name" placeholder="Enter first name" required />
              <TextInput name="middle_name" label="Middle Name" placeholder="Enter middle name" />
              <TextInput name="last_name" label="Last Name" placeholder="Enter last name" required spanFull />
              
              <SelectInput 
                name="position" 
                label="Position" 
                options={["Student", "Faculty", "Staff", "Visitor"]} 
                required 
                spanFull 
              />
              
              <SelectInput 
                name="preferences" 
                label="Preferences" 
                options={["Near Entrance", "Covered Parking", "Accessible Parking", "Motorcycle Zone"]} 
                spanFull 
              />
              
              <SelectInput 
                name="vehicle_type" 
                label="Vehicle Type" 
                options={["Car", "Motorcycle", "Van", "Truck"]} 
              />
              
              <TextInput name="plate_no" label="Plate No." placeholder="Enter plate number" />
              
              <ImageUpload />
              
              <TextInput name="username" label="Username" placeholder="Choose a username" required spanFull />
              
              <PasswordInput />

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