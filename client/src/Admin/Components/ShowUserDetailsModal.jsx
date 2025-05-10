import user_avtar from "../../image/user_avtar.png";

function ShowUserDetailsModal({ selectedUser, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-xl p-6 w-full max-w-md mx-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Details
        </h2>
        <div className="flex justify-center mb-4">
          <img
            src={selectedUser?.image || user_avtar}
            alt="User Profile"
            className="w-16 h-16 rounded-full border-2 border-white border-opacity-50 hover:border-green-500 transition-all duration-300"
            onError={(e) => (e.target.src = user_avtar)}
          />
        </div>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>ID:</strong> {selectedUser.user_id}
          </p>
          <p>
            <strong>First Name:</strong> {selectedUser.firstName}
          </p>
          <p>
            <strong>Middle Name:</strong> {selectedUser.middleName || "N/A"}
          </p>
          <p>
            <strong>Last Name:</strong> {selectedUser.lastName}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Mobile No:</strong> {selectedUser.mobileNo || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser.role}
          </p>
          <p>
            <strong>Verified:</strong> {selectedUser.is_verified ? "Yes" : "No"}
          </p>
          <p>
            <strong>Authorised:</strong>{" "}
            {selectedUser.is_authorised ? "Yes" : "No"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(selectedUser.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser.address || "N/A"}
          </p>
          <p>
            <strong>City:</strong> {selectedUser.city || "N/A"}
          </p>
          <p>
            <strong>State:</strong> {selectedUser.state || "N/A"}
          </p>
          <p>
            <strong>Pin Code:</strong> {selectedUser.pin_code || "N/A"}
          </p>
          <p>
            <strong>Country:</strong> {selectedUser.country || "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {selectedUser.dob || "N/A"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 w-full cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ShowUserDetailsModal;
