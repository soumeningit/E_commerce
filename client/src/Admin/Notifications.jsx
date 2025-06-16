import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LuCheck, LuX, LuEye } from "react-icons/lu";

import toast from "react-hot-toast";
import {
  blockUserAdminAPI,
  getPendingUsersAPI,
  verifyUserAPI,
} from "../Service/Operations/AdminAPI";
import UserDetailsModal from "./Components/UserDetailsModal";

function AdminNotifications() {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);

  // Fetch pending users
  useEffect(() => {
    const getPendingNotifications = async () => {
      const toastId = toast.loading("Loading pending notifications...");
      try {
        const response = await getPendingUsersAPI(token, "GET");
        toast.dismiss(toastId);
        if (response.status === 200) {
          setUserData(response.data.data);
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to fetch pending notifications.");
        console.error("Error fetching pending notifications:", error);
      } finally {
        toast.dismiss(toastId);
      }
    };
    getPendingNotifications();
  }, [token]);

  // Handle checkbox selection
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Placeholder API for approving a single user
  const handleApprove = async (userId) => {
    const toastId = toast.loading("Approving user ....");
    try {
      const data = new Array();
      data.push(userId);
      setSelectedUser(data);

      const response = await verifyUserAPI(token, "POST", {
        userId: data,
      });
      toast.dismiss(toastId);
      if (response.status === 200) {
        toast.success("User approved successfully");
        setUserData((prev) =>
          prev.filter((user) => !selectedUsers.includes(user.user_id))
        );
        setSelectedUsers([]);
      } else {
        console.error("Error approving users:", response.data.message);
      }
    } catch (error) {
      console.error("Error approving user:", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // Placeholder API for blocking a single user
  const handleBlock = async (userId) => {
    const toastId = toast.loading("Blocking user ....");
    try {
      const response = await blockUserAdminAPI(token, { userId: userId });
      toast.dismiss(toastId);
      if (response.status === 200) {
        toast.success("User get blocked");
        setUserData((prev) =>
          prev.filter((user) => !selectedUsers.includes(user.user_id))
        );
        setSelectedUsers([]);
      } else {
        console.error("Error blocking users:", response.data.message);
      }

      // setUserData((prev) => prev.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Error blocking user:", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // Placeholder API for approving multiple users
  const handleBulkApprove = async () => {
    const tostId = toast.loading("Approving users...");
    try {
      const response = await verifyUserAPI(token, { userId: selectedUsers });
      toast.dismiss(tostId);
      if (response.status === 200) {
        toast.success("Users approved successfully");
        setUserData((prev) =>
          prev.filter((user) => !selectedUsers.includes(user.user_id))
        );
        setSelectedUsers([]);
      }
    } catch (error) {
      toast.dismiss(tostId);
      alert(error.response.data.message);
      console.error("Error approving multiple users:", error);
    } finally {
      toast.dismiss(tostId);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Admin Notifications
      </h1>
      {userData.length === 0 ? (
        <p className="text-gray-600">No pending users found.</p>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleBulkApprove}
              disabled={selectedUsers.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                selectedUsers.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Approve Selected ({selectedUsers.length})
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">
                    {/* Select All / Deselect All */}
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedUsers(
                          e.target.checked
                            ? userData.map((user) => user.user_id)
                            : []
                        )
                      }
                      checked={
                        selectedUsers.length === userData.length &&
                        userData.length > 0
                      }
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    City
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={() => handleSelectUser(user.user_id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.contact_no || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.city || "N/A"}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleApprove(user.user_id)}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200 cursor-pointer"
                        title="Approve"
                      >
                        <LuCheck size={16} />
                      </button>
                      <button
                        onClick={() => handleBlock(user.user_id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 cursor-pointer"
                        title="Block"
                      >
                        <LuX size={16} />
                      </button>
                      <button
                        onClick={() => setShowDetails(user)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 cursor-pointer"
                        title="View Details"
                      >
                        <LuEye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showDetails && (
        <UserDetailsModal
          user={showDetails}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
}

export default AdminNotifications;
