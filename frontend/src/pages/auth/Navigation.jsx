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
  Layout,
  Package,
  ClipboardList,
  Users,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
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
          {!userInfo && (
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
    <NavigationMenu className="hidden lg:flex ">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink to="/" label="Home" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink to="/shop" label="Shop" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink to="/cart" label="Cart" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink to="/favorite" label="Favorites" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  const UserMenu = () => {
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
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/productlist">Products</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/categorylist">Categories</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/orderlist">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/userlist">Users</Link>
              </DropdownMenuItem>
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

  return (
    <header className="fixed top-0 z-50 w-full  bg-black backdrop-blur supports-[backdrop-filter]:bg-black md:px-[2rem] text-white px-[1rem]">
      <div className="container flex h-14 items-center">
        <div className="ml-auto md:w-auto md:flex-none">
          <MobileNav />
        </div>
        <Link to="/" className="mr-6 flex items-center space-x-2 ml-[1rem] lg:ml-0">
          <span className=" font-medium text-2xl font-bubblegum sm:inline-block">
            Epic cart
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="mr-4 hidden md:flex">
            <DesktopNav />
          </div>
        </div>
        {/* Adjusted MobileNav */}
        {userInfo ? (
          <UserMenu />
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login" className="bg-white text-black">Login</Link>
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
