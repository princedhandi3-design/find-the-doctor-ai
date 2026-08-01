import FeatureCard from "./FeatureCard";
function FeatureSection(){
    return(

        <div className="flex justify-center gap-6 mt-16 flex-wrap">

    <FeatureCard
      title="AI Symptom Analysis"
      description="Analyze symptoms using Gemini AI."
    />

    
    <FeatureCard
      title="Nearby Doctors"
      description="Find trusted doctors around you."
    />

    <FeatureCard
      title="Fast & Secure"
      description="Your privacy is always protected."

   
    />
</div>
    );
}
export default FeatureSection;