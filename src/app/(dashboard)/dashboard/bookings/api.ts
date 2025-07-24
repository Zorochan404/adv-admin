import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

export interface Booking {
  id: number
  userId: number
  carId: number
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  pickupLocation: string | null
  dropoffLocation: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    name: string | null
    email: string | null
    number: number
  }
  car?: {
    id: number
    name: string
    maker: string
    carnumber: string
    mainimg: string
  }
}

export const getBookings = async (): Promise<{ success: boolean; data?: Booking[]; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/booking/getallbookings`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Bookings API Response:', response.data)

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to fetch bookings'
      }
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      success: false,
      message: 'An error occurred while fetching bookings'
    }
  }
}

export const getBookingById = async (id: number): Promise<{ success: boolean; data?: Booking; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/booking/getbooking/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Get Booking By ID API Response:', response.data)

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to fetch booking'
      }
    }
  } catch (error) {
    console.error('Error fetching booking by id:', error);
    return {
      success: false,
      message: 'An error occurred while fetching booking'
    }
  }
}

export const updateBookingStatus = async (id: number, status: Booking['status']): Promise<{ success: boolean; data?: Booking; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_base_url}/booking/updatebooking/${id}`, { status }, {
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
        message: response.data.message || 'Failed to update booking'
      }
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      success: false,
      message: 'An error occurred while updating booking'
    }
  }
}

export const deleteBooking = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      }
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_base_url}/booking/deletebooking/${id}`, {
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
        message: response.data.message || 'Failed to delete booking'
      }
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    return {
      success: false,
      message: 'An error occurred while deleting booking'
    }
  }
} 