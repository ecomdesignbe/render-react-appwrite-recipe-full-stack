import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import { useUser } from '../contexts/AuthContext'; // Import du contexte utilisateur

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // Utilisation du contexte pour accéder à setUser

  const client = new Client();
  client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const account = new Account(client);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get(); // Récupère les informations utilisateur
      setUser(userData); // Met à jour l'état utilisateur
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      account.createOAuth2Session('google', `${window.location.origin}`, `${window.location.origin}/login`);
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white rounded shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Connexion</h2>
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
          Se connecter
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700"
        >
          Se connecter avec Google
        </button>
      </form>
    </div>
  );
}

export default Login;
