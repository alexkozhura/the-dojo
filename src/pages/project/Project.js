import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'

import './Project.css'
import ProjectSummary from './ProjectSummary'
import ProjectComments from './ProjectComments'

export default function Project() {
  const { id } = useParams()
  const { document, error } = useDocument('projects', id)

  if (error) {
    return <div className="error">{error}</div>
  }

  // to display a loading message as long as we don't have a document
  if (!document) {
    return <div className="loading">Loading...</div>
  }
  return (
    <div className="project-details">
        <ProjectSummary project={document} />
        <ProjectComments project={document} />
    </div>
  )
}
