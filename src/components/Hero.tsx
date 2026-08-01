import { useNavigate } from "react-router-dom";

function Hero() {
  
  const navigate = useNavigate();
    return (

    <section className="text-center py-20 px-6">
      <h1 className="text-6xl font-bold text-cyan-600">
        Find Your Perfect Doctor with AI
      </h1>

      <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
        Describe your symptoms and let AI recommend the right medical specialist
        before helping you discover trusted doctors nearby.
      </p>

      <button 
      
      onClick={() => navigate("/symptoms")}
      className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
        Analyze Symptoms
      </button>
    </section>
  );
}

export default Hero;