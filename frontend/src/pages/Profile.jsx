import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
              {language === 'fr' ? 'Mon Profil' : 'My Profile'}
            </h1>
            <p className="text-gray-400">
              {language === 'fr' ? 'Gérez vos informations personnelles' : 'Manage your personal information'}
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-sm text-cyan-400 capitalize">{user.role || 'customer'}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                >
                  {isEditing ? (language === 'fr' ? 'Annuler' : 'Cancel') : (language === 'fr' ? 'Modifier' : 'Edit')}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  {language === 'fr' ? 'Déconnexion' : 'Logout'}
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      {language === 'fr' ? 'Prénom' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      {language === 'fr' ? 'Nom' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    {language === 'fr' ? 'Téléphone' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    {language === 'fr' ? 'Adresse' : 'Address'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder={language === 'fr' ? 'Rue' : 'Street'}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder={language === 'fr' ? 'Ville' : 'City'}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder={language === 'fr' ? 'État/Province' : 'State/Province'}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        placeholder={language === 'fr' ? 'Code postal' : 'Zip Code'}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (language === 'fr' ? 'Mise à jour...' : 'Updating...') : (language === 'fr' ? 'Sauvegarder' : 'Save Changes')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-cyan-300 mb-1">
                      {language === 'fr' ? 'Prénom' : 'First Name'}
                    </h3>
                    <p className="text-gray-300">{user.firstName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-cyan-300 mb-1">
                      {language === 'fr' ? 'Nom' : 'Last Name'}
                    </h3>
                    <p className="text-gray-300">{user.lastName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-cyan-300 mb-1">Email</h3>
                    <p className="text-gray-300">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-cyan-300 mb-1">
                      {language === 'fr' ? 'Téléphone' : 'Phone'}
                    </h3>
                    <p className="text-gray-300">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                {user.address && (
                  <div>
                    <h3 className="text-sm font-medium text-cyan-300 mb-2">
                      {language === 'fr' ? 'Adresse' : 'Address'}
                    </h3>
                    <div className="text-gray-300">
                      <p>{user.address.street}</p>
                      <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                      <p>{user.address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'fr' ? 'Informations du compte' : 'Account Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-cyan-400 font-medium">
                  {language === 'fr' ? 'Type de compte' : 'Account Type'}
                </h4>
                <p className="text-lg capitalize">{user.role || 'customer'}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-cyan-400 font-medium">
                  {language === 'fr' ? 'Membre depuis' : 'Member Since'}
                </h4>
                <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-cyan-400 font-medium">
                  {language === 'fr' ? 'Statut' : 'Status'}
                </h4>
                <p className="text-lg text-green-400">
                  {language === 'fr' ? 'Actif' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
