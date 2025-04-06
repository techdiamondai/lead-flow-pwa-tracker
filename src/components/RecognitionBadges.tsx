
import React from "react";
import { ArrowRight } from "lucide-react";

interface BadgeProps {
  logo: string;
  title: string;
  description: string;
  link: string;
}

const RecognitionBadge: React.FC<BadgeProps> = ({ logo, title, description, link }) => {
  return (
    <div className="flex items-center gap-6">
      <div className="bg-white rounded-full p-4 shadow-md w-24 h-24 flex items-center justify-center flex-shrink-0">
        <img src={logo} alt={title} className="max-w-full max-h-full" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <a href={link} className="text-blue-600 flex items-center mt-1 hover:underline">
          Read more <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

const RecognitionBadges = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <RecognitionBadge 
        logo="https://upload.wikimedia.org/wikipedia/commons/9/91/Gartner_logo.svg"
        title="Visionary in 2024 Magic Quadrant™"
        description="for Sales Force Automation Platforms"
        link="#"
      />
      <RecognitionBadge 
        logo="https://upload.wikimedia.org/wikipedia/commons/2/23/Nucleus_Research_logo.png"
        title="Nucleus Research - Leader, 2024"
        description="SFA Technology Value Matrix 2024"
        link="#"
      />
    </div>
  );
};

export default RecognitionBadges;
