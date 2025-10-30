import React, { useState, useEffect } from 'react';
import ExperienceCard from '../components/ExperienceCard';
import { Experience } from '../types';
import { experienceApi } from '../services/api';

interface HomePageProps {
  setPage: (page: 'details') => void;
  setSelectedExperienceId: (id: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, setSelectedExperienceId }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await experienceApi.getAll();
        setExperiences(data);
      } catch (err) {
        setError('Failed to load experiences. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleViewDetails = (id: string) => {
    setSelectedExperienceId(id);
    setPage('details');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;