
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-awfar-primary text-white mb-5">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-awfar-primary">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
