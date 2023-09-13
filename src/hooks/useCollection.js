import { useEffect, useState, useRef, useMemo } from "react"
import { db } from "../firebase/config"
import { collection, onSnapshot, query, where, orderBy as firestoreOrderBy } from "firebase/firestore"

export const useCollection = (colRef, _queryProps, _orderBy) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    // if we don't use useRef, we will get an infinite loop
    const queryProps = useRef(_queryProps).current
    const orderBy = useRef(_orderBy).current

    // if we don't use useMemo, we will get an infinite loop
    let firestoreCollection = useMemo(() => {
        let col = collection(db, colRef)
        let q = col

        if (queryProps) {
            q = query(q, where(...queryProps))
        }

        if (orderBy && orderBy.length) {
            q = query(q, firestoreOrderBy(...orderBy))
        }

        return q
    }, [colRef, queryProps, orderBy])

    useEffect(() => {
        const unsub = onSnapshot(firestoreCollection, (snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            })
            // update state
            setDocuments(results)
            setError(null)
        }, (error) => {
            console.log(error.message)
            setError('could not fetch the data')
        })
        // cleanup function
        return () => unsub()
    }, [firestoreCollection, orderBy])

    return { documents, error }
}