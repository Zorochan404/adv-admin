import axios from 'axios'
import Cookies from 'js-cookie'

interface Car {
  id: number
  name: string
  maker: string
  year: number
  carnumber: string
  price: number
  discountedprice: number
  color: string
  transmission: string
  fuel: string
  type: string
  seats: number
  rcnumber: string
  rcimg: string
  pollutionimg: string
  insuranceimg: string
  inmaintainance: boolean
  isavailable: boolean
  images: string[] | null
  mainimg: string
  vendorid: number
  parkingid: number | null
  isapproved: boolean
  ispopular: boolean
  createdAt: string
  updatedAt: string
}

interface CarsResponse {
  statusCode: number
  data: Car[]
  message: string
  success: boolean
}

export async function fetchCars(): Promise<{ success: boolean; data?: Car[]; message?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_base_url
    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.get(`${baseUrl}/cars/getcar`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data: CarsResponse = response.data

    if (data.success && data.statusCode === 200) {
      return {
        success: true,
        data: data.data,
        message: data.message
      }
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch cars'
      }
    }
  } catch (error) {
    console.error('Fetch cars error:', error)
    return {
      success: false,
      message: 'An error occurred while fetching cars'
    }
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


export async function deleteCar(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_base_url
    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.delete(`${baseUrl}/cars/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    return {
      success: true,
      message: 'Car deleted successfully'
    }
  } catch (error) {
    console.error('Delete car error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the car'
    }
  }
}