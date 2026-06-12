// src/api/backend.js
import axios from 'axios'

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
const BASE = `${BACKEND_URL}/api`

// Configure Axios globally to send cookies with all requests (needed for passport session)
axios.defaults.withCredentials = true

export async function checkUserSession() {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/me`)
    return response.data // { loggedIn: true, user: { googleId, displayName, email, photo } }
  } catch (err) {
    return { loggedIn: false, user: null }
  }
}

export async function logoutSession() {
  const response = await axios.get(`${BACKEND_URL}/auth/logout`)
  return response.data // { success: true, message: 'Logged out successfully' }
}

export async function analyseFiles(files) {
  // Real backend call
  const formData = new FormData()
  files.forEach(file => {
    // Preserve the relative path of the file in directory uploads
    const filePath = file.webkitRelativePath || file.name
    formData.append('files', file, filePath)
  })
  
  const response = await axios.post(`${BASE}/analyse`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function askOracle(question, context) {
  const response = await axios.post(`${BASE}/ask`, { question, context })
  return response.data
}
