import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import LayoutWithSidebar from "../components/LayoutWithSidebar";
import { useAuth } from "../context/AuthContext"; // Import useAuth

function HomePage() {
  const { users, loading, error, fetchUsers } = useUserStore();
  const { user } = useAuth(); // Get the logged-in user from AuthContext

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log("users", users);
  console.log("loggedIn user", user); // This will show the currently logged-in user

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <LayoutWithSidebar>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome to SPARK</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Your Parking Solution
            </h2>
            <p className="text-gray-600">
              Find and reserve parking spots easily with our platform.
              {user
                ? ` Welcome back, ${user.first_name || user.username}!`
                : " Please login to access more features."}
            </p>

            {/* Debug info - you can remove this later */}
            {user && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">
                  Debug: User loaded - {user.first_name} {user.last_name} (
                  {user.role})
                </p>
              </div>
            )}
          </div>
        </div>
      </LayoutWithSidebar>
    </main>
  );
}

export default HomePage;
