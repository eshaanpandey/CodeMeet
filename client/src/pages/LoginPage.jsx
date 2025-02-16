import { useState } from "react";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { loginUser, googleLogin } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(email, password, dispatch);
  };

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}
    >
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <motion.div
          className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-80 text-center border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-white text-3xl font-semibold mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-3">
            <motion.input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-white/30 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
            <div className="relative">
              <motion.input
                type={showPassword ? "password" : "text"}
                placeholder="Password"
                className="w-full p-3 rounded-lg border border-white/30 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              <span
                className="absolute right-3 top-3 text-white cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <motion.button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </motion.button>
          </form>

          <div className="mt-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse.credential);
                googleLogin(credentialResponse.credential, dispatch);
              }}
              onError={() => console.log("Google Login Failed")}
            />
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
