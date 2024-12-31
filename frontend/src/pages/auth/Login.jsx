import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCreadintials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Loader, Mail, Lock } from "lucide-react";

const FormInput = ({
  type,
  icon: Icon,
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const [login, { isLoading }] = useLoginMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        toast.error(result.error?.data?.message || "An error occurred");
      } else {
        toast.success(result.data.message || "Login successful!");
        dispatch(setCreadintials(result.data.user));
        navigate(redirect);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "An error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">
      <div
        className={`w-full lg:w-full p-8 lg:p-20 flex items-center justify-center
                    transform transition-all duration-500 ${
                      fadeIn
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-10 opacity-0"
                    }`}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <FormInput
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                handleChange({
                  target: { name: "email", value: e.target.value },
                })
              }
              placeholder="Enter your email"
              label="Email Address"
            />

            <FormInput
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) =>
                handleChange({
                  target: { name: "password", value: e.target.value },
                })
              }
              placeholder="Enter your password"
              label="Password"
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
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-orange-500 hover:text-orange-400 font-medium transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Image section
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-xl z-10"></div>
        <img
          src="https://as1.ftcdn.net/v2/jpg/05/40/95/56/1000_F_540955621_TCWJa45UirIazr573D8AxxGuPXfqqnNd.jpg"
          alt="Register"
          className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
      </div> */}
    </div>
  );
};

export default Login;
