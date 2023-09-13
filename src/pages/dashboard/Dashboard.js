import { useCollection } from '../../hooks/useCollection'

import './Dashboard.css'

export default function Dashboard() {
  const { documents, error } = useCollection('projects')
  return (
    <div>
        <h2 className="page-title">Dashboard</h2>
        {error && <div className="error">{error}</div>}
        {documents && documents.map(project => (
          <p key={project.id}>{project.name}</p>
        ))}

    </div>
  )
}
