import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface HouseListing {
  _id: string;
  title: string;
  price: number;
  image?: string;
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
                className="w-full h-8 object-cover rounded-t-lg"
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

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-error" onClick={deleteListing}>
                Delete
              </button>
              <Link to="/" className="btn btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
