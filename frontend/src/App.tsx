import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { CheckoutData } from './types';

type Page = 'home' | 'search' | 'details' | 'checkout' | 'confirmation';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [confirmationData, setConfirmationData] = useState<{ refId: string } | null>(null);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <HomePage
            setPage={setPage}
            setSelectedExperienceId={setSelectedExperienceId}
          />
        );
      case 'search':
        return (
          <SearchPage
            searchQuery={searchQuery}
            setPage={setPage}
            setSelectedExperienceId={setSelectedExperienceId}
          />
        );
      case 'details':
        return (
          <DetailsPage
            experienceId={selectedExperienceId!}
            setPage={setPage}
            setCheckoutData={setCheckoutData}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            checkoutData={checkoutData!}
            setPage={setPage}
            setConfirmationData={setConfirmationData}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationPage
            confirmationData={confirmationData!}
            setPage={setPage}
          />
        );
      default:
        return <HomePage setPage={setPage} setSelectedExperienceId={setSelectedExperienceId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        setPage={setPage}
        setSearchQuery={setSearchQuery}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;