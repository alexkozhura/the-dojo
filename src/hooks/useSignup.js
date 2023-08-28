import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext() 

    const signup = async (email, password, displayName) => {
        setError(null)
        setIsLoading(true)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            

            if (!res) {
                throw new Error('Could not complete signup')
            }

            // add display name to user 
            await updateProfile(res.user, { displayName })

            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user })

            // update state
            if (!isCancelled) {
                setIsLoading(false)
                setError(null)
            }
        }
        catch (err) {
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

    return { error, isLoading, signup } 
}