import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

interface Order {
  id: number;
  user: { email: string };
  user_name: string;
  items: { id: number; name: string; image_url: string; quantity: number; price: number }[];
  status: string;
  total_price: string;
  created_at: string;
  phone?: string;
  location?: string;
  delivery_charge: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'VEG', image: null as File | null });

  // toggle switch 
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/admin/orders/?t=${Date.now()}`);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu/');
      setMenu(res.data);
    } catch (err) {
      toast.error('Failed to load menu');
    }
  };

  // toggle switch 
  const fetchDeliveryStatus = async () => {
  try {
    const res = await api.get('/admin/delivery-status/');
    setDeliveryAvailable(res.data.available);
  } catch (err) {
    console.error('Failed to load delivery status');
  }
};

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    fetchDeliveryStatus(); 
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    try {
      await api.patch(`/admin/orders/${id}/`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}!`);
    } catch (err) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: 'PENDING' } : order
        )
      );
      toast.error('Failed to update status');
      fetchOrders();
    }
  };

  const removeOrder = async (id: number) => {
    if (!confirm('Are you sure you want to remove this order?')) return;
    try {
      await api.delete(`/admin/orders/${id}/delete/`);
      toast.success('Order removed!');
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (err) {
      toast.error('Failed to remove order');
    }
  };

  const downloadOrders = async () => {
    try {
      const response = await api.get('/admin/orders/download/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Orders downloaded!');
    } catch (err) {
      toast.error('Failed to download orders');
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('category', newItem.category);
    if (newItem.image) formData.append('image', newItem.image);

    try {
      await api.post('/admin/menu/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Menu item added!');
      setNewItem({ name: '', description: '', price: '', category: 'VEG', image: null });
      setShowMenuForm(false);
      fetchMenu();
    } catch (err) {
      toast.error('Failed to add menu item');
    }
  };

  const handleEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('category', newItem.category);
    if (newItem.image) formData.append('image', newItem.image);
    try {
      await api.put(`/admin/menu/${editingItem.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Menu item updated!');
      setNewItem({ name: '', description: '', price: '', category: 'VEG', image: null });
      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      toast.error('Failed to update menu item');
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({ name: item.name, description: item.description, price: item.price.toString(), category: item.category, image: null });
  };

  const removeMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to remove this menu item?')) return;
    try {
      await api.delete(`/admin/menu/${id}/delete/`);
      toast.success('Menu item removed!');
      setMenu((prevMenu) => prevMenu.filter((item) => item.id !== id));
    } catch (err) {
      toast.error('Failed to remove menu item');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': 
        return { 
          color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          icon: '⏳',
          dotColor: 'bg-yellow-500'
        };
      case 'ACCEPTED': 
        return { 
          color: 'bg-green-100 text-green-700 border-green-300',
          icon: '✓',
          dotColor: 'bg-green-500'
        };
      case 'CANCELLED': 
        return { 
          color: 'bg-red-100 text-red-700 border-red-300',
          icon: '✗',
          dotColor: 'bg-red-500'
        };
      case 'DELIVERYOUT': 
        return { 
          color: 'bg-blue-100 text-blue-700 border-blue-300',
          icon: '🚚',
          dotColor: 'bg-blue-500'
        };
      case 'DELIVERED': 
        return { 
          color: 'bg-green-100 text-green-700 border-green-300',
          icon: '📦',
          dotColor: 'bg-green-500'
        };
      case 'PAID': 
        return { 
          color: 'bg-green-100 text-green-700 border-green-300',
          icon: '💰',
          dotColor: 'bg-green-500'
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          icon: '○',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const toggleDelivery = async () => {
  const newStatus = !deliveryAvailable;
  setDeliveryAvailable(newStatus);
  
  try {
    await api.patch('/admin/delivery-status/', { available: newStatus });
    toast.success(`Delivery ${newStatus ? 'enabled' : 'disabled'}!`);
  } catch (err) {
    setDeliveryAvailable(!newStatus);
    toast.error('Failed to update delivery status');
  }
};

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl font-semibold text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-12 px-4">

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block mb-4 text-6xl">👨‍💼</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your orders efficiently</p>
        </header>
          {/* delivery toggle switch  */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delivery Status</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-semibold ${deliveryAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {deliveryAvailable ? '✓ Available' : '✗ Unavailable'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {deliveryAvailable ? 'Customers can order' : 'Orders disabled'}
                </p>
              </div>
              
              <button
                onClick={toggleDelivery}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  deliveryAvailable ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    deliveryAvailable ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className={`mt-4 px-3 py-2 rounded-lg text-xs font-medium ${
              deliveryAvailable 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {deliveryAvailable 
                ? '🚀 Delivery service is active' 
                : '⏸️ Delivery service is paused'}
            </div>
          </div>
        </div>

        {/* Order Management Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Orders</span>
            </h2>
            
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button 
                onClick={fetchOrders} 
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                onClick={downloadOrders} 
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download CSV</span>
              </button>
              <button 
                onClick={() => setShowMenuForm(true)} 
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Menu Item</span>
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              
              return (
                <article key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Customer</p>
                            <p className="text-sm text-gray-800 font-semibold">{order.user_name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm text-gray-800 font-semibold">{order.phone || 'Not provided'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Location</p>
                            <p className="text-sm text-gray-800 font-semibold">{order.location || 'Not provided'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Total</p>
                            <p className="text-xl font-bold text-green-600">RS.{order.total_price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                        <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>Order Items:</span>
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover rounded" />
                              <span className="text-sm text-gray-800 font-semibold">{item.name} x {item.quantity} (RS.{item.price})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="lg:border-l lg:border-gray-200 lg:pl-6 space-y-3 lg:w-64">
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-2 block">Order Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${statusConfig.color} font-semibold focus:ring-2 focus:ring-orange-500 transition-all`}
                        >
                          <option value="PENDING">⏳ Pending</option>
                          <option value="ACCEPTED">✅ Accepted</option>
                          <option value="CANCELLED">❌ Cancelled</option>
                          <option value="DELIVERYOUT">🚚 Out For delivery</option>
                          <option value="DELIVERED">📦 Delivered Successfully</option>
                          <option value="PAID">💰 Paid</option>
                        </select>
                      </div>

                      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 ${statusConfig.color}`}>
                        <div className={`w-3 h-3 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
                        <span className="text-sm font-bold">{statusConfig.icon} {order.status}</span>
                      </div>

                      <button
                        onClick={() => removeOrder(order.id)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Remove Order</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-orange-100">
              <div className="inline-block bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full mb-6">
                <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
              <p className="text-gray-500">Orders will appear here when customers place them</p>
            </div>
          )}
        </section>

        {/* Menu Management Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Menu Items</span>
            </h2>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Menu Items Yet</h3>
                <p className="text-gray-500">Start by adding your first menu item</p>
              </div>
            ) : (
              menu.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.category === 'VEG' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-orange-100 text-orange-800 border border-orange-300'
                      }`}>
                        {item.category === 'VEG' ? '🥗 Vegetarian' : item.category=== 'CHICKEN'?'🍗 Chicken': '🍾 Drinks' }
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        RS.{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(item)} 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => removeMenuItem(item.id)} 
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Add/Edit Item Modal */}
      {(showMenuForm || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-orange-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingItem ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                  </svg>
                </div>
                <span>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</span>
              </h3>
              <button 
                onClick={() => { setShowMenuForm(false); setEditingItem(null); }} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={editingItem ? handleEditMenuItem : handleAddMenuItem} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Masala Chai" 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (RS.)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="4.99" 
                      value={newItem.price} 
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} 
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
                      required 
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    placeholder="Describe your delicious item..." 
                    value={newItem.description} 
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none" 
                    rows={4}
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select 
                    value={newItem.category} 
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none bg-white"
                  >
                    <option value="CHICKEN">🍗 Chicken</option>
                    <option value="VEG">🥗 Vegetarian</option>
                    <option value="DRINKS">🍾 Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.files?.[0] || null })} 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-orange-50 file:to-red-50 file:text-orange-700 file:font-semibold hover:file:bg-orange-100" 
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{editingItem ? 'Update Item' : 'Add Item to Menu'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => { setShowMenuForm(false); setEditingItem(null); }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;