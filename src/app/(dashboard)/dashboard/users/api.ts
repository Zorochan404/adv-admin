import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

export interface User {
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

export const getUsers = async (): Promise<{ success: boolean; data?: User[]; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/user/getallusers`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });


    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to fetch users'
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: 'An error occurred while fetching users'
    }
  }
}

export const getUserById = async (id: number): Promise<{ success: boolean; data?: User; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/user/getuser/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to fetch user'
      }
    }
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return {
      success: false,
      message: 'An error occurred while fetching user'
    }
  }
}

export const updateUser = async (id: number, userData: Partial<User>): Promise<{ success: boolean; data?: User; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_base_url}/user/updateuser/${id}`, userData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to update user'
      }
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'An error occurred while updating user'
    }
  }
}

export const deleteUser = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_base_url}/user/deleteuser/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to delete user'
      }
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'An error occurred while deleting user'
    }
  }
} 