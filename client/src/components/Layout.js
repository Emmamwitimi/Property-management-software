// Import the `Outlet` component from `react-router-dom` to render child routes inside the layout.
// `Outlet` is a placeholder for nested route components, making this component a reusable layout.
// Also, import `Sidebar` and `Navbar`, which are custom components that will be displayed in the layout.
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// Define the `Layout` component, which will be used as a shared layout for all pages within the app
export default function Layout() {
  return (
    // Create a div to wrap the entire layout with some utility classes:
    // `min-h-screen` makes the layout fill at least the height of the screen,
    // gray background color.
    <div className="min-h-screen bg-gray-50">
      {/* Render the `Navbar` component at the top of the page, which contains links or branding */}
      <Navbar />

      {/* Create a flex container to display the `Sidebar` next to the main content area */}
      <div className="flex">
        {/* Render the `Sidebar` component on the left side of the layout.
          This could contain navigation links or additional options for the app. */}
        <Sidebar />

        {/* Define the main content area where nested routes will be displayed. */}
        {/* `flex-1` allows this section to expand and take up the remaining space in the container. */}
        {/* `p-8` adds padding around the content for better spacing. */}
        <main className="flex-1 p-8">
          {/* `Outlet` will render the child components based on the current route.
            For example, if the user navigates to a specific page, that page component will
            be displayed here, keeping the `Navbar` and `Sidebar` visible. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
