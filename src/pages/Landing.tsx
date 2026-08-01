import Navbar from "../components/Navbar";

import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";

function Landing() {
  return (
    <>
      <Navbar />
        <Hero />
      <main className="min-h-screen bg-slate-50 p-10">

  <div className="text-center mt-10">
    <h2 className="text-5xl font-bold text-cyan-600">
      Find Your Doctor with AI
    </h2>

    <p className="mt-4 text-gray-600">
      Smart healthcare guidance powered by AI.
    </p>
  </div>

  
    <FeatureSection />
  

</main>
    </>
  );
}

export default Landing;