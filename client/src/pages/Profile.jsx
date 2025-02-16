import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <motion.div
        className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700 w-96 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={user.avatar || "/assets/profilePic.webp"}
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full mx-auto border-4 border-blue-400 shadow-lg"
          whileHover={{ scale: 1.1 }}
        />
        <h2 className="text-3xl font-semibold mt-4">
          {user.username || "User"}
        </h2>
        <p className="text-gray-400">{user.email}</p>

        <div className="mt-6 space-y-2">
          <div className="bg-gray-700 p-3 rounded-lg shadow">
            <strong>Joined:</strong> <span>January 2025</span>
          </div>
        </div>

        <Link
          to="/"
          className="block mt-6 bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Go to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Profile;
