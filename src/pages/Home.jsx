import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-bg text-primary-text">
      <div className="text-center p-6 bg-white shadow-xl rounded-lg max-w-md mx-4">
        <h1 className="text-5xl font-serif font-extrabold text-primary-accent mb-4 !text-primary-accent">
          Bienvenue sur Recipe App
        </h1>
        <div className="flex flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
              Connexion
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
