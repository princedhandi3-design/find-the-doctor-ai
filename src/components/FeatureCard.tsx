type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-80">
      <h3 className="text-xl font-bold text-cyan-600">
        {title}
      </h3>

      <p className="text-gray-600 mt-2">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;