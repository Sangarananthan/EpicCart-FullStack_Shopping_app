import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCreadintials } from "../../redux/features/auth/authSlice";
import { Loader, User, Mail, Lock, KeyRound } from "lucide-react";
import { useRegisterMutation } from "../../redux/api/userApiSlice";

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

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fadeIn, setFadeIn] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    setFadeIn(true);
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
      toast.success(result.message || "Registration successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Registration failed");
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">
      {/* Form Section */}
      <div
        className={`w-full lg:w-full p-8 lg:p-16 flex items-center justify-center
                    transform transition-all duration-500 ${
                      fadeIn
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-10 opacity-0"
                    }`}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-400">Join us and start shopping today</p>
          </div>

          <form onSubmit={submitHandler} className="mt-8 space-y-6">
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

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg
                       bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium
                       transform transition-all duration-200 hover:from-orange-600 hover:to-orange-700
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : null}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Image Section
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-xl z-10"></div>
        <img
          src="https://png.pngtree.com/thumb_back/fw800/background/20231103/pngtree-red-and-black-glitch-texture-with-static-noise-and-artifacts-image_13748683.png"
          alt="Register"
          className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
      </div> */}
    </div>
  );
};

export default Register;
