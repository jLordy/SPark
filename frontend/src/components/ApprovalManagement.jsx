import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";

const ApprovalManagement = () => {
  const { users, fetchUsers, updateUserRole, updateUserApproval, loading, error } = useUserStore();
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [zoomImage, setZoomImage] = useState(null); // for zoom modal

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    setUpdatingUserId(userId);
    await updateUserRole(userId, role);
    setUpdatingUserId(null);
  };

  const handleApprovalToggle = async (userId, isApproved) => {
    setUpdatingUserId(userId);
    await updateUserApproval(userId, isApproved);
    setUpdatingUserId(null);
  };

  if (loading && !updatingUserId)
    return <p className="text-gray-500 text-center mt-10">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Dashboard</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">#</th>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">Username</th>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">ID Picture</th>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">Role</th>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">Approved</th>
              <th className="px-4 py-3 text-left text-gray-600 uppercase text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.user_id}
                className="border-b hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{`${user.first_name} ${user.last_name}`}</td>
                <td className="px-4 py-3 text-gray-600">{user.username}</td>
                <td className="px-4 py-3">
                  {user.id_picture ? (
                    <img
                      src={`http://localhost:3000/uploads/${user.id_picture}`}
                      alt={`ID of ${user.username}`}
                      className="w-16 h-16 object-cover rounded-md shadow cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setZoomImage(`http://localhost:3000/uploads/${user.id_picture}`)}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="border rounded-md px-2 py-1 text-white-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                    disabled={updatingUserId === user.user_id}
                  >
                    <option value="user">User</option>
                    <option value="dev">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={user.is_approved}
                    onChange={(e) => handleApprovalToggle(user.user_id, e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    disabled={updatingUserId === user.user_id}
                  />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {updatingUserId === user.user_id ? (
                    <span className="text-sm italic">Updating...</span>
                  ) : (
                    <span className="text-sm">{user.is_approved ? "Approved" : "Pending"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed ID"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ApprovalManagement;