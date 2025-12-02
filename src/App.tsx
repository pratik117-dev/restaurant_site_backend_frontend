import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';  // Added
import Footer from './components/Footer';  // Added
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
// ... (rest of the file remains the same)

import Checkout from './pages/Checkout';  // Added
import ContactPage from './pages/Contact';
import AboutPage from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-16">
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout/:orderId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />  {/* Added */}
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

// ... (rest of the file remains the same)

export default App;