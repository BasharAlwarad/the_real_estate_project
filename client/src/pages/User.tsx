import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';

// Types
interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
}

const User = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Image handling states
  const [imageOption, setImageOption] = useState<'default' | 'url' | 'upload'>(
    'default'
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError('');
        const { data } = await api.get(`/users/${id}`);
        setUser(data.data);
        // Initialize form data with current user data
        setFormData({
          userName: data.data.userName,
          email: data.data.email,
          image: data.data.image || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Handle opening edit modal
  const handleEditClick = () => {
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email,
        image: user.image || '',
      });
      setFormErrors({});

      // Initialize image states based on current user image
      if (user.image) {
        setImageOption('url');
        setImageUrl(user.image);
      } else {
        setImageOption('default');
      }
      setImageFile(null);
      setImagePreview('');

      setIsEditModalOpen(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle image option change
  const handleImageOptionChange = (option: 'default' | 'url' | 'upload') => {
    setImageOption(option);
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle image upload click
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle URL input change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setFormData((prev) => ({ ...prev, image: url }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.userName.trim()) {
      errors.userName = 'Username is required';
    } else if (formData.userName.trim().length < 2) {
      errors.userName = 'Username must be at least 2 characters';
    } else if (formData.userName.trim().length > 50) {
      errors.userName = 'Username cannot exceed 50 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!validateForm() || !user) return;

    try {
      setIsUpdating(true);

      let response;

      if (imageOption === 'upload' && imageFile) {
        // Use FormData for file upload
        const formDataPayload = new FormData();
        formDataPayload.append('userName', formData.userName);
        formDataPayload.append('email', formData.email);
        formDataPayload.append('image', imageFile);

        response = await api.put(`/users/${user._id}`, formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Use JSON for URL or default image
        const payload = {
          userName: formData.userName,
          email: formData.email,
          image:
            imageOption === 'default'
              ? ''
              : imageOption === 'url'
              ? imageUrl
              : '',
        };

        response = await api.put(`/users/${user._id}`, payload);
      }

      setUser(response.data.data || response.data.user);
      setIsEditModalOpen(false);
      setError('');

      // Reset image states
      setImageFile(null);
      setImagePreview('');
      setImageUrl('');
      setImageOption('default');
    } catch (error) {
      console.error('Error updating user:', error);
      if (axios.isAxiosError(error) && error.response?.data?.details) {
        setError(error.response.data.details);
      } else {
        setError('Failed to update user. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      await api.delete(`/users/${user._id}`);
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
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
            <span>{error || 'User not found'}</span>
          </div>
          <Link to="/users" className="btn btn-primary mt-4">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm mb-8">
          <ul>
            <li>
              <Link to="/" className="link link-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
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
                Home
              </Link>
            </li>
            <li>
              <Link to="/users" className="link link-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Users
              </Link>
            </li>
            <li className="text-base-content/70">{user.userName}</li>
          </ul>
        </div>

        {/* User Profile Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300/20">
          <div className="card-body p-0">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-accent/10 p-8 rounded-t-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.userName}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-4xl font-bold">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl font-bold text-base-content mb-2">
                    {user.userName}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <div className="badge badge-secondary badge-lg">
                      Community Member
                    </div>
                    <div className="badge badge-outline">Active User</div>
                  </div>
                  <p className="text-base-content/70 text-lg">
                    Welcome to {user.userName}'s profile page. Connect and
                    explore their real estate journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-base-content">Email</p>
                        <p className="text-base-content/70">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-secondary"
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
                      <div>
                        <p className="font-semibold text-base-content">
                          Username
                        </p>
                        <p className="text-base-content/70">@{user.userName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Account Details
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h2z"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-base-content">
                          Member Since
                        </p>
                        <p className="text-base-content/70">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-base-content">
                          Account Status
                        </p>
                        <p className="text-success font-medium">Active</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-base-content">
                          User ID
                        </p>
                        <p className="text-base-content/70 font-mono text-sm">
                          {user._id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-base-300">
                <Link to="/users" className="btn btn-outline gap-2">
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Users
                </Link>

                <button
                  className="btn btn-info gap-2"
                  onClick={handleEditClick}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit User
                </button>

                <button
                  className="btn btn-error gap-2"
                  onClick={() => setIsDeleteModalOpen(true)}
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete User
                </button>

                <button
                  className="btn btn-secondary gap-2"
                  onClick={() =>
                    (window.location.href = `mailto:${user.email}`)
                  }
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Email
                </button>

                <Link to="/listings" className="btn btn-primary gap-2">
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
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                  View Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <dialog
        className={`modal ${isEditModalOpen ? 'modal-open' : ''}`}
        open={isEditModalOpen}
      >
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Edit User Information</h3>

          {error && (
            <div className="alert alert-error mb-4">
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
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Username Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={`input input-bordered ${
                  formErrors.userName ? 'input-error' : ''
                }`}
                placeholder="Enter username"
              />
              {formErrors.userName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.userName}
                  </span>
                </label>
              )}
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input input-bordered ${
                  formErrors.email ? 'input-error' : ''
                }`}
                placeholder="Enter email"
              />
              {formErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.email}
                  </span>
                </label>
              )}
            </div>

            {/* Image URL Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Image</span>
              </label>

              {/* Image Option Selector */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className={`btn btn-sm ${
                    imageOption === 'default' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => handleImageOptionChange('default')}
                >
                  Default
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    imageOption === 'url' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => handleImageOptionChange('url')}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    imageOption === 'upload' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => handleImageOptionChange('upload')}
                >
                  Upload File
                </button>
              </div>

              {/* Conditional Image Input */}
              {imageOption === 'url' && (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  className="input input-bordered"
                  placeholder="Enter image URL"
                />
              )}

              {imageOption === 'upload' && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleImageUploadClick}
                    className="btn btn-secondary btn-block"
                  >
                    Choose Image File
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreview && (
                    <div className="flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="w-32 h-32 object-cover rounded-full border-4 border-primary"
                      />
                    </div>
                  )}
                </div>
              )}

              {imageOption === 'default' && (
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
                    Default avatar will be used (first letter of username)
                  </span>
                </div>
              )}

              <label className="label">
                <span className="label-text-alt">
                  Choose how you want to set your profile image
                </span>
              </label>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdateUser}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsEditModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog
        className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}
        open={isDeleteModalOpen}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete the user{' '}
            <span className="font-semibold text-error">"{user?.userName}"</span>
            ? This action cannot be undone.
          </p>

          {error && (
            <div className="alert alert-error mb-4">
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
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default User;
