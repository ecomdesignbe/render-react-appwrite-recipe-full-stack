import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Client, Account } from 'appwrite';
import { useUser } from '../contexts/AuthContext'; // Importation du contexte

function Navbar() {
  const { user, setUser } = useUser(); // Utilisation du contexte pour accéder à l'utilisateur et à la fonction de mise à jour
  const navigate = useNavigate();

  useEffect(() => {
    const client = new Client()
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

    const account = new Account(client);

    account.get()
      .then(setUser)
      .catch(() => setUser(null));
  }, [setUser]); // Dépendance sur setUser pour éviter de recréer la fonction

  const handleLogout = async () => {
    const client = new Client()
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

    const account = new Account(client);

    await account.deleteSession('current');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-red-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-yellow-300 hover:text-yellow-400">
          Recipe App
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-lg font-medium hover:text-yellow-300">Accueil</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-lg font-medium hover:text-yellow-300">Dashboard</Link>
              <Link to="/create-recipe" className="text-lg font-medium hover:text-yellow-300">Créer une Recette</Link>
              <span className="text-lg font-semibold">Bonjour, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-medium hover:text-yellow-300">Connexion</Link>
              <Link to="/register" className="text-lg font-medium hover:text-yellow-300">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
