import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RecipeForm from './pages/RecipeForm'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import { UserProvider } from './contexts/AuthContext';

function App() {
  return (
    <UserProvider>
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create-recipe" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
      </Routes>
    </div>
    </UserProvider>
  )
}

export default App
