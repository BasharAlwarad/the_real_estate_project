import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Types
interface HouseListing {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

interface FormData {
  title: string;
  price: string;
  image: string;
}

const Home = () => {
  const [listings, setListings] = useState<HouseListing[]>([]);
  const [showInsertForm, setShowInsertForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<HouseListing | null>(
    null
  );

  const [insertFormData, setInsertFormData] = useState<FormData>({
    title: '',
    price: '',
    image: '',
  });

  const [updateFormData, setUpdateFormData] = useState<FormData>({
    title: '',
    price: '',
    image: '',
  });

  // Fetch listings
  const fetchListings = async (): Promise<void> => {
    const response = await axios.get('http://localhost:3000/listings');
    setListings(response.data);
  };

  // Create listing
  const createListing = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await axios.post('http://localhost:3000/listings', {
      ...insertFormData,
      price: parseFloat(insertFormData.price),
    });

    setInsertFormData({ title: '', price: '', image: '' });
    setShowInsertForm(false);
    fetchListings();
  };

  // Update listing
  const updateListing = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/listings/${selectedListing?._id}`, {
      ...updateFormData,
      price: parseFloat(updateFormData.price),
    });

    setShowUpdateForm(false);
    setSelectedListing(null);
    fetchListings();
  };

  // Delete listing
  const deleteListing = async (id: string): Promise<void> => {
    await axios.delete(`http://localhost:3000/listings/${id}`);
    fetchListings();
  };

  // Open update form
  const openUpdateForm = (listing: HouseListing): void => {
    setSelectedListing(listing);
    setUpdateFormData({
      title: listing.title,
      price: listing.price.toString(),
      image: listing.image || '',
    });
    setShowUpdateForm(true);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="hero bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-3xl mb-12 shadow-lg">
          <div className="hero-content text-center py-16">
            <div className="max-w-2xl">
              <div className="mb-6">
                <div className="badge badge-primary badge-lg mb-4">
                  🏠 Real Estate Platform
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                Find Your Dream Home
              </h1>
              <p className="text-xl text-base-content/80 leading-relaxed mb-8">
                Discover, manage, and explore premium real estate listings with
                our comprehensive property management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setShowInsertForm(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Listing
                </button>
                <button
                  className="btn btn-outline btn-lg gap-2 hover:shadow-lg transition-all duration-300"
                  onClick={fetchListings}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Listings
                </button>
              </div>
              <div className="mt-8">
                <div className="stats stats-horizontal shadow-lg bg-base-100/50 backdrop-blur-sm">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="stat-title">Total Properties</div>
                    <div className="stat-value text-primary">
                      {listings.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-base-content mb-2">
                Featured Properties
              </h2>
              <p className="text-base-content/70">
                Explore our curated selection of premium properties
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-primary badge-lg gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {listings.length}{' '}
                {listings.length === 1 ? 'Property' : 'Properties'}
              </div>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mx-auto text-base-content/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-base-content/70 mb-4">
                No Properties Found
              </h3>
              <p className="text-base-content/50 mb-6">
                Start by adding your first property listing
              </p>
              <button
                className="btn btn-primary gap-2"
                onClick={() => setShowInsertForm(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add First Property
              </button>
            </div>
          ) : (
            /* Listings Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-base-300/20"
                >
                  {listing.image ? (
                    <figure className="relative overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="badge badge-primary badge-lg font-bold shadow-lg">
                          {formatPrice(listing.price)}
                        </div>
                      </div>
                    </figure>
                  ) : (
                    <figure className="bg-gradient-to-br from-base-200 to-base-300 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto text-base-content/30 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-base-content/50 text-sm">
                          No Image
                        </span>
                        <div className="absolute top-4 right-4">
                          <div className="badge badge-primary badge-lg font-bold shadow-lg">
                            {formatPrice(listing.price)}
                          </div>
                        </div>
                      </div>
                    </figure>
                  )}

                  <div className="card-body p-6">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="card-title text-xl hover:text-primary transition-colors duration-200 cursor-pointer line-clamp-2"
                    >
                      {listing.title}
                    </Link>

                    <div className="card-actions justify-between mt-6">
                      <Link
                        to={`/listing/${listing._id}`}
                        className="btn btn-primary btn-sm gap-2 flex-1 mr-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </Link>
                      <div className="dropdown dropdown-end">
                        <label
                          tabIndex={0}
                          className="btn btn-ghost btn-sm btn-circle"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01"
                            />
                          </svg>
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-32 border border-base-300"
                        >
                          <li>
                            <button
                              onClick={() => openUpdateForm(listing)}
                              className="gap-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => deleteListing(listing._id)}
                              className="text-error gap-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insert Form Modal */}
        {showInsertForm && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-primary flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Property
                </h3>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowInsertForm(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={createListing} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Property Title
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter property title..."
                    className="input input-bordered w-full focus:input-primary"
                    value={insertFormData.title}
                    onChange={(e) =>
                      setInsertFormData({
                        ...insertFormData,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Price (USD)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-base-content/50">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="250000"
                      className="input input-bordered w-full pl-8 focus:input-primary"
                      value={insertFormData.price}
                      onChange={(e) =>
                        setInsertFormData({
                          ...insertFormData,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Image URL</span>
                    <span className="label-text-alt text-base-content/50">
                      Optional
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full focus:input-primary"
                    value={insertFormData.image}
                    onChange={(e) =>
                      setInsertFormData({
                        ...insertFormData,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-action">
                  <button type="submit" className="btn btn-primary gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Create Property
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowInsertForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setShowInsertForm(false)}
            ></div>
          </div>
        )}

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-secondary flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Update Property
                </h3>
                <button
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowUpdateForm(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={updateListing} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Property Title
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter property title..."
                    className="input input-bordered w-full focus:input-secondary"
                    value={updateFormData.title}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Price (USD)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-base-content/50">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="250000"
                      className="input input-bordered w-full pl-8 focus:input-secondary"
                      value={updateFormData.price}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Image URL</span>
                    <span className="label-text-alt text-base-content/50">
                      Optional
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full focus:input-secondary"
                    value={updateFormData.image}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        image: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="modal-action">
                  <button type="submit" className="btn btn-secondary gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Update Property
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setShowUpdateForm(false)}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
