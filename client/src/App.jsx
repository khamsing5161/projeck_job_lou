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
import Payment from './pages/payment';

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Header จะอยู่ทุกหน้า */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/condom" element={<ProtectedRoute><LayoutCondom /></ProtectedRoute>} />
        <Route path="/lubricating_gel" element={<ProtectedRoute><Layoutlubricating_gel /></ProtectedRoute>} />
        <Route path="/strength_medicine" element={<ProtectedRoute><Layoutstrength_medicine /></ProtectedRoute>} />
        <Route path="/thrilling_equipment" element={<ProtectedRoute><LayoutThrilling_equipment /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><Productid /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment/></ProtectedRoute>} />

      </Routes>
      <BottomNav /> {/* BottomNav จะอยู่ทุกหน้า */}
    </BrowserRouter>
  )
}

export default App
