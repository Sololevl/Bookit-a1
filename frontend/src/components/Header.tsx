import React, { useState } from 'react';

interface HeaderProps {
  setPage: (page: 'home' | 'search' | 'details' | 'checkout' | 'confirmation') => void;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setPage, setSearchQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      setPage('search');
    }
  };

  const goHome = () => {
    setSearchQuery('');
    setSearchTerm('');
    setPage('home');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={goHome} className="flex items-center space-x-2">
            <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white text-sm font-bold">hd</span>
            </div>
            <span className="text-lg font-semibold hidden sm:inline">highway delite</span>
          </button>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md ml-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search experiences"
              className="flex-1 px-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md text-sm transition"
            >
              Search
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;