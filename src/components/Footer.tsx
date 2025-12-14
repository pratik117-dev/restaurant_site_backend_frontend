import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-900 via-orange-800 to-red-900 text-white p-8 mt-8 border-t-4 border-orange-500/30 shadow-2xl">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Brand Section */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-4xl">☕</span>
              <h3 className="text-2xl font-bold text-orange-100">Chiya Hub</h3>
            </div>
            <p className="text-orange-200/80 text-sm">Brewing happiness, one cup at a time</p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex justify-center space-x-6 mb-4 md:mb-0">
            <Link 
              to="/" 
              className="hover:text-orange-200 transition-all duration-300 font-medium flex items-center space-x-1 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="group-hover:underline decoration-2 underline-offset-4">Home</span>
            </Link>
            
            <Link 
              to="/contact" 
              className="hover:text-orange-200 transition-all duration-300 font-medium flex items-center space-x-1 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="group-hover:underline decoration-2 underline-offset-4">Contact</span>
            </Link>
            
            <Link 
              to="/about" 
              className="hover:text-orange-200 transition-all duration-300 font-medium flex items-center space-x-1 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="group-hover:underline decoration-2 underline-offset-4">About</span>
            </Link>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex space-x-3">
            <a 
              href="https://www.facebook.com/share/1Fk1PqCLps/" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
              aria-label="Facebook" target='blank'
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <a 
              href="https://www.instagram.com/chiya.hub.urlabari?igsh=MWJuc2d6ZzdwNTRicQ==" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
              aria-label="Instagram" target='blank'
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            <a 
              href="#" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-orange-500/30 my-4"></div>
        
        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-orange-200/80 text-sm font-medium flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" clipRule="evenodd" />
            </svg>
            <span>&copy; 2025 Chiya Hub. All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;