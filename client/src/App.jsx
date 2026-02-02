import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Menu from './pages/Menu'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Track from './pages/Track'
import Review from './pages/Review'
import LayoutCondom from './layout/LayoutCondom';
import Layoutlubricating_gel from './layout/Layoutlubricating_gel';
import Layoutstrength_medicine from './layout/Layoutstrength_medicine';
import LayoutThrilling_equipment from './layout/LayoutThrilling_equipment';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Header /> {/* Header จะอยู่ทุกหน้า */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/condom" element={<LayoutCondom />} />
        <Route path="/Layoutlubricating_gel" element={<Layoutlubricating_gel />} />
        <Route path="/Layoutstrength_medicine" element={<Layoutstrength_medicine />} />
        <Route path="/LayoutThrilling_equipment" element={<LayoutThrilling_equipment />} />
        
      </Routes>
      <BottomNav /> {/* BottomNav จะอยู่ทุกหน้า */}
    </BrowserRouter>

    </>
  )
}

export default App
