import { useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { useFirestore } from '../../hooks/useFirestore'
import Select from 'react-select'
import { Timestamp } from 'firebase/firestore'

import './Create.css'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
]

export default function Create() {
  const { addDocument, response } = useFirestore('projects')
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    if(documents) {
      console.log('Reading the documents collection')
      const options = documents.map(user => {
        return { value: user, label: user.displayName }
      })
      setUsers(options)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!category) {
      setFormError('Please select a category')
      return
    }
    if (!assignedUsers.length) {
      setFormError('Please assign the project to at least one user')
      return
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const assignedUsersList = assignedUsers.map(user => {
      return {
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id
      }
    })

    const project = { 
      name, 
      details, 
      dueDate: Timestamp.fromDate(new Date(dueDate)), 
      category: category.value, 
      comments: [],
      createdBy,
      assignedUsersList 
    }

    await addDocument(project)
    if (!response.error) {
      navigate('/')
    }
    
    

  }

  return (
    <div className="create-form">
        <h2 className="page-title">Create a new project</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Project name:</span>
            <input 
              type="text"
              required
              onChange = {(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label>
            <span>Project details:</span>
            <textarea 
              type="text"
              required
              onChange = {(e) => setDetails(e.target.value)}
              value={details}
            />
          </label>
          <label>
            <span>Set due date:</span>
            <input 
              type="date"
              required
              onChange = {(e) => setDueDate(e.target.value)}
              value={dueDate}
            />
          </label>
          <label>
            <span>Project category:</span>
            <Select
              onChange = {(option) => setCategory(option)} 
              options={categories}
            />
          </label>
          <label>
            <span>Assign to:</span>
            <Select
              onChange={(option) => setAssignedUsers(option)}
              options={users}
              isMulti
            />
          </label>
          <button className="btn">Add Project</button>
          {formError && <p className="error">{formError}</p>}
        </form>
    </div>
  )
}