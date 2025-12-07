import { useState } from 'react';

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

interface CustomizedItem extends MenuItem {
  selectedSize: string;
  selectedCategory: string;
  quantity: number;
  totalPrice: number;
}

interface MenuItemDetailProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (customizedItem: CustomizedItem) => void;
}

const MenuItemDetail = ({ item, onClose, onAddToCart }: MenuItemDetailProps) => {
  const availableSizes = item.available_sizes && item.available_sizes.length > 0 ? item.available_sizes : ['MEDIUM'];
  const [selectedSize] = useState(availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  
  // Convert to numbers to handle API returning strings
  const basePrice = Number(item.price) || 0;
  const sizePrice = Number((item.size_prices && item.size_prices[selectedSize]) || 0);
  const totalPrice = (basePrice + sizePrice) * quantity;
  
  const handleAddToCart = () => {
  const customizedItem: CustomizedItem = {
    ...item,
    selectedSize,
    selectedCategory: item.category,
    quantity,
    totalPrice,
  };
  onAddToCart(customizedItem);
};

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-3xl border-b-2 border-orange-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center space-x-2">
            <span className="text-3xl">☕</span>
            <span>Item Details</span>
          </h2>
          <button 
            onClick={onClose}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-100 to-red-100">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-bold text-orange-600 flex items-center space-x-1">
                <span>{item.category === 'VEG' ? '🥗' : item.category === 'CHICKEN' ? '🍗': '🍾'}</span>
                <span>{item.category}</span>
              </span>
            </div>
          </div>
          
          {/* Item Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {item.name}
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
          </div>
          
          {/* Base Price */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 border-2 border-orange-200 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-bold text-lg">Base Price</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-600">RS.{basePrice.toFixed(0)}</span>
              </div>
            </div>
          </div>
          
          {/* Category Display */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Category</span>
            </label>
            <div className="bg-gradient-to-r from-orange-100 to-red-100 px-5 py-4 border-2 border-orange-200 rounded-xl shadow-sm">
              <p className="text-lg font-bold text-orange-700 flex items-center space-x-2">
                <span>{item.category === 'VEG' ? '🥗' : item.category === 'CHICKEN' ? '🍗': '🍾'}</span>
                <span>{item.category}</span>
              </p>
            </div>
          </div>
          
          {/* Size Selection */}
          {/* {availableSizes.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 4 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span>Size</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {availableSizes.map((size) => (
                  <label 
                    key={size}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                      selectedSize === size 
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-md scale-[1.02]' 
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSize === size 
                          ? 'border-orange-500 bg-orange-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedSize === size && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={selectedSize === size}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="hidden"
                      />
                      <span className={`font-bold text-lg ${selectedSize === size ? 'text-orange-600' : 'text-gray-700'}`}>
                        {size}
                      </span>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      selectedSize === size 
                        ? 'bg-orange-200 text-orange-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      +${(Number((item.size_prices && item.size_prices[size]) || 0)).toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )} */}
          
          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>Quantity</span>
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={decrementQuantity}
                className="bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 text-orange-700 w-14 h-14 rounded-xl font-bold text-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                −
              </button>
              <div className="flex-1 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl py-4 px-6 text-center shadow-sm">
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} 
                  className="w-full bg-transparent text-center font-bold text-2xl text-gray-800 focus:outline-none" 
                  min="1"
                />
              </div>
              <button
                onClick={incrementQuantity}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-14 h-14 rounded-xl font-bold text-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border-2 border-gray-200 shadow-md">
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Base Price</span>
              <span className="font-bold">${basePrice.toFixed(0)}</span>
            </div>
            {/* <div className="flex justify-between text-gray-600">
              <span className="font-medium">Size Extra ({selectedSize})</span>
              <span className="font-bold">${sizePrice.toFixed(2)}</span>
            </div> */}
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Quantity</span>
              <span className="font-bold">× {quantity}</span>
            </div>
            <div className="border-t-2 border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total Price</span>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl md:text-4xl font-bold text-green-600">RS.{totalPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart} 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg group"
          >
            <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Add to Cart</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-base font-bold">RS.{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;