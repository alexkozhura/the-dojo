import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase/config"

export const useDocument = (collection, id) => {
    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)

    console.log('Component rendered')

    // real-time data for the document
    useEffect(() => {
        console.log('useEffect triggered')
        const ref = doc(db, collection, id)
        const unsubscribe = onSnapshot(ref, (doc) => {
            console.log('New snapshot recieved')
            if (doc.data()) {
                setDocument({ ...doc.data(), id: doc.id })
                setError(null)
            }
            else {
                setError('Document does not exist')
            }
        }, (error) => {
            console.log(error.message)
            setError('Could not fetch the data')
        })

        return () => unsubscribe()
    }, [collection, id])

    return { document, error }
}