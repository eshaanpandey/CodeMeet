import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(90,10,150,0.3)_10%,_transparent_80%)] blur-3xl opacity-30"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">
          Welcome to CodeMeet
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl">
          The ultimate platform for seamless real-time collaboration, video
          meetings, and live code editing.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="mt-6 px-6 py-3 rounded-lg text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all shadow-lg"
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {[
          "User Authentication",
          "Video Meetings",
          "Real-time Collaborative Code Editing",
          "In-meeting Chat",
          "Screen Sharing",
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg text-center hover:shadow-xl hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-semibold text-blue-400">{feature}</h2>
          </motion.div>
        ))}
      </div>

      {/* Technologies Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-300">Technologies Used</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-lg text-gray-400">
          {[
            "Backend: Go",
            "Frontend: React",
            "Database: MongoDB",
            "Real-time: WebSocket, WebRTC",
            "Containerization: Docker",
          ].map((tech, index) => (
            <motion.div
              key={index}
              className="px-4 py-2 rounded-md bg-gray-800 shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
