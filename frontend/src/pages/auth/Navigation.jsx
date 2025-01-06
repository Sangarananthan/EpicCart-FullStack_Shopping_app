import { useState, useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
const Navigation = () => {
  const [dropdownOpen, setDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userInfo]);

  const toggleDropdown = () => {
    setDropdown(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logoutHandler = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const NavLink = ({ to, icon: Icon, label, onClick }) => (
    <Link
      to={to}
      className="group relative flex items-center w-full"
      onClick={onClick}
    >
      <div className="flex items-center w-full p-3 rounded-lg transition-all duration-300 ease-in-out transform group-hover:translate-x-1">
        <Icon className="w-6 h-6 shrink-0" />
        <div
          className={`ml-4 whitespace-nowrap transition-all duration-300 ease-in-out ${
            isExpanded || isMobileMenuOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          }`}
        >
          {label}
        </div>
      </div>
      {!isExpanded && !isMobileMenuOpen && (
        <div className="absolute left-14 z-50 bg-gray-800 text-white px-2 py-1 rounded opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );
  // Mobile burger menu button
  const BurgerButton = () => (
    <button
      onClick={toggleMobileMenu}
      className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );

  return (
    <>
      <BurgerButton />

      <nav
        style={{
          zIndex: 999,
          backdropFilter: isExpanded ? "blur(5px)" : "none",
        }}
        className={`fixed h-screen bg-black backdrop-blur-sm bg-opacity-95 text-white transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64" : "w-20"} 
          lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"}
          ${isMobileMenuOpen ? "w-64" : "w-20"}
          shadow-lg z-40`}
        onMouseEnter={() => !isMobileMenuOpen && setIsExpanded(true)}
        onMouseLeave={() => !isMobileMenuOpen && setIsExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand Section */}
          <div className="p-4 mb-8 text-center">
            <div
              className={`text-2xl font-bold transition-all duration-300 ${
                isExpanded || isMobileMenuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Store
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="flex-1 px-3 space-y-2">
            <NavLink
              to="/"
              icon={Home}
              label="HOME"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavLink
              to="/shop"
              icon={ShoppingBag}
              label="SHOP"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavLink
              to="/cart"
              icon={ShoppingCart}
              label="CART"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavLink
              to="/favorite"
              icon={Heart}
              label="FAVORITES"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          {/* User Section */}

          <div className="p-4 border-t border-gray-900">
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
                  {(isExpanded || isMobileMenuOpen) && (
                    <>
                      <span className="ml-3 transition-opacity duration-300">
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
                {dropdownOpen && (isExpanded || isMobileMenuOpen) && (
                  <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden transform origin-bottom transition-all duration-200">
                    {userInfo.isAdmin && (
                      <>
                        <NavLink
                          to="/admin/dashboard"
                          icon={Layout}
                          label="Dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <NavLink
                          to="/admin/productlist"
                          icon={Package}
                          label="Products"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <NavLink
                          to="/admin/categorylist"
                          icon={Package}
                          label="Categories"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <NavLink
                          to="/admin/orderlist"
                          icon={ClipboardList}
                          label="Orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <NavLink
                          to="/admin/userlist"
                          icon={Users}
                          label="Users"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      </>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-white/10 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logoutHandler();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink
                  to="/login"
                  icon={LogIn}
                  label="LOGIN"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <NavLink
                  to="/register"
                  icon={UserPlus}
                  label="REGISTER"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
