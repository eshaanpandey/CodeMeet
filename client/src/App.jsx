import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import Room from "./pages/Room";
import SetupRoom from "./pages/SetupRoom";

const App = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setup-room" element={<SetupRoom />} />
        <Route path="/room/:roomID" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
