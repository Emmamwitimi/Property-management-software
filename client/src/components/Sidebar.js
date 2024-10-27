import { NavLink } from "react-router-dom"; // Importing NavLink from react-router-dom for navigational links with active styling
import { LayoutDashboard, Building2, Users, UserCircle } from "lucide-react"; // Importing icons from lucide-react library for use in the sidebar

// Defining an array of navigation items for the sidebar
// name, href (path), and an icon component
const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Tenants", href: "/tenants", icon: Users },
  { name: "Landlords", href: "/landlords", icon: UserCircle },
];

// Defining the Sidebar component as the default export
export default function Sidebar() {
  // Returning the JSX structure for the sidebar
  return (
    // Sidebar container with fixed position on the left, taking up full viewport height (minus 57px for the navbar), and 64px width
    <aside className="mt-20 fixed left-0 top-[57px] w-64 h-[calc(100vh-57px)] bg-white border-r border-gray-200">
      {/* Wrapping div with padding and vertical scrolling enabled if content exceeds viewport height */}
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Unordered list to hold each navigation item, spaced vertically with medium font weight */}
        <ul className="space-y-2 font-medium">
          {/* Mapping over navigation items to dynamically generate each link */}
          {navigation.map((item) => (
            <li key={item.name}>
              {" "}
              {/* List item, using item.name as the unique key */}
              <NavLink
                to={item.href} // Destination path for the NavLink
                className={({ isActive }) =>
                  // Dynamically sets the class based on whether the link is active
                  // Common styles: flex container, padding, gray text, rounded with hover effect
                  // Conditional styling: adds 'bg-gray-100' class if the link is active
                  `flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                    isActive ? "bg-gray-100" : ""
                  }`
                }
              >
                {/* Icon for the link, setting width and height to 5 to fit within the design */}
                <item.icon className="w-5 h-5" />
                {/* Span for the navigation name, with left margin to add spacing after the icon */}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
