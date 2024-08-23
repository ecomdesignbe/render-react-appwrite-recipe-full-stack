import React from 'react'
import { Navigate } from 'react-router-dom'
import { Client, Account } from 'appwrite'

function PrivateRoute({ children }) {
  const client = new Client()
  client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

  const account = new Account(client)

  const [isLoggedIn, setIsLoggedIn] = React.useState(null)

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        await account.get()
        setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }

    checkUser()
  }, [])

  if (isLoggedIn === null) {
    return <div>Chargement...</div>
  }

  return isLoggedIn ? children : <Navigate to="/login" />
}

export default PrivateRoute
