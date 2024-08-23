import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Client, Account } from 'appwrite'

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const client = new Client()
  client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

  const account = new Account(client)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get()
        setUser(userData)
      } catch {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await account.deleteSession('current')
    setUser(null);
    navigate('/login')
  };

  return (
    <nav className="bg-red-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-yellow-300 hover:text-yellow-400 transition-colors">
          Recipe App
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-lg font-medium hover:text-yellow-300 transition-colors">Accueil</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-lg font-medium hover:text-yellow-300 transition-colors">Dashboard</Link>
              <Link to="/create-recipe" className="text-lg font-medium hover:text-yellow-300 transition-colors">Créer une Recette</Link>
              <span className="text-lg font-semibold">Bonjour, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium hover:text-yellow-300 transition-colors">Connexion</Link>
              <Link to="/register" className="text-lg font-medium hover:text-yellow-300 transition-colors">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
