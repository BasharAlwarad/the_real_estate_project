import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Types
interface HouseListing {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

interface FormData {
  title: string;
  price: string;
  imageUrl: string;
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
    imageUrl: '',
  });

  const [updateFormData, setUpdateFormData] = useState<FormData>({
    title: '',
    price: '',
    imageUrl: '',
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

    setInsertFormData({ title: '', price: '', imageUrl: '' });
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
      imageUrl: listing.imageUrl || '',
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
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto p-8">
        {/* Hero Section */}
        <div className="hero bg-base-200 rounded-lg mb-8">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-primary">
                Real Estate CRUD
              </h1>
              <p className="py-6 text-base-content">
                Simple CRUD operations for real estate listings.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowInsertForm(true)}
                >
                  Add New Listing
                </button>
                <button className="btn btn-outline" onClick={fetchListings}>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-base-content">
              Property Listings
            </h2>
            <div className="badge badge-outline badge-lg">
              {listings.length}{' '}
              {listings.length === 1 ? 'Property' : 'Properties'}
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="card bg-base-100 shadow-xl">
                {listing.imageUrl && (
                  <figure className="listing-image-small">
                    <img
                      width={200}
                      height={200}
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-full h-8 object-cover rounded-t-lg"
                    />
                  </figure>
                )}

                <div className="card-body">
                  <Link
                    to={`/listing/${listing._id}`}
                    className="card-title text-primary hover:text-primary-focus cursor-pointer"
                  >
                    {listing.title}
                    <div className="badge badge-secondary">
                      {formatPrice(listing.price)}
                    </div>
                  </Link>

                  <div className="card-actions justify-between mt-4">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openUpdateForm(listing)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => deleteListing(listing._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insert Form Modal */}
        {showInsertForm && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Add New Property</h3>
              <form onSubmit={createListing} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered w-full"
                  value={insertFormData.title}
                  onChange={(e) =>
                    setInsertFormData({
                      ...insertFormData,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="input input-bordered w-full"
                  value={insertFormData.price}
                  onChange={(e) =>
                    setInsertFormData({
                      ...insertFormData,
                      price: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  className="input input-bordered w-full"
                  value={insertFormData.imageUrl}
                  onChange={(e) =>
                    setInsertFormData({
                      ...insertFormData,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowInsertForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Update Property</h3>
              <form onSubmit={updateListing} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered w-full"
                  value={updateFormData.title}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="input input-bordered w-full"
                  value={updateFormData.price}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      price: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  className="input input-bordered w-full"
                  value={updateFormData.imageUrl}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
