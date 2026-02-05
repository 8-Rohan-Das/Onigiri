import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import context providers
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Import pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import Homepage from './pages/home/homepage';
import CategoryPage from './pages/shop/CategoryPage';
import FavoritePage from './pages/shop/FavoritePage';
import MessagesPage from './pages/user/MessagesPage';
import OrderHistoryPage from './pages/order/OrderHistoryPage';
import OthersPage from './pages/user/OthersPage';
import NotificationPage from './pages/notification/NotificationPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderConfirmationPage from './pages/order/OrderConfirmationPage';



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
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          </Routes>
        </CartProvider>
      </NotificationProvider>
    </BrowserRouter>
  );

}



export default App;

