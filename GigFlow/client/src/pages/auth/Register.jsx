import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { register, clearError } from "../../store/slices/authSlice";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  Check,
  ArrowRight,
  Shield,
  Globe,
  Rocket,
} from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validate = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await dispatch(
        register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();
      toast.success("Account created successfully!");
    } catch (error) {
      // Error handled in useEffect
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-status-online",
    "bg-status-online",
  ];
  const strengthLabels = ["VERY WEAK", "WEAK", "FAIR", "STRONG", "VERY STRONG"];

  return (
    <div className="min-h-screen bg-nexus-black flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Cyan Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-glow-cyan/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-accent-orange/5 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-accent-orange">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display">
              GIG<span className="text-accent-orange">FLOW</span>
            </span>
          </Link>
          <h1 className="text-display text-3xl text-white mb-2">
            CREATE ACCOUNT
          </h1>
          <p className="text-text-secondary text-sm">
            Join thousands of freelancers and clients
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="nexus-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="input-label">FULL NAME</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input pl-12 ${
                    formErrors.name ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 font-mono"
                >
                  {formErrors.name}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="input-label">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input pl-12 ${
                    formErrors.email ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {formErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 font-mono"
                >
                  {formErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input pl-12 pr-12 ${
                    formErrors.password ? "border-red-500/50" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 transition-colors ${
                          i < passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-mono text-text-muted">
                    STRENGTH:{" "}
                    {strengthLabels[passwordStrength - 1] || "VERY WEAK"}
                  </p>
                </div>
              )}

              {formErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 font-mono"
                >
                  {formErrors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input pl-12 pr-12 ${
                    formErrors.confirmPassword ? "border-red-500/50" : ""
                  }`}
                />
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-status-online" />
                  )}
              </div>
              {formErrors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 font-mono"
                >
                  {formErrors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-mono text-text-muted">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign Up */}
          <GoogleLoginButton text="Sign up with Google" />

          {/* Sign In Link */}
          <p className="mt-6 text-center text-text-secondary text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent-orange hover:text-accent-orange-hover font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: Rocket, text: "FREE TO JOIN" },
            { icon: Shield, text: "SECURE PAYMENTS" },
            { icon: Globe, text: "GLOBAL NETWORK" },
          ].map((feature, index) => (
            <div key={index} className="nexus-card p-4 text-center">
              <feature.icon className="w-5 h-5 text-accent-orange mx-auto mb-2" />
              <span className="text-xs font-mono text-text-muted">
                {feature.text}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
