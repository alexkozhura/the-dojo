import { useState, useEffect } from 'react'
import { auth, storage, db } from '../firebase/config'
import { setDoc, doc } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext() 

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null)
        setIsLoading(true)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)        

            if (!res) {
                throw new Error('Could not complete signup')
            }

            // upload user thumbnail
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`

            const storageRef = ref(storage, uploadPath)
            await uploadBytesResumable(storageRef, thumbnail)
            const imgURL = await getDownloadURL(storageRef)

            // add display name to user 
            await updateProfile(res.user, { displayName, photoURL: imgURL })

            // create a user document
            await setDoc(doc(db, 'users', res.user.uid), {
                online: true,
                displayName: displayName,
                photoURL: imgURL
            })

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
        finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { error, isLoading, signup } 
}