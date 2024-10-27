import { Bell, Settings } from "lucide-react"; // Importing two icons, Bell and Settings, from the 'lucide-react' library for use in the Navbar
import { useAuth } from "../context/AuthContext"; // Importing the useAuth hook from the AuthContext to access authentication-related state and functions

// Defining the Navbar component as a default export
export default function Navbar() {
  // Using destructuring to extract 'user' (contains user information) and 'logout' (function to log out the user) from the useAuth hook
  const { user, logout } = useAuth();

  // Returning the JSX structure for the navigation bar
  return (
    // Navigation container with fixed position at the top, occupying full width with white background and gray bottom border
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      {/* Wrapping div for padding adjustments on smaller and larger screens */}
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        {/* Flex container to evenly space items within the navbar */}
        <div className="flex items-center justify-between">
          {/* Left section of the navbar containing the app's name */}
          <div className="flex items-center justify-start">
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
              PropManager{" "}
              {/* Displaying the application's name with appropriate font and size styling */}
            </span>
          </div>

          {/* Right section of the navbar containing icons and user information */}
          <div className="flex items-center gap-4">
            {/* Button for notifications icon */}
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />{" "}
              {/* Bell icon, size adjusted to fit within the navbar layout */}
            </button>

            {/* Button for settings icon */}
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />{" "}
              {/* Settings icon, similar size to Bell icon */}
            </button>

            {/* User information and logout button */}
            <div className="flex items-center gap-2">
              {/* Displays the username if the user is logged in; handles cases where 'user' might be undefined */}
              <span className="text-sm font-medium">{user?.username}</span>
              {/* Logout button, styled in red, with a hover effect to indicate it's an actionable item */}
              <button
                onClick={logout} // Calls the logout function when clicked, logging the user out
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout {/* Button text */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
