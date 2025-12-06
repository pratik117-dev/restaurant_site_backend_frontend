import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../api';
import { addItem } from '../slices/cartSlice';
import type{ AppDispatch, RootState } from '../store';
import MenuItemDetail from '../components/MenuItemDetail';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category: string;
  available_sizes: string[];
  size_prices: { [key: string]: number };
}

const Home = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const searchQuery = useSelector((state: RootState) => state.search.query);

  useEffect(() => {
    api.get('/menu/').then((res) => {
      setMenu(res.data);
      setFilteredMenu(res.data);
      setLoading(false);
    });
  }, []);
  
  // Fetch delivery status
  useEffect(() => {
    fetchDeliveryStatus();
    const interval = setInterval(fetchDeliveryStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeliveryStatus = async () => {
    try {
      const res = await api.get('/admin/delivery-status/');
      setDeliveryAvailable(res.data.available);
    } catch (err) {
      console.error('Failed to load delivery status');
    }
  };

  useEffect(() => {
    let filtered = menu;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredMenu(filtered);
  }, [selectedCategory, searchQuery, menu]);

  const handleItemClick = (item: MenuItem) => {
    // Allow viewing item details even when delivery is unavailable
    setSelectedItem(item);
  };

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    
    // Check if delivery is available
    if (!deliveryAvailable) {
      toast.error('Sorry, orders are currently unavailable!');
      return;
    }
    
    if (!token) {
      toast.error('Please login to add to cart!');
      return;
    }
    
    dispatch(addItem({ 
      id: item.id, 
      name: item.name, 
      price: item.price, 
      quantity: 1, 
      image: item.image_url,
      selectedSize: 'BASE', 
      selectedCategory: item.category 
    }));
    toast.success('Added to cart!');
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">


      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full shadow-lg">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            "We deliver the food you actually want — not the cold, late, disappointing stuff you're tired of. Whether you're in Urlabari, Manglabare, Durgapuri, Sombare, or Damak, we bring top-quality meals from trusted local kitchens right to your doorstep. No excuses, no delays — just reliable delivery and real flavor."
          </p>
          <b className="text-sm sm:text-base">For consult contact: Keshav Nepal [9816337600]</b>
          
          {/* Inline Delivery Warning for Desktop/Large Screens */}
          {!loading && !deliveryAvailable && (
            <div className="mt-6 max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6 text-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Orders Currently Unavailable</h3>
              <p className="text-sm sm:text-base text-red-600 mb-1">We're not accepting orders right now.</p>
              <p className="text-sm text-red-500">Browse our menu and add items when we're back online! 🍽️</p>
            </div>
          )}
        </div>
        
        {/* Category Filter Buttons - Always Enabled */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span>All</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('CHICKEN')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedCategory === 'CHICKEN'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>🍗</span>
                <span>Chicken</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('VEG')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedCategory === 'VEG'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>🥗</span>
                <span>Veg</span>
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('DRINKS')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                selectedCategory === 'DRINKS'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>🍾</span>
                <span>Drinks</span>
              </span>
            </button>
          </div>
        </div>
        
        {/* Menu Items Grid */}
        {filteredMenu.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-block bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No items found</h2>
            <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMenu.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group border border-orange-100 hover:scale-105"
                onClick={() => handleItemClick(item)}
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-orange-600 shadow-lg">
                    {item.category === 'CHICKEN' ? '🍗 Chicken' : item.category === 'VEG' ? '🥗 Veg': '🍾 Drinks'}
                  </div>
                  
                  {/* Unavailable Overlay - Lighter, doesn't block viewing */}
                  {!deliveryAvailable && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Order Unavailable
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
                    {item.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{item.description}</p>
                  
                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-green-600">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xl sm:text-2xl font-bold">RS.{item.price}</span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={!deliveryAvailable}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 flex items-center space-x-1 ${
                        deliveryAvailable
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-xl hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>{deliveryAvailable ? 'Add' : 'N/A'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Can still view details */}
      {selectedItem && (
        <MenuItemDetail 
          item={selectedItem} 
          onClose={handleCloseModal} 
          onAddToCart={(customizedItem) => {
            // Check delivery status before adding to cart
            if (!deliveryAvailable) {
              toast.error('Sorry, orders are currently unavailable!');
              // Don't close modal, let user continue browsing
              return;
            }
            
            if (!token) {
              toast.error('Please login to add to cart!');
              return;
            }
            
            dispatch(addItem(customizedItem));
            toast.success('Added to cart!');
            handleCloseModal();
          }} 
        />
      )}
    </div>
  );
};

export default Home;