import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-cyan-600">
        FindTheDoctor AI
      </h1>

      <button
        onClick={() => navigate("/symptoms")}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
      >
        Get Started
      </button>
    </nav>
  );
}

export default Navbar;