import { NavLink } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const { logout } = useAuth();
  const { user } = useSelector(state => state.user);
  
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Reservations", 
      path: "/reservations",
      icon: "Calendar"
    },
    {
      name: "Rooms",
      path: "/rooms", 
      icon: "Bed"
    },
    {
      name: "Guests",
      path: "/guests",
      icon: "Users"
    },
    {
      name: "Billing",
      path: "/billing",
      icon: "CreditCard"
    },
    {
      name: "Housekeeping",
      path: "/housekeeping",
      icon: "Sparkles"
    }
  ];

  return (
    <header className="bg-surface border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                  S
                </div>
                <span className="text-xl font-bold text-gray-900">StayFlow</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Add notification and settings buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                <ApperIcon name="Bell" className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <ApperIcon name="Settings" className="h-5 w-5" />
              </button>
              {user && (
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
</header>
  );
};

export default Header;