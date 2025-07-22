'use client'


import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'


import { getParkingSpots, ParkingSpot, getParkingSpotById } from './api'
import {
  MapPin,
  Car,
  Plus,
  Settings,
  Activity
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ParkingPage() {
  const router = useRouter()
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
  const [parkingData, setParkingData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParkingSpots = async () => {
      setLoading(true)
      try {
        const spots = await getParkingSpots()
        if (spots) {
          setParkingSpots(spots)
          
          // Fetch detailed data for each parking spot
          const detailedData = await Promise.all(
            spots.map(async (spot) => {
              if (spot.id) {
                const detailedSpot = await getParkingSpotById(spot.id)
                return detailedSpot
              }
              return null
            })
          )
          
          setParkingData(detailedData.filter(data => data !== null))
        }
      } catch (error) {
        console.error('Error fetching parking spots:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchParkingSpots()
  }, [])

  const getSpotStats = (spotId: string) => {
    const spotData = parkingData.find(data => data?.parking?.id?.toString() === spotId)
    const cars = spotData?.cars || []

    return {
      totalCars: cars.length,
      availableCars: cars.filter((car: any) => car.isavailable).length,
      bookedCars: cars.filter((car: any) => !car.isavailable && !car.inmaintainance).length,
      maintenanceCars: cars.filter((car: any) => car.inmaintainance).length,
    }
  }

  const handleParkingClick = (spotId: string) => {
    router.push(`/dashboard/parking/${spotId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-lg font-medium">Loading parking spots...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parking Spots</h1>
          <p className="text-gray-600 mt-2">
            Manage your parking locations and monitor capacity
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/parking/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Parking Spot
        </Button> 

       
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spots</p>
                <p className="text-2xl font-bold">{parkingSpots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold">
                  {parkingData.reduce((total, data) => total + (data?.cars?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold">
                  {parkingSpots.reduce((total, spot) => total + spot.capacity, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parking Spots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parkingSpots.map((spot: ParkingSpot) => {
          const stats = getSpotStats(spot.id?.toString() ?? '')

          return (
            <Card
              key={spot.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleParkingClick(spot.id?.toString() ?? '')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {spot.name}
                    </CardTitle>
                    <CardDescription>{spot.locality}</CardDescription>
                  </div>
                 
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Car className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">{stats.availableCars}</p>
                    <p className="text-xs text-gray-600">Available</p>
                  </div>
                              <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">{stats.bookedCars}</p>
                    <p className="text-xs text-gray-600">Booked</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Settings className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">{stats.maintenanceCars}</p>
                    <p className="text-xs text-gray-600">Maintenance</p>
                  </div>
                </div>


              </CardContent>
            </Card>
          )
        })}
      </div>


    </div>
  )
}
