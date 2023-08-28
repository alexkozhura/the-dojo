import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsLoading(true)

        // sign out the user 
        try {
            await auth.signOut()

            // dispatch the logout action
            dispatch({ type: 'LOGOUT' })

            // update state
            if (!isCancelled) {
                setIsLoading(false)
                setError(null)
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsLoading(false)
            }
        }
    }
    useEffect(() => {
        return () => setIsCancelled(false)
    }, [])
    
    return { logout, error, isLoading }
}