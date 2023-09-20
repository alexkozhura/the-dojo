import { useReducer, useEffect, useState } from "react"
import { db } from "../firebase/config"
import { addDoc, deleteDoc, doc, serverTimestamp, collection, updateDoc } from "firebase/firestore"

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { success: false, isPending: true, error: null, document: null }
    case "ADDED_DOCUMENT":
      return { success: true, isPending: false, error: null, document: action.payload }
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null }
    case "UPDATED_DOCUMENT":
      return { isPending: false, document: action.payload, success: true, error: null }
    case "ERROR":
      return { success: false, isPending: false, error: action.payload, document: null }
    default:
      return state
  }
}

export const useFirestore = (colName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // collection ref
  const ref = collection(db, colName)

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }
  
  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" })

    try {

        const newDoc = { ...doc, createdAt: serverTimestamp() }
        const addedDocument = await addDoc(ref, newDoc)
        dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument })
    }
    catch (err) {
        dispatchIfNotCancelled({ type: "ERROR", payload: err.message })
    }

  }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })
    try {
      await deleteDoc(doc(db, colName, id))
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
    }
  }

  useEffect(() => {
    setIsCancelled(false)
    return () => { 
      setIsCancelled(true)
    }
  }, [])

  // update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const docRef = doc(db, colName, id)
      await updateDoc(docRef, updates)
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: docRef })
      return docRef
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not update' })
      return null
    }
  }

  return { addDocument, deleteDocument, updateDocument, response }

}