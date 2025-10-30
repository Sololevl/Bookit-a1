import React from 'react';

interface ConfirmationPageProps {
  confirmationData: { refId: string };
  setPage: (page: 'home') => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ confirmationData, setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-green-500 rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-lg">
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed</h1>
      <p className="text-gray-600 text-lg mb-8">
        Ref ID: <span className="font-semibold">{confirmationData.refId}</span>
      </p>

      <button
        onClick={() => setPage('home')}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-md transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ConfirmationPage;