import UpdateDetails from "../Components/UpdateDetails";
import UpdateProfileImage from "../Components/UpdateProfileImage";

function Setting() {
  return (
    <div className="flex flex-col gap-6 p-6 justify-center items-center w-full min-h-screen bg-gray-100">
      {/* Upload Image */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">
          Upload Profile Image
        </h2>
        <UpdateProfileImage />
      </div>

      {/* Update Basic Details */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">
          Update Basic Details
        </h2>
        <UpdateDetails />
      </div>

      {/* Password Update Section */}
      {/* As for now it will not need there */}
      {/* <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">Update Password</h2>
        <UpdatePassword />
      </div> */}
    </div>
  );
}

export default Setting;
