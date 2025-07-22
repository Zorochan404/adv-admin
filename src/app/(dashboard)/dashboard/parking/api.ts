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


export interface ParkingManager {
 
        updatedAt?: Timestamp;
        createdAt?: Timestamp;
        id?: number;
        name: string;
        avatar: string;
        age: number | "";
        number: number | "";
        email: string;
        password: string;
        aadharNumber: string;
        aadharimg: string;
        dlNumber: string;
        dlimg: string;
        passportNumber: string;
        passportimg: string;
        locality: string;
        city: string;
        state: string;
        country: string;
        pincode: number | "";
        isverified: boolean;
        role: string;
        parkingid: number;
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
    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
        toast.error('No access token found')
        return
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/parking/getbyidadmin/${id}`, {
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

export const updateParkingSpot = async (id: number, parkingSpot: Partial<ParkingSpot>): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
        toast.error('No access token found')
        return
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_base_url}/parking/update/${id}`, parkingSpot, {
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
    console.error('Error updating parking spot:', error);
    throw error;
  }
}
export const deleteParkingSpot = async (id: number): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
        toast.error('No access token found')
        return
    }
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_base_url}/parking/delete/${id}`, {
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
    console.error('Error deleting parking spot:', error);
    throw error;
  }
}

export const addParkingManager = async (parkingManager: ParkingManager): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_base_url}/user/addparkingincharge `, parkingManager, {
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
    console.error('Error adding parking manager:', error);
    throw error;
  }
}

export const searchParkingInchargeByPhone = async (number: { number: string; }): Promise<any>  => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    console.log(number)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_base_url}/user/getparkinginchargebynumber`,
      number, {
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error searching parking incharge by phone:', error);
    throw error;
  }
}

export const assignInchargeToParking = async (parkingid: number, id: number): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_base_url}/user/assignparkingincharge`, {
      parkingid,
      id
    }, {
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
    console.error('Error assigning incharge to parking:', error);
    throw error;
  }
}


export const getParkingInchargeByParkingId = async (parkingid: number): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/user/getparkinginchargebyparkingid/${parkingid}`, {
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
    console.error('Error getting parking incharge by parking id:', error);
    throw error;
  }
}

export const getParkingInchargeById = async (id: number): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/user/getuser/${id}`, {
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
    console.error('Error getting parking incharge by id:', error);
    throw error;
  }
}

export const updateParkingIncharge = async (id: number, parkingIncharge: Partial<ParkingManager>): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_base_url}/user/updateuser/${id}`, parkingIncharge, {
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
    console.error('Error updating parking incharge:', error);
    throw error;
  }
}

export const deleteParkingIncharge = async (id: number): Promise<any> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      toast.error('No access token found')
      return
    }
    const response = await axios.put(`${process.env.NEXT_PUBLIC_base_url}/user/updateuser/${id}`,{parkingid:null}, {
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
    console.error('Error deleting parking incharge:', error);
    throw error;
  }
}