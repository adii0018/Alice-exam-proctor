import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import FullPageLoader from '../loaders/FullPageLoader'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <FullPageLoader />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
