import React from 'react';
import { Experience } from '../types';

interface ExperienceCardProps {
  experience: Experience;
  onViewDetails: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200">
      <img
        src={experience.imageUrl}
        alt={experience.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {experience.location}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">From</span>
            <p className="text-lg font-semibold text-gray-900">₹{experience.price}</p>
          </div>
          <button
            onClick={() => onViewDetails(experience.id)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md text-sm transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;