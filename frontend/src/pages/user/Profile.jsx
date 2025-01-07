import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User, Mail, Lock, KeyRound, Package, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { setCreadintials } from "../../redux/features/auth/authSlice";
import { useUpdateCurrentUserMutation } from "../../redux/api/userApiSlice";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";

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
    <Label className="text-sm font-medium">{label}</Label>
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
        className="pl-9"
      />
    </div>
  </div>
);

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { userInfo } = useSelector((state) => state.auth);
  const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      username: userInfo.username || "",
      email: userInfo.email || "",
    }));
  }, [userInfo.email, userInfo.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const updateData = {
        _id: userInfo._id,
        username: formData.username,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await updateCurrentUser(updateData).unwrap();
      dispatch(setCreadintials(res.user));

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gray-200 text-[2rem] text-white">
                {userInfo.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Profile Settings
          </CardTitle>
          <CardDescription className="text-center">
            Update your personal information
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
              label="Name"
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
              placeholder="Enter new password"
              label="New Password"
            />
            <FormInput
              type="password"
              icon={KeyRound}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              label="Confirm Password"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1  bg-orange-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>

              <Button variant="secondary" className="flex-1" asChild>
                <Link to="/user-orders">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
