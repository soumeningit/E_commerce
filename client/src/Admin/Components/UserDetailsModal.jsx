function UserDetailsModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 transform scale-95 animate-pop-in">
        <style>
          {`
              @keyframes pop-in {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
              .animate-pop-in {
                animation: pop-in 0.3s ease-out forwards;
              }
            `}
        </style>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          User Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div>
              <p className="text-lg font-medium">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div>
            <p>
              <strong>Contact:</strong> {user.mobileNo || "Not Provided"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {user.city || user.state || user.country
                ? `${user.city || ""}, ${user.state || ""}, ${
                    user.country || ""
                  } ${user.pinCode || ""}`.trim()
                : "Not Provided"}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender || "Not Provided"}
            </p>
            <p>
              <strong>Seller ID:</strong> {user.seller_id || "Not Verified"}
            </p>
            <p>
              <strong>Unique ID:</strong> {user.unique_id || "Not Provided"}
            </p>
            <p>
              <strong>ID Card Type:</strong>{" "}
              {user.public_id_type || "Not Provided"}
            </p>
            {user.public_id && (
              <div>
                <p>
                  <strong>ID Card:</strong>
                </p>
                <img
                  src={user.public_id_image}
                  alt="ID Card"
                  className="w-full max-w-xs rounded-lg mt-2"
                />
              </div>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;
