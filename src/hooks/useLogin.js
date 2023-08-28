import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsLoading(true)

        // sign in the user 
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)

            // dispatch the logout action
            dispatch({ type: 'LOGIN', payload: res.user })

            // update state
            setIsLoading(false)
            setError(null)
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
        return () => setIsCancelled(true)
    }, [])

    return { login, error, isLoading }
}