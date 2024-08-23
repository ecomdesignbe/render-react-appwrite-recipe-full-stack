import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client, Account } from 'appwrite'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const client = new Client()
  client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

  const account = new Account(client)

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await account.create('unique()', email, password, name)
      await account.createEmailPasswordSession(email, password)
      navigate('/dashboard')
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Inscription</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 bg-white rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 bg-white rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 bg-white rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  )
}

export default Register
