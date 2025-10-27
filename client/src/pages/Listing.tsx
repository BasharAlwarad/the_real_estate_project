import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Owner {
  _id: string;
  userName: string;
  email: string;
  image?: string;
}

interface HouseListing {
  _id: string;
  title: string;
  price: number;
  image?: string;
  owner: Owner | string; // Can be populated object or just ID
}

const Listing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<HouseListing | null>(null);

  const deleteListing = async () => {
    await api.delete(`/listings/${listing?._id}`);
    navigate('/');
  };

  useEffect(() => {
    if (id) {
      api
        .get(`/listings/${id}`)
        .then((response) => setListing(response.data.data));
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!listing) return <div>Loading...</div>;

  // Check if owner is populated (object) or just an ID (string)
  const owner = typeof listing.owner === 'object' ? listing.owner : null;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto p-8">
        <div className="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <Link to="/" className="link link-hover">
                Home
              </Link>
            </li>
            <li>
              <span>Property Details</span>
            </li>
          </ul>
        </div>

        <div className="card bg-base-100 shadow-xl">
          {listing.image && (
            <figure>
              <img
                width={200}
                height={200}
                src={listing.image}
                alt={listing.title}
                className="w-full h-96 object-cover rounded-t-lg"
              />
            </figure>
          )}

          <div className="card-body">
            <h1 className="card-title text-3xl text-primary">
              {listing.title}
            </h1>
            <div className="badge badge-secondary badge-lg">
              {formatPrice(listing.price)}
            </div>

            {/* Owner Information Section */}
            {owner && <div className="divider"></div>}

            {owner && (
              <div className="bg-base-200 rounded-lg p-6 mt-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Property Owner
                </h2>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={owner.image} alt={owner.userName} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{owner.userName}</h3>
                    <p className="text-base-content/70 flex items-center gap-2">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {owner.email}
                    </p>
                  </div>
                  <Link
                    to={`/user/${owner._id}`}
                    className="btn btn-primary btn-sm gap-2"
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
                    View Profile
                  </Link>
                </div>
              </div>
            )}

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-error" onClick={deleteListing}>
                Delete
              </button>
              <Link to="/listings" className="btn btn-outline">
                Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
