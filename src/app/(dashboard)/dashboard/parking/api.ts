import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface ParkingSpot {
  id?: number;
  name: string;
  locality: string;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: number | null;
  capacity: number;
  mainimg: string;
  images: string[];
  lat: number;
  lng: number;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
}

export const getParkingSpots = async (): Promise<ParkingSpot[] | null> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/parking/get`);
    if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
      return response.data.data as ParkingSpot[];
    }
    return null;
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    throw error;
  }
}


export const getParkingSpotById = async (id: number): Promise<any> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/parking/getbyid/${id}`);
    if (response.status === 200 && response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching parking spot by id:', error);
    throw error;
  }
}


export const addParkingSpot = async (parkingSpot: ParkingSpot): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
        toast.error('No access token found')
        return
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_base_url}/parking/add`, parkingSpot, {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200 && response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error adding parking spot:', error);
    throw error;
  }
}

