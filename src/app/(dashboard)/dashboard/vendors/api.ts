import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import router from "next/router";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";


export interface VendorFormData {
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
  }

export const addVendor = async (vendor: VendorFormData) => {

    try {
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        toast.error('No access token found')
        return
      }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_base_url}/user/addvendor`, vendor, {
        headers: {
            'Authorization': `${accessToken}`,
            'Content-Type': 'application/json',
          },
    });
    if (response.data.success) {
        return response.data.data;
        
      } else {
        console.error(response.data.message || 'Failed to add vendor')
        return null;
      }
    } catch (error) {
        console.error('Error adding vendor:', error);
        toast.error('Failed to add vendor');
        return null;
    }
};

export const getVendors = async () => {
    try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
        toast.error('No access token found')
        return
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/user/getusersbyvendor`, {
        headers: {
            'Authorization': `${accessToken}`,
        },
    });
    console.log(response.data.data);
    return response.data.data;
    } catch (error) {
        console.error('Error getting vendors:', error);
        toast.error('Failed to get vendors');
        return null;
    }
}


export const deleteVendor = async (id: number) => {
    try {
        const accessToken = Cookies.get('accessToken')
        if (!accessToken) {
            toast.error('No access token found')
            return
        }
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_base_url}/user/deleteuser/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (response.data.success) {
            console.log('Vendor deleted successfully!')
        } else {
            console.error(response.data.message || 'Failed to delete vendor')
        }
    } catch (error) {
        console.error('Error deleting vendor:', error);
        toast.error('Failed to delete vendor');
        return null;
    }
}

export const getVendorById = async (id: number) => {
    try {
        const accessToken = Cookies.get('accessToken')
        if (!accessToken) {
            toast.error('No access token found')
            return
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_base_url}/user/getuser/${id}`, {
            headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
            },
        });
        
        if (response.data.success) {
            return response.data.data;
        } else {
            console.error(response.data.message || 'Failed to get vendor by id')
            return null;
        }
    } catch (error) {
        console.error('Error getting vendor by id:', error);
        toast.error('Failed to get vendor by id');
        return null;
    }
}

export const updateVendor = async (id: number, vendor: VendorFormData) => {
    try {
        const accessToken = Cookies.get('accessToken')
        if (!accessToken) {
            toast.error('No access token found')
            return
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_base_url}/user/updateuser/${id}`, vendor, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            console.error(response.data.message || 'Failed to update vendor')
            return null;
        }
    } catch (error) {
        console.error('Error updating vendor:', error);
        toast.error('Failed to update vendor');
        return null;
    }
}