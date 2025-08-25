import { Link } from "react-router-dom";

export default function LoginPage() {
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
            <form>
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-200">Username</span>
                </label>
                <input
                  placeholder="Enter your username"
                  className="input input-bordered input-md w-full"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-gray-200">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered input-md w-full"
                  required
                />
              </div>

              {/* Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-md w-full bg-green-600 hover:bg-green-700 text-gray-100 text-base tracking-wide normal-case"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-gray-300">
              Don’t have an account?{" "}
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
