import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ProtectedRoute from './auth/ProtectedRoute' // import ที่สร้าง
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import LayoutCondom from './layout/LayoutCondom';
import Layoutlubricating_gel from './layout/Layoutlubricating_gel';
import Layoutstrength_medicine from './layout/Layoutstrength_medicine';
import LayoutThrilling_equipment from './layout/LayoutThrilling_equipment';
import Productid from './layout/Productid';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Track from './pages/Track';
import Review from './pages/Review';
import Comment_user from './pages/Comment_user';
import Welcome from './pages/Welcome';
import Men from './pages/Men';
import Ladies from './pages/Ladies';
import Sale from './pages/Sale';
import Meme from './pages/meme';
import RecommendedProducts from './components/RecommendedProducts';


function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900
                    text-gray-900 dark:text-white
                    transition-colors duration-300">
      <BrowserRouter>
        <Header /> {/* Header จะอยู่ทุกหน้า */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/RecommendedProducts" element={<ProtectedRoute><RecommendedProducts /></ProtectedRoute>} />
          <Route path="/men" element={<ProtectedRoute><Men /></ProtectedRoute>} />
          <Route path="/meme" element={<ProtectedRoute><Meme /></ProtectedRoute>} />
          <Route path="/sale" element={<ProtectedRoute><Sale /></ProtectedRoute>} />
          <Route path="/Ladies" element={<ProtectedRoute><Ladies /></ProtectedRoute>} />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/condom" element={<ProtectedRoute><LayoutCondom /></ProtectedRoute>} />
          <Route path="/lubricating_gel" element={<ProtectedRoute><Layoutlubricating_gel /></ProtectedRoute>} />
          <Route path="/strength_medicine" element={<ProtectedRoute><Layoutstrength_medicine /></ProtectedRoute>} />
          <Route path="/thrilling_equipment" element={<ProtectedRoute><LayoutThrilling_equipment /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><Productid /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/track" element={<ProtectedRoute><Track /></ProtectedRoute>} />
          <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
          <Route path="/Comment_user" element={<ProtectedRoute><Comment_user /></ProtectedRoute>} />

        </Routes>
        <BottomNav /> {/* BottomNav จะอยู่ทุกหน้า */}
      </BrowserRouter>

    </div>

  )
}

export default App
