import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import type{ RootState } from '../store';

const Checkout = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !location) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate phone number is exactly 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/orders/${orderId}/checkout/`, { phone: phoneDigits, location });
      toast.success('Order details updated!');
      navigate('/my-orders');
    } catch (err) {
      toast.error('Failed to update order details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full shadow-lg mb-3 sm:mb-4">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Checkout</h1>
          <p className="text-sm sm:text-base text-gray-600">Complete your order details for delivery</p>
        </div>

        {/* Checkout Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 border border-orange-100">
          {/* Progress Indicator - Mobile Optimized */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-max px-2">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Cart</span>
              </div>

              {/* Connector 1 */}
              <div className="w-8 sm:w-16 h-1 bg-orange-500"></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                  2
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold text-orange-600 whitespace-nowrap">Checkout</span>
              </div>

              {/* Connector 2 */}
              <div className="w-8 sm:w-16 h-1 bg-gray-300"></div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm sm:text-base">
                  3
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold text-gray-400 whitespace-nowrap">Complete</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field (Read-only) */}
            <div>
              <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  placeholder="Enter 10-digit phone number"
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-300"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Location
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your complete delivery address..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-300 resize-none"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base sm:text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Complete Order</span>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-start space-x-2 sm:space-x-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1">Secure Checkout</h4>
              <p className="text-xs text-gray-600">Your information is safe and will only be used for delivery purposes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;