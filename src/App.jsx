import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import context providers
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Import pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import Homepage from './pages/homepage';
import CategoryPage from './pages/CategoryPage';
import FavoritePage from './pages/FavoritePage';
import MessagesPage from './pages/MessagesPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OthersPage from './pages/OthersPage';



function App() {

  return (
    <BrowserRouter>
      <NotificationProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/favorite" element={<FavoritePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/order-history" element={<OrderHistoryPage />} />
            <Route path="/others" element={<OthersPage />} />
          </Routes>
        </CartProvider>
      </NotificationProvider>
    </BrowserRouter>
  );

}



export default App;

