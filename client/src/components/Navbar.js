import { Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
              PropManager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user?.username}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
