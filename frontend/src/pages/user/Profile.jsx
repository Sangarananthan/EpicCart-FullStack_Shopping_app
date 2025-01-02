import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Lock, KeyRound, Package, Loader } from "lucide-react";
import { setCreadintials } from "../../redux/features/auth/authSlice";
import { useUpdateCurrentUserMutation } from "../../redux/api/userApiSlice";
const FormInput = ({
  type,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  label,
}) => (
  <div className="relative mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/50 border border-gray-600 
                 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 
                 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
        placeholder={placeholder}
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
  const [fadeIn, setFadeIn] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    setFadeIn(true);
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
      console.log(updateData);
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
      const errorMessage = err?.data?.message || err.error || "Update failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div
        className={`w-full max-w-md transform transition-all duration-500 ${
          fadeIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="shadow-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-4 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Profile Settings
            </h2>
            <p className="text-gray-400">Update your personal information</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
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

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg
                         bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium
                         transform transition-all duration-200 hover:from-orange-600 hover:to-orange-700
                         focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                         focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                ) : null}
                {isLoading ? "Updating..." : "Update Profile"}
              </button>

              <Link
                to="/user-orders"
                className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg
                         bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium
                         transform transition-all duration-200 hover:from-gray-700 hover:to-gray-800"
              >
                <Package className="w-5 h-5 mr-2" />
                My Orders
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
