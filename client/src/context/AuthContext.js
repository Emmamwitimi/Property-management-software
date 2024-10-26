import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create an authentication context that will be used to share user data
const AuthContext = createContext(null);

// This component will provide the authentication data to any component that needs it
export function AuthProvider({ children }) {
  // State to store the current user and whether they're logged in
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect to check if there's a logged-in user in local storage when the app first loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Check for saved user data in local storage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user state if data exists
      setIsLoggedIn(true); // Set logged-in state to true
    }
  }, []); // Empty dependency array means this runs only once, after the initial render

  // Function to handle user login with async call to the server
  const login = async (username, password) => {
    try {
      // Make a POST request to login with username and password
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      // If successful, store the returned user data
      const userData = response.data.user;
      setUser(userData); // Set the user state with the retrieved user data
      setIsLoggedIn(true); // Update logged-in state to true
      localStorage.setItem("user", JSON.stringify(userData)); // Save user data to local storage for persistence
    } catch (error) {
      // If the request fails, throw an error to indicate login failure
      throw new Error("Login failed");
    }
  };

  // Function to log out the user
  const logout = () => {
    setUser(null); // Clear user data from state
    setIsLoggedIn(false); // Update logged-in state to false
    localStorage.removeItem("user"); // Remove user data from local storage
  };

  // Provide the context value to any component wrapped in AuthProvider
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children} {/* Render any child components passed to AuthProvider */}
    </AuthContext.Provider>
  );
}

// Custom hook to access the authentication context
export function useAuth() {
  const context = useContext(AuthContext); // Access the AuthContext
  if (!context) {
    // Ensure the hook is used inside an AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Return the context value for use in components
}
