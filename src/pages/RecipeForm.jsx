import React, { useState } from 'react'
import { Client, Databases, Storage } from 'appwrite'

function RecipeForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([{ nom: '', quantité: '', unité: '' }])
  const [coverImage, setCoverImage] = useState(null)
  const [error, setError] = useState(null)

  const client = new Client()
  client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

  const databases = new Databases(client)
  const storage = new Storage(client)

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { nom: '', quantité: '', unité: '' }])
  }

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients)
  }

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageId = null
    if (coverImage) {
      try {
        const imageUpload = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          'unique()',
          coverImage
        );
        imageId = imageUpload.$id
      } catch (uploadError) {
        setError('Erreur lors du téléchargement de l\'image de couverture')
        console.error('Erreur de téléchargement :', uploadError)
        return
      }
    }

    const ingredientsArray = ingredients.flatMap(ingredient => 
      [`Nom : ${ingredient.nom}`, `Quantité : ${ingredient.quantité}`, `Unité : ${ingredient.unité}`]
    )

    const payload = {
      title,
      description,
      ingredients: ingredientsArray,
      cover: imageId,
    }

    console.log("Données envoyées :", payload);

    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        'unique()',
        payload
      )

      alert('Recette ajoutée avec succès !')
      window.location.href = '/dashboard'

      setTitle('');
      setDescription('')
      setIngredients([{ nom: '', quantité: '', unité: '' }])
      setCoverImage(null)
      setError(null)
    } catch (dbError) {
      setError('Erreur lors de la création du document')
      console.error("Erreur de création de document :", dbError)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-white rounded shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Créer une Recette</h2>
        
        {error && (
          <div className="mb-4 text-red-600">{error}</div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Image de couverture</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Ingrédients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Nom"
                value={ingredient.nom}
                onChange={(e) => handleIngredientChange(index, 'nom', e.target.value)}
                className="w-1/3 px-4 py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Quantité"
                value={ingredient.quantité}
                onChange={(e) => handleIngredientChange(index, 'quantité', e.target.value)}
                className="w-1/3 px-4 py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Unité"
                value={ingredient.unité}
                onChange={(e) => handleIngredientChange(index, 'unité', e.target.value)}
                className="w-1/3 px-4 py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="ml-2 px-2 py-1 text-white bg-red-600 border border-red-600 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="px-4 py-2 mt-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
          >
            Ajouter un ingrédient
          </button>
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Créer la recette
        </button>
      </form>
    </div>
  )
}

export default RecipeForm
