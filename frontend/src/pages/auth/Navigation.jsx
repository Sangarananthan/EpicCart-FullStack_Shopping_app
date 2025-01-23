import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  LogIn,
  UserPlus,
  Menu,
  ListIcon,
  User2,
  ShoppingBagIcon,
  
  Package,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "../../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
import { FaUserCog } from "react-icons/fa";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout();
      dispatch(logoutAction());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FaUserCog },
    { path: "/admin/categorylist", label: "Categories", icon: ListIcon },
    { path: "/admin/productlist", label: "Add Product", icon: Package },
    { path: "/admin/allproducts", label: "All Products", icon: Package },
    { path: "/admin/userlist", label: "Users", icon: User2 },
    { path: "/admin/orderlist", label: "Orders", icon: ShoppingBagIcon },
  ];

  const NavLink = ({ to, icon: Icon, label, onClick, badge }) => (
    <Link
      to={to}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{label}</span>
      {badge && <Badge variant="secondary">{badge}</Badge>}
    </Link>
  );

  const UserDropdownMenu = () => {
    if (!userInfo) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 text-black font-bold">
              <AvatarFallback>
                {userInfo.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>

          {userInfo.isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="mr-2">
                    <FaUserCog />
                  </span>
                  Manage
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {adminMenuItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center">
                        <span className="mr-2">{<item.icon />}</span>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logoutHandler} className="text-red-600">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full">
        <nav className="flex flex-col gap-4 pt-6">
          <NavLink to="/" icon={Home} label="Home" />
          <NavLink to="/shop" icon={ShoppingBag} label="Shop" />
          <NavLink to="/cart" icon={ShoppingCart} label="Cart" />
          <NavLink to="/favorite" icon={Heart} label="Favorites" />

          {userInfo ? (
            <>
             
            </>
          ) : (
            <>
              <NavLink to="/login" icon={LogIn} label="Login" />
              <NavLink to="/register" icon={UserPlus} label="Register" />
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem className="hover:text-black">
          <NavLink to="/" label="Home" />
        </NavigationMenuItem>
        <NavigationMenuItem className="hover:text-black">
          <NavLink to="/shop" label="Shop" />
        </NavigationMenuItem>
        <NavigationMenuItem className="hover:text-black">
          <NavLink to="/cart" label="Cart" />
        </NavigationMenuItem>
        <NavigationMenuItem className="hover:text-black">
          <NavLink to="/favorite" label="Favorites" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <header className="fixed top-0 z-50 w-full bg-black backdrop-blur supports-[backdrop-filter]:bg-black md:px-[2rem] text-white px-[1rem]">
      <div className="container flex h-14 items-center">
        <div className="ml-auto md:w-auto md:flex-none">
          <MobileNav />
        </div>
        <Link
          to="/"
          className="mr-6 flex items-center space-x-2 ml-[1rem] lg:ml-0"
        >
          <span className="font-bold text-2xl sm:inline-block">EPIC CART</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="mr-4 hidden md:flex">
            <DesktopNav />
          </div>
        </div>
        {userInfo ? (
          <div className="flex items-center">
            <UserDropdownMenu />
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login" className="bg-white text-black">
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
