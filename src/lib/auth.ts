'use client'

import axios from 'axios'

export async function checkAuth(): Promise<boolean> {
  try {
    const response = await axios.get('/api/auth/check', {
      withCredentials: true,
    })
    
    return response.data.authenticated
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    await axios.post('/api/auth/logout', {}, {
      withCredentials: true,
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
} 