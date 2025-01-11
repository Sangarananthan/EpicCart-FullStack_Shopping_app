import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBars, FaUserCog } from "react-icons/fa";

const AdminMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FaUserCog },
    { path: "/admin/categorylist", label: "Categories" },
    { path: "/admin/productlist", label: "Add Product" },
    { path: "/admin/allproducts", label: "All Products" },
    { path: "/admin/userlist", label: "Users" },
    { path: "/admin/orderlist", label: "Orders" },
  ];

  return (
    <>
      {/* Admin Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 p-3 rounded-full text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </motion.button>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl z-40"
          >
            <div className="p-6 space-y-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-indigo-100 text-indigo-600"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.icon ? <item.icon className="mr-3" /> : null}
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMenu;
