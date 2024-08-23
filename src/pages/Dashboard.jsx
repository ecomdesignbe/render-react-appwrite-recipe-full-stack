import React, { useEffect, useState } from 'react'
import { Client, Databases, Storage } from 'appwrite'

function Dashboard() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const client = new Client()
    client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
          .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

    const databases = new Databases(client)
    const storage = new Storage(client)

    const fetchRecipes = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COLLECTION_ID
        )

        const recipesWithImageUrls = await Promise.all(response.documents.map(async (recipe) => {
          let imageUrl = '';
          if (recipe.cover) {
            try {
              const file = await storage.getFilePreview(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                recipe.cover
              );
              imageUrl = file.href
            } catch (error) {
              imageUrl = ''
            }
          }

          let ingredients = recipe.ingredients.map(item => {
            const [name, quantity, unit] = item.split('-').map(part => part.trim());
            return { name, quantity, unit }
          })

          return {
            ...recipe,
            imageURL: imageUrl,
            ingredients: ingredients
          }
        }))

        setRecipes(recipesWithImageUrls);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération des recettes.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="mb-8 text-4xl font-extrabold text-gray-900">Votre tableau de bord</h1>
        <p>Chargement des recettes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="mb-8 text-4xl font-extrabold text-gray-900">Votre tableau de bord</h1>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="mb-8 text-4xl font-extrabold text-gray-900">Votre tableau de bord</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <div key={recipe.$id} className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
            {recipe.imageURL && (
              <img 
                src={recipe.imageURL} 
                alt={recipe.title} 
                className="w-full h-48 object-cover" 
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{recipe.title}</h2>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingrédients</h3>
                  <ul className="list-none text-gray-700 flex flex-wrap gap-x-6 gap-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2 border-b border-gray-200 py-1">
                        <span className="font-medium text-gray-800">{ingredient.name}</span>
                        <span className="text-gray-500">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
