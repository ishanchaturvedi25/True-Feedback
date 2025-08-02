import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-semibold flex items-center justify-center hover:bg-gray-300"
      >
        {user?.username?.[0]?.toUpperCase() || "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded z-10">
          <div className="px-4 py-2 text-sm text-gray-800 border-b">
            @{user?.username}
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;