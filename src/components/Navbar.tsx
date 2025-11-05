import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../slices/authSlice';
import { setSearchQuery } from '../slices/searchSlice';
import type { RootState, AppDispatch } from '../store';
import api from '../api';

const Navbar = () => {
  const { token, user: reduxUser } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const user = reduxUser || JSON.parse(localStorage.getItem('user') || 'null');
  const [pendingCount, setPendingCount] = useState(0);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Fetch pending order count for admins
  useEffect(() => {
    if (token && user?.is_admin) {
      const fetchPendingCount = async () => {
        try {
          const res = await api.get('/admin/orders/');
          const pendingOrders = res.data.filter((order: any) => order.status === 'PENDING');
          setPendingCount(pendingOrders.length);
        } catch (err) {
          console.error('Failed to fetch pending count:', err);
        }
      };
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
    setShowProfile(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 backdrop-blur-sm border-b border-orange-300/20 shadow-2xl fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-2 group flex-shrink-0"
            >
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-lg">
                <span className="text-2xl md:text-4xl">☕</span>
              </div>
              <span className="text-xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-orange-100 transition-colors duration-300">
                Chiya Adda
              </span>
            </Link>

            {/* Search Bar - Desktop & Tablet */}
            <div className="hidden md:flex flex-1 mx-4 lg:mx-8 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full px-4 py-2.5 pl-10 rounded-full text-gray-800 bg-white/95 backdrop-blur-md shadow-lg border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {token ? (
                <>
                  {/* Profile Button */}
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5 text-orange-100 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-white hidden xl:inline">
                      {user?.name || 'User'}
                    </span>
                  </button>

                  {/* Cart Link */}
                  <Link
                    to="/cart"
                    className="relative flex items-center space-x-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg border border-white/20 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="hidden xl:inline">Cart ({cartCount})</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-orange-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* My Orders Link */}
                  <Link
                    to="/my-orders"
                    className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg border border-white/20 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="hidden xl:inline">My Orders</span>
                  </Link>

                  {/* Admin Dashboard - Only for admins */}
                  {user?.is_admin && (
                    <Link
                      to="/admin"
                      className="relative flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-300 text-orange-900 px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-yellow-500"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden xl:inline">Admin Dashboard</span>
                      {pendingCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse border-2 border-white">
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Login Link */}
                  <Link
                    to="/login"
                    className="text-white hover:text-orange-100 font-medium px-4 py-2 transition-colors duration-300 hover:bg-white/10 rounded-full"
                  >
                    Login
                  </Link>

                  {/* Register Button */}
                  <Link
                    to="/register"
                    className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile User Name, Cart Icon, Login Button and Hamburger */}
            <div className="flex lg:hidden items-center space-x-3">
              {token ? (
                <>
                  {/* Profile Icon - Mobile Only */}
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center bg-white/10 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Cart Icon */}
                  <Link 
                    to="/cart" 
                    className="relative"
                    onClick={closeMobileMenu}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-orange-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  {/* Login Button - Mobile Only */}
                  <Link
                    to="/login"
                    className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-full font-semibold text-sm shadow-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                </>
              )}

              {/* Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Below Main Navbar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full px-4 py-2 pl-10 rounded-full text-gray-800 bg-white/95 backdrop-blur-md shadow-lg border-2 border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-300 text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4">
              {token ? (
                <>
                  {/* Profile Button - Mobile Menu */}
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg border border-white/20 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>Profile</span>
                    </span>
                    <span className="text-sm text-orange-100">{user?.name || 'User'}</span>
                  </button>

                  <Link 
                    to="/cart" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg border border-white/20 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Cart</span>
                    </span>
                    <span className="bg-yellow-400 text-orange-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  </Link>

                  <Link 
                    to="/my-orders" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg border border-white/20 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>My Orders</span>
                  </Link>

                  {user?.is_admin && (
                    <Link 
                      to="/admin" 
                      onClick={closeMobileMenu}
                      className="relative flex items-center space-x-2 bg-yellow-500 text-orange-900 px-4 py-3 rounded-lg font-bold shadow-lg border-2 border-yellow-600 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span>Admin Dashboard</span>
                      {pendingCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse border-2 border-white">
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg border-2 border-red-400 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="block text-center text-white bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={closeMobileMenu}
                    className="block text-center bg-white text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-lg font-semibold shadow-lg border-2 border-white transition-all duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-2xl relative">
              <button 
                onClick={() => setShowProfile(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-3 border-4 border-white/30">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">User Profile</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-800">{user?.name || 'Not provided'}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-800 break-all">{user?.email || 'Not provided'}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <div className="flex items-center space-x-2">
                  {user?.is_admin ? (
                    <>
                      <span className="bg-yellow-400 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">Admin</span>
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">User</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button 
                onClick={() => setShowProfile(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;