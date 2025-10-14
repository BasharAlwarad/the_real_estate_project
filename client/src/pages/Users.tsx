import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

// Types
interface User {
  _id: string;
  userName: string;
  email: string;
  image?: string;
  createdAt?: string;
}

interface FormData {
  userName: string;
  email: string;
  password: string;
  image: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showInsertForm, setShowInsertForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [insertFormData, setInsertFormData] = useState<FormData>({
    userName: '',
    email: '',
    password: '',
    image: '',
  });

  const [updateFormData, setUpdateFormData] = useState<
    Omit<FormData, 'password'>
  >({
    userName: '',
    email: '',
    image: '',
  });

  // Fetch users
  const fetchUsers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError('');
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create user
  const createUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post('/users', insertFormData);

      setInsertFormData({ userName: '', email: '', password: '', image: '' });
      setShowInsertForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  // Update user
  const updateUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser?._id}`, updateFormData);

      setShowUpdateForm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  // Delete user
  const deleteUser = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  // Open update form
  const openUpdateForm = (user: User): void => {
    setSelectedUser(user);
    setUpdateFormData({
      userName: user.userName,
      email: user.email,
      image: user.image || '',
    });
    setShowUpdateForm(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="hero bg-gradient-to-r from-secondary/10 via-secondary/5 to-accent/10 rounded-3xl mb-12 shadow-lg">
          <div className="hero-content text-center py-16">
            <div className="max-w-2xl">
              <div className="mb-6">
                <div className="badge badge-secondary badge-lg mb-4">
                  👥 User Management
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-6">
                Our Community
              </h1>
              <p className="text-xl text-base-content/80 leading-relaxed mb-8">
                Meet our vibrant community of real estate enthusiasts, buyers,
                sellers, and professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  className="btn btn-secondary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Add New User
                </button>
                <button
                  className="btn btn-outline btn-lg gap-2 hover:shadow-lg transition-all duration-300"
                  onClick={fetchUsers}
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
                  Refresh Users
                </button>
              </div>
              <div className="mt-8">
                <div className="stats stats-horizontal shadow-lg bg-base-100/50 backdrop-blur-sm">
                  <div className="stat">
                    <div className="stat-figure text-secondary">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="stat-title">Community Members</div>
                    <div className="stat-value text-secondary">
                      {users.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-8">
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
            <button className="btn btn-sm" onClick={() => setError('')}>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Users Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-base-content mb-2">
                Community Members
              </h2>
              <p className="text-base-content/70">
                Connect with our amazing community of real estate professionals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-secondary badge-lg gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {users.length} {users.length === 1 ? 'Member' : 'Members'}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-4 text-base-content/70">
                Loading community members...
              </p>
            </div>
          ) : users.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-base-content/70 mb-4">
                No Users Found
              </h3>
              <p className="text-base-content/50 mb-6">
                Start building your community by adding the first member
              </p>
              <button
                className="btn btn-secondary gap-2"
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Add First Member
              </button>
            </div>
          ) : (
            /* Users Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-base-300/20"
                >
                  {/* User Avatar */}
                  <figure className="relative overflow-hidden bg-gradient-to-br from-secondary/10 to-accent/10 h-64 flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.userName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <div className="badge badge-secondary badge-sm">
                        Member
                      </div>
                    </div>
                  </figure>

                  <div className="card-body p-6">
                    <h3 className="card-title text-xl text-center justify-center mb-2">
                      {user.userName}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
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
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        <span className="truncate">{user.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-base-content/70">
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
                            d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h2z"
                          />
                        </svg>
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                    <div className="card-actions justify-between mt-6">
                      <Link
                        to={`/user/${user._id}`}
                        className="btn btn-secondary btn-sm gap-2 flex-1 mr-2"
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
                        Read More
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
                              onClick={() => openUpdateForm(user)}
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
                              onClick={() => deleteUser(user._id)}
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Add New User
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

              <form onSubmit={createUser} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username..."
                    className="input input-bordered w-full focus:input-secondary"
                    value={insertFormData.userName}
                    onChange={(e) =>
                      setInsertFormData({
                        ...insertFormData,
                        userName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    className="input input-bordered w-full focus:input-secondary"
                    value={insertFormData.email}
                    onChange={(e) =>
                      setInsertFormData({
                        ...insertFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password..."
                    className="input input-bordered w-full focus:input-secondary"
                    value={insertFormData.password}
                    onChange={(e) =>
                      setInsertFormData({
                        ...insertFormData,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Profile Image URL
                    </span>
                    <span className="label-text-alt text-base-content/50">
                      Optional
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full focus:input-secondary"
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
                    Create User
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
                <h3 className="font-bold text-2xl text-accent flex items-center gap-2">
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
                  Update User
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

              <form onSubmit={updateUser} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username..."
                    className="input input-bordered w-full focus:input-accent"
                    value={updateFormData.userName}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        userName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    className="input input-bordered w-full focus:input-accent"
                    value={updateFormData.email}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Profile Image URL
                    </span>
                    <span className="label-text-alt text-base-content/50">
                      Optional
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full focus:input-accent"
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
                  <button type="submit" className="btn btn-accent gap-2">
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
                    Update User
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

export default Users;
