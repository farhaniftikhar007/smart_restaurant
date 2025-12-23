import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  Bars3Icon as MenuIcon,
  UserIcon,
  XMarkIcon,
  CalendarIcon,
  StarIcon,
  PhoneIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const NAVY = 'bg-[#1a2233]';
const GOLD = 'text-[#FFD700]';
const GOLD_BG = 'bg-[#FFD700]';
const NAVY_TEXT = 'text-[#1a2233]';
const NAVY_BORDER = 'border-[#1a2233]';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Base navigation items for all users
  const baseNavItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Menu', path: '/menu', icon: MenuIcon },
    { name: 'Reservations', path: '/reservation', icon: CalendarIcon },
    { name: 'Reviews', path: '/reviews', icon: StarIcon },
    { name: 'Contact', path: '/contact', icon: PhoneIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
  ];

  // Add My Orders for logged-in users only
  const navItems = user 
    ? [
        ...baseNavItems.slice(0, 2),
        { name: 'My Orders', path: '/my-orders', icon: UserIcon },
        ...baseNavItems.slice(2)
      ]
    : baseNavItems;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Reservation', href: '/reservation' },
    { name: 'Reviews', href: '/reviews' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${NAVY} ${isScrolled ? 'shadow-lg' : 'shadow-none'} border-b ${NAVY_BORDER} relative z-20`}>
      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
        <div className="flex items-center h-16 w-full">
          {/* Logo and Brand (Far Left) */}
          <div className="flex-none min-w-[170px] pr-2 flex items-center justify-start">
            <Link to="/" className="flex items-center gap-2 select-none ml-0">
              <span className={`text-2xl font-serif font-extrabold tracking-tight ${GOLD} drop-shadow-lg`}>🍽️ Dastarkhwan</span>
            </Link>
          </div>
          {/* Nav Links (Center) */}
          <div className="hidden md:flex flex-1 min-w-0 justify-center items-center gap-2 lg:gap-4">
            <>
              {navItems.map((item, idx) => (
              <Link
                key={item.path}
                to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive(item.path)
                      ? `${GOLD} bg-white bg-opacity-10 shadow-md`
                      : 'text-white hover:text-[#FFD700] hover:bg-white/10'
                  }`}
                  style={{ fontFamily: 'serif' }}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.path) ? GOLD : 'text-white group-hover:text-[#FFD700]'}`} />
                  <span className={item.name === 'Home' ? 'font-bold' : ''}>{item.name}</span>
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${GOLD} bg-white bg-opacity-10 shadow-md`}
                  style={{ fontFamily: 'serif' }}
                >
                  <span className="font-bold">Admin Panel</span>
                </Link>
              )}
            </>
          </div>
          {/* User Actions (Far Right) */}
          <div className="hidden md:flex flex-none items-center gap-2 lg:gap-4">
            {user ? (
              <div className="relative group">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:${GOLD} hover:bg-white/10 font-medium transition-all`} style={{ fontFamily: 'serif' }}>
                  <UserIcon className="h-6 w-6" />
                  <span>{user.full_name}</span>
                </button>
                <div className={`absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl border ${NAVY_BORDER} hidden group-hover:block z-50`}>
                  <Link
                    to={`/dashboard/${user.role}`}
                    className={`block px-4 py-2 text-sm ${NAVY_TEXT} hover:${GOLD_BG} hover:${NAVY_TEXT}`}
                    style={{ fontFamily: 'serif' }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm ${NAVY_TEXT} hover:${GOLD_BG} hover:${NAVY_TEXT}`}
                    style={{ fontFamily: 'serif' }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${NAVY_TEXT} hover:${GOLD_BG} hover:${NAVY_TEXT}`}
                    style={{ fontFamily: 'serif' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-lg text-base font-semibold bg-white text-[#1a2233] hover:bg-gray-100 shadow-sm transition-all border border-gray-300"
                  style={{ fontFamily: 'serif' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-base font-semibold bg-[#FFD700] text-[#1a2233] hover:bg-[#e6c200] shadow-sm transition-all"
                  style={{ fontFamily: 'serif' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-[#FFD700] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-2xl border-t border-[#1a2233] rounded-b-2xl"
          >
            <div className="px-4 pt-4 pb-4 space-y-2">
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">Guest</div>
                    <div className="text-sm font-medium text-gray-500">Welcome</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? `${NAVY_TEXT} bg-[#FFD700] shadow-sm`
                        : 'text-[#1a2233] hover:text-[#FFD700] hover:bg-[#1a2233]/10'
                    }`}
                    style={{ fontFamily: 'serif' }}
                  >
                    <item.icon className={`h-5 w-5 ${isActive(item.path) ? NAVY_TEXT : 'text-[#1a2233] group-hover:text-[#FFD700]'}`} />
                    {item.name}
                  </Link>
                ))}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 text-[#1a2233] bg-[#FFD700] shadow-sm`}
                    style={{ fontFamily: 'serif' }}
                  >
                    <span className="font-bold">Admin Panel</span>
                  </Link>
                )}
              </>
              <div className="border-t border-[#1a2233] pt-2">
                {user ? (
                  <>
                    <Link
                      to={`/dashboard/${user.role}`}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 text-base ${NAVY_TEXT} hover:${GOLD_BG} hover:${NAVY_TEXT} rounded-lg`}
                      style={{ fontFamily: 'serif' }}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 text-base ${NAVY_TEXT} hover:${GOLD_BG} hover:${NAVY_TEXT} rounded-lg`}
                      style={{ fontFamily: 'serif' }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-base ${NAVY_TEXT} hover:${GOLD_BG} hover:${NAVY_TEXT} rounded-lg`}
                      style={{ fontFamily: 'serif' }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-base font-semibold bg-white text-[#1a2233] hover:bg-gray-100 rounded-lg shadow-sm border border-gray-300"
                      style={{ fontFamily: 'serif' }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-base font-semibold bg-[#FFD700] text-[#1a2233] hover:bg-[#e6c200] rounded-lg shadow-sm"
                      style={{ fontFamily: 'serif' }}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 