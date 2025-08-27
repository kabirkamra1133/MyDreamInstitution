import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: JSX.Element
  // optional list of roles allowed to access the route (e.g. ['admin','college','student'])
  allowedRoles?: string[]
  // optional redirect path when not authenticated
  redirectTo?: string
}

const Protected: React.FC<Props> = ({ children, allowedRoles, redirectTo = '/student-login' }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null

  // not authenticated -> send to login
  if (!token) return <Navigate to={redirectTo} replace />

  // if allowedRoles provided, check role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // role not allowed -> send to home
    return <Navigate to="/" replace />
  }

  return children
}

export default Protected