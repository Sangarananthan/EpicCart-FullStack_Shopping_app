import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
const Navigation = () => {
  const [dropdown, setDropdown] = useState(false);
  const [showSidebar, setshowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const toggleSidebar = () => {
    setshowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setshowSidebar(false);
  };

  return (
    <div
      style={{ zIndex: 1000 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh]  fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link to="/" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">HOME</span>
          </div>
        </Link>

        <Link to="/shop" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
          </div>
        </Link>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Cart</span>
          </div>
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
            <FaHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">
              Favorites
            </span>{" "}
          </div>
        </Link>
      </div>

      <ul>
        <li>
          <Link to="/login" className="flex relative">
            <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
              <AiOutlineLogin className="mt-[3rem] mr-2" size={20} />
              <span className="hidden nav-item-name mt-[3rem]">Login</span>{" "}
            </div>
          </Link>
        </li>
        <li>
          <Link to="/register" className="flex relative">
            <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
              <AiOutlineUserAdd className="mt-[3rem] mr-2" size={20} />
              <span className="hidden nav-item-name mt-[3rem]">
                Register
              </span>{" "}
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
