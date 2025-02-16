import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="bg-gray-900 p-4 text-white flex justify-between items-center shadow-lg backdrop-blur-md">
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wider text-blue-400 hover:text-blue-500 transition"
      >
        CodeMeet
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="px-4 py-2 text-gray-300 hover:text-white transition"
        >
          Home
        </Link>
        {user ? (
          <>
            <Link
              to="/profile"
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Profile
            </Link>
            <motion.button
              onClick={() => dispatch(logout())}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                Signup
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
