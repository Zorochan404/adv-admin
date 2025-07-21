'use client'


import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { mockParkingSpots, mockCars, mockBookings } from '@/data/mock-data'
import {
  MapPin,
  Car,
  Plus,
  Settings,
  Activity
} from 'lucide-react'

export default function ParkingPage() {
  const router = useRouter()

  const getSpotStats = (spotId: string) => {
    const carsAtSpot = mockCars.filter(car => car.parkingSpotId === spotId)

    return {
      totalCars: carsAtSpot.length,
      availableCars: carsAtSpot.filter(car => car.status === 'available').length,
      bookedCars: carsAtSpot.filter(car => car.status === 'rented').length,
      maintenanceCars: carsAtSpot.filter(car => car.status === 'maintenance').length,
    }
  }

  const handleParkingClick = (spotId: string) => {
    router.push(`/dashboard/parking/${spotId}`)
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
          Add Parking Plot
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
                <p className="text-2xl font-bold">{mockParkingSpots.length}</p>
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
                  {mockCars.length}
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
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold">
                  {mockBookings.filter(booking => booking.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parking Spots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockParkingSpots.map((spot) => {
          const stats = getSpotStats(spot.id)

          return (
            <Card
              key={spot.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleParkingClick(spot.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {spot.name}
                    </CardTitle>
                    <CardDescription>{spot.address}</CardDescription>
                  </div>
                  <Badge variant={spot.isActive ? 'default' : 'secondary'}>
                    {spot.isActive ? 'Active' : 'Inactive'}
                  </Badge>
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
