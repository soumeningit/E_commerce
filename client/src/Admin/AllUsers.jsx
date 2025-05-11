import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ShowUserDetailsModal from "./Components/ShowUserDetailsModal";
import toast from "react-hot-toast";
import {
  allUsersAdminAPI,
  blockUserAdminAPI,
  getAllBlockedUsersAPI,
  unBlockUserAdminAPI,
} from "../Service/Operations/AdminAPI";

function AllUsers() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(true);

  // Fetch users based on view toggle
  useEffect(() => {
    async function fetchUsers() {
      setUsers([]);
      setError(null);
      try {
        if (showAllUsers) {
          const res = await allUsersAdminAPI(token, "GET");
          if (res.status === 200) {
            setUsers(res.data.data);
          } else {
            setError("Failed to fetch users");
          }
        } else {
          const res = await getAllBlockedUsersAPI(token, "GET");
          if (res.status === 200) {
            setUsers(res.data.data);
          } else {
            setError("Failed to fetch blocked users");
          }
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err?.response?.data?.message || "Failed to fetch users");
      }
    }

    fetchUsers();
  }, [showAllUsers, token]);

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleBlock = async (userId) => {
    const toastId = toast.loading("Blocking user...");
    try {
      const response = await blockUserAdminAPI(token, "DELETE", userId);
      if (response.status === 200) {
        toast.success("User blocked successfully", { id: toastId });
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userId)
        );
      } else {
        toast.error("Failed to block user", { id: toastId });
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      setError(error?.response?.data?.message || "Failed to block user");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUnblock = async (userId) => {
    const toastId = toast.loading("Unblocking user...");
    try {
      const response = await unBlockUserAdminAPI(token, "PUT", userId);
      if (response.status === 200) {
        toast.success("User unblocked successfully", { id: toastId });
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userId)
        );
      } else {
        toast.error("Failed to unblock user", { id: toastId });
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      setError(error?.response?.data?.message || "Failed to unblock user");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Users</h1>

      <div className="flex flex-row justify-start items-center mb-4 space-x-2">
        <button
          onClick={() => setShowAllUsers(true)}
          className={`px-2 py-1 border border-gray-200 rounded-md ${
            showAllUsers
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } transition-all duration-300 cursor-pointer`}
        >
          All Users
        </button>
        <button
          onClick={() => setShowAllUsers(false)}
          className={`px-2 py-1 border border-gray-200 rounded-md ${
            !showAllUsers
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } transition-all duration-300 cursor-pointer`}
        >
          Blocked Users
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {users.length === 0 && !error ? (
        <div className="text-gray-600">
          {showAllUsers ? "No users found" : "No blocked users"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  First Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Last Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.user_id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.firstName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm flex space-x-2">
                    <button
                      onClick={() => handleShowDetails(user)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 cursor-pointer"
                    >
                      Show Details
                    </button>
                    {showAllUsers ? (
                      <button
                        onClick={() => handleBlock(user.user_id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 cursor-pointer"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblock(user.user_id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for User Details */}
      {showModal && (
        <ShowUserDetailsModal
          selectedUser={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowModal(false);
          }}
          onBlock={handleBlock}
        />
      )}
    </div>
  );
}

export default AllUsers;
