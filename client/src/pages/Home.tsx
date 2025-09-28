import { useState, useEffect } from 'react';

// Types
interface HouseListing {
  _id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

const Home = () => {
  // State management
  const [listings, setListings] = useState<HouseListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings from server
  const fetchListings = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3000/listings');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HouseListing[] = await response.json();
      setListings(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch listings';
      setError(errorMessage);
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  // Format price helper
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto p-8">
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-lg">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-primary">Real Estate</h1>
              <p className="py-6 text-base-content">
                Find your dream home with our comprehensive real estate
                platform. Browse properties, connect with agents, and make
                informed decisions.
              </p>
              <button
                className="btn btn-primary"
                onClick={fetchListings}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Listings'}
              </button>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-base-content">
              Available Properties
            </h2>
            <div className="badge badge-outline">
              {listings.length}{' '}
              {listings.length === 1 ? 'Property' : 'Properties'}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="ml-4 text-lg">Loading properties...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {error}</span>
              <div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={fetchListings}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Listings Grid */}
          {!loading && !error && listings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">
                No Properties Found
              </h3>
              <p className="text-base-content/70">
                There are currently no properties available. Check back later!
              </p>
            </div>
          )}

          {!loading && !error && listings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  {listing.imageUrl && (
                    <figure>
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="h-48 w-full object-cover"
                      />
                    </figure>
                  )}
                  <div className="card-body">
                    <h2 className="card-title text-primary">
                      {listing.title}
                      <div className="badge badge-secondary">
                        {formatPrice(listing.price)}
                      </div>
                    </h2>

                    <p className="text-base-content/70 mb-2">
                      📍 {listing.location}
                    </p>

                    {listing.description && (
                      <p className="text-sm text-base-content/80 mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    <div className="flex justify-between text-sm text-base-content/70 mb-4">
                      <span>🛏️ {listing.bedrooms} beds</span>
                      <span>🚿 {listing.bathrooms} baths</span>
                      <span>📐 {listing.area} sq ft</span>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-primary btn-sm">
                        View Details
                      </button>
                      <button className="btn btn-outline btn-sm">
                        Contact Agent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-secondary">🏠 Find Properties</h2>
              <p>Search through thousands of properties</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-outline">Explore</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-accent">👨‍💼 Expert Agents</h2>
              <p>Connect with professional real estate agents</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-outline">Contact</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-info">📊 Market Insights</h2>
              <p>Get detailed market analysis and trends</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-outline">View Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
