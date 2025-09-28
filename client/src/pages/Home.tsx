import React from 'react';

const Home = () => {
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
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Tailwind CSS with DaisyUI is now configured and working!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
