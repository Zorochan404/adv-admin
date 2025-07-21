'use client'

import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { mockParkingSpots, mockCars, mockBookings } from '@/data/mock-data'
import type { Car as CarType } from '@/types'
import {
  MapPin,
  Car,
  ArrowLeft,
  Navigation,
  Phone,
  Mail,
  User,
  Calendar,
  FileText,
  Shield,
  Wrench
} from 'lucide-react'

// Car Card Component
function CarCard({ car }: { car: CarType }) {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-orange-100 text-orange-800',
    maintenance: 'bg-orange-100 text-orange-800',
    out_of_service: 'bg-red-100 text-red-800'
  }

  const booking = mockBookings.find(b => b.carId === car.id && b.status === 'active')
  const user = booking?.user

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">{car.make} {car.model}</h4>
                <p className="text-sm text-gray-600">{car.year}</p>
                <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                  {car.uniqueId}
                </p>
              </div>
              <Badge className={statusColors[car.status]}>
                {car.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-600">License:</span> {car.licensePlate}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Owner:</span> {car.ownerName}
              </p>
              <p className="text-sm font-medium">
                {formatCurrency(car.pricePerDay)}/day
              </p>
              {user && (
                <p className="text-sm text-orange-600">
                  <span className="text-gray-600">Rented by:</span> {user.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Car Details - {car.make} {car.model}</DialogTitle>
          <DialogDescription>
            Complete information and booking details
          </DialogDescription>
        </DialogHeader>
        <CarDetailsContent car={car} />
      </DialogContent>
    </Dialog>
  )
}

// Car Details Content Component
function CarDetailsContent({ car }: { car: CarType }) {
  const booking = mockBookings.find(b => b.carId === car.id && b.status === 'active')
  const user = booking?.user

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-orange-100 text-orange-800',
    maintenance: 'bg-orange-100 text-orange-800',
    out_of_service: 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Car Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
          <p className="text-gray-600">{car.year}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusColors[car.status]}>
              {car.status}
            </Badge>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {car.uniqueId}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatCurrency(car.pricePerDay)}</p>
          <p className="text-sm text-gray-600">per day</p>
        </div>
      </div>

      {/* Car Details */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Vehicle Information
          </h4>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">License Plate</p>
              <p className="font-mono font-medium">{car.licensePlate}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Registration Certificate</p>
              <p className="font-medium">{car.registrationCertificate}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Pollution Certificate</p>
              <p className="font-medium">{car.pollutionCertificate}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Insurance Details
          </h4>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium">{car.insuranceDetails.provider}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Policy Number</p>
              <p className="font-mono font-medium">{car.insuranceDetails.policyNumber}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Expiry Date</p>
              <p className="font-medium">{formatDate(car.insuranceDetails.expiryDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance & Owner */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Last Maintenance Date</p>
            <p className="font-medium">{formatDate(car.maintenanceDate)}</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Ownership
          </h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Owner Name</p>
            <p className="font-medium">{car.ownerName}</p>
          </div>
        </div>
      </div>

      {/* User Details and Booking (if rented) */}
      {booking && user && (
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Current Booking Details
          </h4>
          <div className="border rounded-lg p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h5 className="font-medium">{user.name}</h5>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {user.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Booking Period</span>
                </div>
                <p className="text-sm">Start: {formatDateTime(booking.startDate)}</p>
                <p className="text-sm">End: {formatDateTime(booking.endDate)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Live Tracking</span>
                </div>
                <p className="text-sm">Status: Active</p>
                <p className="text-sm">Amount: {formatCurrency(booking.totalAmount)}</p>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <h6 className="font-medium mb-2">Pickup & Dropoff</h6>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 border rounded">
                  <p className="text-xs text-gray-600">Pickup Location</p>
                  <p className="text-sm">{booking.pickupLocation.address}</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="text-xs text-gray-600">Dropoff Location</p>
                  <p className="text-sm">{booking.dropoffLocation.address}</p>
                </div>
              </div>
            </div>

            {/* Track Button */}
            <div className="flex justify-center">
              <Button className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Track Live Location
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Available for Booking */}
      {car.status === 'available' && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Available for Booking</h4>
          <p className="text-sm text-green-700">
            This car is currently available for rental at {formatCurrency(car.pricePerDay)} per day.
          </p>
        </div>
      )}

      {/* Maintenance Status */}
      {car.status === 'maintenance' && (
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">Under Maintenance</h4>
          <p className="text-sm text-orange-700">
            This car is currently under maintenance. Last service: {formatDate(car.maintenanceDate)}
          </p>
        </div>
      )}
    </div>
  )
}

export default function ParkingSpotPage() {
  const router = useRouter()
  const params = useParams()
  const spotId = params.spotId as string

  const spot = mockParkingSpots.find(s => s.id === spotId)
  
  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Parking Spot Not Found</h1>
          <Button onClick={() => router.push('/dashboard/parking')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Parking
          </Button>
        </div>
      </div>
    )
  }

  const carsAtSpot = mockCars.filter(car => car.parkingSpotId === spotId)
  const availableCars = carsAtSpot.filter(car => car.status === 'available')
  const bookedCars = carsAtSpot.filter(car => car.status === 'rented')
  const maintenanceCars = carsAtSpot.filter(car => car.status === 'maintenance')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/parking')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{spot.name}</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {spot.address}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold">{carsAtSpot.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold">{availableCars.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Booked</p>
                <p className="text-2xl font-bold">{bookedCars.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold">{maintenanceCars.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cars List */}
      <Card>
        <CardHeader>
          <CardTitle>Cars at {spot.name}</CardTitle>
          <CardDescription>
            View and manage all cars at this parking location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Cars ({carsAtSpot.length})</TabsTrigger>
              <TabsTrigger value="available">Available ({availableCars.length})</TabsTrigger>
              <TabsTrigger value="rented">Booked ({bookedCars.length})</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance ({maintenanceCars.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {carsAtSpot.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rented" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookedCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {maintenanceCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>


    </div>
  )
}
