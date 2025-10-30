import React, { useState, useEffect } from 'react';
import ExperienceCard from '../components/ExperienceCard';
import { Experience } from '../types';
import { experienceApi } from '../services/api';

interface SearchPageProps {
  searchQuery: string;
  setPage: (page: 'details') => void;
  setSelectedExperienceId: (id: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ searchQuery, setPage, setSelectedExperienceId }) => {
  const [results, setResults] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await experienceApi.getAll(searchQuery);
        setResults(data);
      } catch (err) {
        setError('Failed to search experiences. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery]);

  const handleViewDetails = (id: string) => {
    setSelectedExperienceId(id);
    setPage('details');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
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
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Search results for: <span className="text-yellow-500">"{searchQuery}"</span>
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600">No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;