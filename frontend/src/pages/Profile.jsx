import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { assets } from '../assets/assets';
import { api } from '../config/api';
import logger from '../utils/logger';

const Profile = () => {
  const { user, updateProfile, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    
    setResendingEmail(true);
    setResendMessage('');
    
    try {
      const result = await api.auth.resendVerification();
      if (result.success) {
        setResendMessage(language === 'fr' ? '✅ Email envoyé! Vérifiez votre boîte de réception.' : '✅ Email sent! Check your inbox.');
        setResendCooldown(60);
      }
    } catch (error) {
      setResendMessage(error.message || (language === 'fr' ? '❌ Échec de l\'envoi de l\'email' : '❌ Failed to send email'));
    } finally {
      setResendingEmail(false);
    }
  };

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
      logger.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Loading...</h2>
        </div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={(e) => { if (e && e.currentTarget && e.currentTarget.style) { e.currentTarget.style.display = 'none'; } }}
          className="w-full h-full object-cover opacity-30"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
          tabIndex={-1}
          aria-hidden="true"
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={assets.hero.loginbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="relative z-20 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
              {language === 'fr' ? 'Mon Profil' : 'My Profile'}
            </h1>
            <p className="text-gray-400">
              {language === 'fr' ? 'Gérez vos informations personnelles' : 'Manage your personal information'}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
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
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400">{user.email}</p>
                    {user.isVerified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {language === 'fr' ? 'Vérifié' : 'Verified'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {language === 'fr' ? 'Non vérifié' : 'Not Verified'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-cyan-400 capitalize">{user.role || 'customer'}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer"
                >
                  {isEditing ? (language === 'fr' ? 'Annuler' : 'Cancel') : (language === 'fr' ? 'Modifier' : 'Edit')}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
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
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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

            {/* Email Verification Section */}
            {!user.isVerified && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-yellow-400 font-semibold mb-1">
                      {language === 'fr' ? 'Email non vérifié' : 'Email Not Verified'}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      {language === 'fr' 
                        ? 'Veuillez vérifier votre email pour activer toutes les fonctionnalités de votre compte.' 
                        : 'Please verify your email to activate all account features.'}
                    </p>
                    {resendMessage && (
                      <p className="text-sm mb-3 font-medium">{resendMessage}</p>
                    )}
                    <button
                      onClick={handleResendVerification}
                      disabled={resendingEmail || resendCooldown > 0}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed text-sm flex items-center gap-2"
                    >
                      {resendingEmail ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          {language === 'fr' ? 'Envoi...' : 'Sending...'}
                        </>
                      ) : resendCooldown > 0 ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          {language === 'fr' ? `Réessayer dans ${resendCooldown}s` : `Retry in ${resendCooldown}s`}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                          </svg>
                          {language === 'fr' ? 'Renvoyer l\'email de vérification' : 'Resend Verification Email'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
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

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default Profile;
