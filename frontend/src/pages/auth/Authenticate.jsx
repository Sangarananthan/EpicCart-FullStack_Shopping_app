import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Mail, Lock, User, KeyRound, Loader } from "lucide-react";
import { toast } from "react-toastify";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../redux/api/userApiSlice";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { setCreadintials } from "../../redux/features/auth/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Shared Form Input Component
const FormInput = ({
  type,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  label,
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        <Icon className="h-4 w-4" />
      </div>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-9 h-10"
      />
    </div>
  </div>
);

// Login Component
export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCreadintials(result.user));
      toast.success("Login successful!");
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="email"
              icon={Mail}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              label="Email Address"
            />
            <FormInput
              type="password"
              icon={Lock}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              label="Password"
            />
            <Button type="submit" className="w-full bg-orange-400" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">New customer? </span>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Register Component
export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCreadintials(result.user));
      toast.success("Registration successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-4">
            <FormInput
              type="text"
              icon={User}
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your name"
              label="Full Name"
            />
            <FormInput
              type="email"
              icon={Mail}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              label="Email Address"
            />
            <FormInput
              type="password"
              icon={Lock}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              label="Password"
            />
            <FormInput
              type="password"
              icon={KeyRound}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              label="Confirm Password"
            />
            <Button
              type="submit"
              className="w-full  bg-orange-400"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default { Login, Register };
