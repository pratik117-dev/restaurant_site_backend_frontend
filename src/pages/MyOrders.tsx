import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

interface Order {
  id: number;
  items: { id: number; name: string; image: string; image_url: string; quantity: number; price: number }[];
  status: string;
  total_price: string;
  created_at: string;
  delivery_charge: number;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/');
      setOrders(res.data);
      toast.success('Orders refreshed!');
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Separate orders into current and history
  const currentOrders = orders.filter(order => order.status !== 'PAID');
  const historyOrders = orders.filter(order => order.status === 'PAID');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ACCEPTED': return 'text-green-600 bg-green-50 border-green-200';
      case 'DELIVERYOUT': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
      case 'PAID': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ACCEPTED':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'DELIVERYOUT':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'PAID':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'DELIVERYOUT': return 'Out for Delivery';
      case 'CANCELLED': return 'Cancelled';
      case 'PAID': return 'Completed';
      default: return status;
    }
  };


  const renderCompactOrderCard = (order: Order) => {
    const subtotal = parseFloat(order.total_price) - order.delivery_charge;
    const total = parseFloat(order.total_price);

    return (
      <div
        key={order.id}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
      >
        <div className="flex items-center h-24 px-4 gap-4">
          {/* Order ID & Status */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-xs text-gray-500 font-medium">Order</span>
            <span className="text-lg font-bold text-gray-800">#{order.id}</span>
            <div className={`mt-1 px-2 py-0.5 rounded-full ${getStatusColor(order.status)} text-white text-xs font-semibold`}>
              {getStatusText(order.status)}
            </div>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-gray-200"></div>

          {/* Items Preview */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100'; }}
                  />
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {item.name} x{item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-gray-200"></div>

          {/* Price Details */}
          <div className="min-w-[140px] flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">RS.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Delivery:</span>
              <span className="font-semibold text-blue-600">RS.{order.delivery_charge.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200 my-0.5"></div>
            <div className="flex justify-between">
              <span className="text-sm font-bold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-green-600">RS.{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-gray-200"></div>

          {/* Date */}
          <div className="min-w-[100px] text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs font-semibold text-gray-700 mt-1">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(order.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderCard = (order: Order, index: number, isHistory = false) => {
    const subtotal = parseFloat(order.total_price) - order.delivery_charge;
    const total = parseFloat(order.total_price);

    return (
      <div
        key={order.id + '-' + index}
        className={`bg-white ${isHistory ? 'rounded-lg shadow-md' : 'rounded-2xl shadow-lg hover:shadow-2xl'} transition-all duration-300 overflow-hidden border border-orange-100`}
      >
        {/* Order Header */}
        <div className={`bg-gradient-to-r from-orange-500 to-red-600 ${isHistory ? 'px-4 py-2' : 'px-6 py-4'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`bg-white/20 backdrop-blur-sm ${isHistory ? 'p-1.5' : 'p-2'} rounded-lg`}>
                <svg className={`${isHistory ? 'w-4 h-4' : 'w-5 h-5'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className={`text-white/80 ${isHistory ? 'text-xs' : 'text-sm'}`}>Order ID</p>
                <p className={`text-white ${isHistory ? 'text-base' : 'text-xl'} font-bold`}>#{order.id}</p>
              </div>
            </div>
            <div className={`${isHistory ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} rounded-xl border-2 font-semibold flex items-center gap-2 w-fit ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span>{getStatusText(order.status)}</span>
            </div>
          </div>
        </div>

        {/* Order Content */}
        <div className={isHistory ? 'p-4' : 'p-6'}>
          {/* Items Section */}
          <div className={isHistory ? 'mb-3' : 'mb-6'}>
            <h3 className={`${isHistory ? 'text-sm' : 'text-lg'} font-bold text-gray-800 ${isHistory ? 'mb-2' : 'mb-4'} flex items-center gap-2`}>
              <div className={`w-1 ${isHistory ? 'h-4' : 'h-6'} bg-gradient-to-b from-orange-500 to-red-600 rounded-full`}></div>
              Order Items ({order.items.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 bg-gradient-to-br from-orange-50 to-red-50 ${isHistory ? 'px-2 py-1.5 text-xs' : 'px-4 py-3'} rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300 group`}
                >
                  <div className={`${isHistory ? 'w-8 h-8' : 'w-12 h-12'} flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm border-2 border-orange-200 group-hover:border-orange-400 transition-colors`}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                    />
                  </div>
                  <span className={`${isHistory ? 'text-xs' : ''} font-semibold text-gray-800 group-hover:text-orange-600 transition-colors`}>
                    {item.name} x {item.quantity} (${item.price})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className={`border-t-2 border-orange-100 ${isHistory ? 'pt-3' : 'pt-6'}`}>
            <div className={`${isHistory ? 'space-y-2 mb-2' : 'space-y-3 mb-4'}`}>
              {/* Subtotal */}
              <div className={`flex items-center justify-between text-gray-700 ${isHistory ? 'text-xs' : ''}`}>
                <span className="font-medium">Subtotal:</span>
                <div className="flex items-center gap-1">
                  <svg className={`${isHistory ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className={`${isHistory ? 'text-base' : 'text-xl'} font-bold text-gray-700`}>RS.{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Charge */}
              <div className={`flex items-center justify-between text-gray-700 ${isHistory ? 'text-xs' : ''}`}>
                <div className="flex items-center gap-2">
                  <svg className={`${isHistory ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span className="font-medium">Delivery Charge:</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className={`${isHistory ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className={`${isHistory ? 'text-base' : 'text-xl'} font-bold text-blue-600`}>RS.{order.delivery_charge.toFixed(2)}</span>
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t-2 border-dashed border-orange-200 ${isHistory ? 'my-1' : ''}`}></div>

              {/* Total */}
              <div className={`flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 ${isHistory ? 'px-3 py-2 text-xs' : 'px-4 py-3'} rounded-xl border-2 border-green-200`}>
                <span className={`${isHistory ? 'text-sm' : 'text-lg'} font-bold text-gray-800`}>Total Amount:</span>
                <div className="flex items-center gap-1">
                  <svg className={`${isHistory ? 'w-4 h-4' : 'w-6 h-6'} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className={`${isHistory ? 'text-xl' : 'text-3xl'} font-bold text-green-600`}>RS.{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className={`${isHistory ? 'mt-2' : 'mt-4'} bg-gradient-to-br from-orange-50 to-red-50 ${isHistory ? 'px-3 py-2 text-xs' : 'px-4 py-3'} rounded-xl border border-orange-200 flex items-center justify-between`}>
              <div className="flex items-center gap-2 text-gray-700">
                <svg className={`${isHistory ? 'w-4 h-4' : 'w-5 h-5'} text-orange-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Order Date:</span>
              </div>
              <span className={`${isHistory ? 'text-xs' : ''} font-bold text-orange-600`}>
                {new Date(order.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-orange-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-gray-500 mt-1">Track and manage all your delicious orders</p>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Orders'}
            </button>
          </div>
        </div>

        {/* No Orders State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 md:p-16 text-center border border-orange-100">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Your order history will appear here once you make a purchase</p>
            <a 
              href="/" 
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <>
            {/* Current Orders Section */}
            {currentOrders.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Active Orders ({currentOrders.length})
                  </h2>
                </div>
                <div className="space-y-6">
                  {currentOrders.map((order, index) => renderOrderCard(order, index, false))}
                </div>
              </div>
            )}

             {/* Order History */}
        {historyOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
              Order History ({historyOrders.length})
            </h2>
            <div className="space-y-3">
              {historyOrders.map((order) => renderCompactOrderCard(order))}
            </div>
          </div>
        )}

        {orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;