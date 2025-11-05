import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../api';
import { removeItem, clearCart } from '../slices/cartSlice';
import type{ RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';


const Cart = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 50.00;
  const total = subtotal + deliveryCharge;
  
  const handleRemove = (id: number) => {
    dispatch(removeItem(id));
    toast.success('Removed from cart!');
  };
  
  const handleOrder = async () => {
    try {
      const res = await api.post('/orders/', { 
        items_ids: items.map((i) => i.id),
        items_data: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
        total_price: total.toFixed(2)
      });
      dispatch(clearCart());
      toast.success('Order placed! Proceed to checkout.');
      navigate(`/checkout/${res.data.id}`);
    } catch (err) {
      toast.error('Failed to place order');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full shadow-lg">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Your Cart
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Review your items before placing order</p>
        </div>
        
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-orange-100">
            <div className="inline-block bg-gradient-to-r from-orange-100 to-red-100 p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Start adding some delicious items to your cart!</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-3 sm:p-5 border border-orange-100 group"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-grow min-w-0">
                      <h2 className="text-sm sm:text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 truncate">
                        {item.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                        <div className="flex items-center space-x-1 text-green-600">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold text-base sm:text-lg">${item.price}</span>
                        </div>
                        <span className="text-gray-400 hidden sm:inline">×</span>
                        <div className="bg-orange-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                          <span className="text-orange-600 font-semibold text-xs sm:text-sm">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Subtotal: <span className="font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex-shrink-0 bg-red-50 hover:bg-red-100 text-red-600 p-2 sm:p-3 rounded-lg transition-all duration-300 hover:shadow-md"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Summary
                </h2>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-orange-600">${deliveryCharge.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 sm:pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-gray-800">Total</span>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">${total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group text-sm sm:text-base"
                >
                  <span>Place Order</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;