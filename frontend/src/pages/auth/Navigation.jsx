import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  LogIn,
  UserPlus,
  ChevronDown,
  Layout,
  Package,
  ClipboardList,
  Users,
  GroupIcon,
} from "lucide-react";

const Navigation = () => {
  const [dropdownOpen, setDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdown(!dropdownOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link to={to} className="group relative flex items-center">
      <div className="flex items-center p-3 rounded-lg transition-all duration-300 transform group-hover:bg-white/10 group-hover:translate-x-2">
        <Icon className="w-6 h-6" />
        <span
          className={`ml-4 whitespace-nowrap ${
            isExpanded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          {label}
        </span>
      </div>
      {!isExpanded && (
        <div className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );

  return (
    <nav
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${isExpanded ? "w-64" : "w-20"} 
        shadow-lg z-50`}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand Section */}
        <div className="p-4 mb-8 text-center">
          <div
            className={`text-2xl font-bold transition-all duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Store
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 px-3 space-y-2">
          <NavLink to="/" icon={Home} label="HOME" />
          <NavLink to="/shop" icon={ShoppingBag} label="SHOP" />
          <NavLink to="/cart" icon={ShoppingCart} label="CART" />
          <NavLink to="/favorite" icon={Heart} label="FAVORITES" />
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 hover:bg-white/10
                  ${dropdownOpen ? "bg-white/10" : ""}`}
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {userInfo.username[0].toUpperCase()}
                </div>
                {isExpanded && (
                  <>
                    <span
                      className={`ml-3 transition-opacity duration-300 ${
                        isExpanded ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {userInfo.username}
                    </span>
                    <ChevronDown
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {dropdownOpen && isExpanded && (
                <div className="absolute bottom-full left-0 w-full  mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden transform origin-bottom transition-all duration-200">
                  {userInfo.isAdmin && (
                    <>
                      <NavLink
                        to="/admin/dashboard"
                        icon={Layout}
                        label="Dashboard"
                      />
                      <NavLink
                        to="/admin/productlist"
                        icon={Package}
                        label="Products"
                      />
                      <NavLink
                        to="/admin/categorylist"
                        icon={GroupIcon}
                        label="Categories"
                      />
                      <NavLink
                        to="/admin/orderlist"
                        icon={ClipboardList}
                        label="Orders"
                      />
                      <NavLink
                        to="/admin/userlist"
                        icon={Users}
                        label="Users"
                      />
                    </>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-white/10 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <NavLink to="/login" icon={LogIn} label="LOGIN" />
              <NavLink to="/register" icon={UserPlus} label="REGISTER" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
