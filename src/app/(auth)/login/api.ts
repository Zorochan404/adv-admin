import axios from 'axios'
import Cookies from 'js-cookie'

interface LoginRequest {
  number: string
  password: string
}

interface User {
  id: number
  name: string | null
  avatar: string | null
  age: number | null
  number: number
  email: string | null
  aadharNumber: string | null
  aadharimg: string | null
  dlNumber: string | null
  dlimg: string | null
  passportNumber: string | null
  passportimg: string | null
  lat: number | null
  lng: number | null
  locality: string | null
  city: string | null
  state: string | null
  country: string | null
  pincode: string | null
  role: string
  isverified: boolean
  parkingid: number | null
  createdAt: string
  updatedAt: string
}

interface LoginResponse {
  statusCode: number
  data: {
    user: User
    accessToken: string
  }
  message: string
  success: boolean
}

export default async function LoginAdmin(number: string, password: string): Promise<Response> {
  try {
    const externalUrl = process.env.NEXT_PUBLIC_base_url
    console.log('External URL:', externalUrl)
    const response = await axios.post(`${externalUrl}/auth/loginAdmin`, {
      number,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data: LoginResponse = response.data

    if (data.success && data.statusCode === 200) {
      // Store the access token in cookies using js-cookie
      Cookies.set('accessToken', data.data.accessToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })

      return new Response(JSON.stringify({
        success: true,
        message: data.message,
        user: data.data.user,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: data.message || 'Login failed',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'An error occurred during login',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export function getAccessToken(): string | undefined {
  return Cookies.get('accessToken')
}

export function deleteAccessToken(): void {
  Cookies.remove('accessToken')
}

export function updateAccessToken(token: string): void {
  Cookies.set('accessToken', token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
} 