import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import BASE_URL from "../utils/config";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      alert("Signup successful! You can now login.");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
      <motion.div
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg w-80 text-center border border-white/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white text-3xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-3">
          <motion.input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg border border-white/30 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-white/30 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            whileFocus={{ scale: 1.05 }}
          />
          <div className="relative">
            <motion.input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-white/30 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
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
            className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;
