'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockParkingSpots } from '@/data/mock-data'
import { Car, Plus, Search, MapPin, Eye, FileText, Shield, Wrench, User, Edit, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { deleteCar, fetchCars } from './api'
import { useRef } from 'react'

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

const statusColors = {
  available: 'bg-green-100 text-green-800',
  rented: 'bg-orange-100 text-orange-800',
  maintenance: 'bg-orange-100 text-orange-800',
  out_of_service: 'bg-red-100 text-red-800'
}

export default function CarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  // Date range state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bookingFilterLoading, setBookingFilterLoading] = useState(false)
  const [filteredByBookingCarIds, setFilteredByBookingCarIds] = useState<number[] | null>(null)

  // Fetch cars on component mount
  useEffect(() => {
    const loadCars = async () => {
      try {
        const result = await fetchCars()
        if (result.success && result.data) {
          setCars(result.data)
        } else {
          toast.error(result.message || 'Failed to fetch cars')
        }
      } catch (error) {
        console.error('Error loading cars:', error)
        toast.error('Failed to load cars')
      } finally {
        setLoading(false)
      }
    }
    loadCars()
  }, [])

  // Filtered cars logic
  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.maker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carnumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.rcnumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'available' && car.isavailable && !car.inmaintainance) ||
      (statusFilter === 'rented' && !car.isavailable && !car.inmaintainance) ||
      (statusFilter === 'maintenance' && car.inmaintainance) ||
      (statusFilter === 'out_of_service' && !car.isavailable && !car.inmaintainance)

    // If booking filter is active, only show cars in filteredByBookingCarIds
    const matchesBooking =
      !filteredByBookingCarIds || filteredByBookingCarIds.includes(car.id)

    return matchesSearch && matchesStatus && matchesBooking
  })

  // Date range filter handler
  const handleDateRangeFilter = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end date')
      return
    }
    setBookingFilterLoading(true)
    setFilteredByBookingCarIds(null)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_base_url
      const response = await fetch(`${baseUrl}/booking/bd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      })
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        const carIds = data.data.map((booking: any) => booking.carId)
        setFilteredByBookingCarIds(carIds)
        toast.success('Filtered by booking date range!')
      } else {
        setFilteredByBookingCarIds([])
        toast.error('No bookings found for selected range')
      }
    } catch (error) {
      setFilteredByBookingCarIds([])
      toast.error('Failed to filter by booking date range')
    } finally {
      setBookingFilterLoading(false)
    }
  }

  const handleStatusChange = (carId: number, newStatus: string) => {
    setCars(cars.map(car =>
      car.id === carId ? { 
        ...car, 
        isavailable: newStatus === 'available',
        inmaintainance: newStatus === 'maintenance'
      } : car
    ))
    toast.success('Car status updated!')
  }

  const handleDeleteCar = async (carId: number) => {
    setLoading(true)
    const result = await deleteCar(carId)
    if (result.success) {
      toast.success('Car deleted successfully!')
      setCars(cars.filter(car => car.id !== carId))
      setLoading(false)
    } else {
      toast.error(result.message || 'Failed to delete car')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cars Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your fleet of rental cars
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/cars/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Car
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold">{cars.length}</p>
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
                <p className="text-2xl font-bold">{cars.filter(c => c.isavailable && !c.inmaintainance).length}</p>
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
                <p className="text-sm font-medium text-gray-600">Rented</p>
                <p className="text-2xl font-bold">{cars.filter(c => !c.isavailable && !c.inmaintainance).length}</p>
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
                <p className="text-2xl font-bold">{cars.filter(c => c.inmaintainance).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Cars List</CardTitle>
          <CardDescription>Manage and monitor your car fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by make, model, license plate, unique ID, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Date Range Selector */}
            <div className="flex gap-4 items-center">
              <Label className="text-sm">Start Date</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="max-w-xs"
              />
              <Label className="text-sm">End Date</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="max-w-xs"
              />
              <Button
                onClick={handleDateRangeFilter}
                disabled={bookingFilterLoading}
                className="ml-2"
              >
                {bookingFilterLoading ? 'Filtering...' : 'Filter by Booking Date'}
              </Button>
              {filteredByBookingCarIds && (
                <Button
                  variant="outline"
                  onClick={() => setFilteredByBookingCarIds(null)}
                  className="ml-2"
                  disabled={bookingFilterLoading}
                >
                  Clear Date Filter
                </Button>
              )}
            </div>
          </div>

          {/* Cars Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Car Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading cars...
                  </TableCell>
                </TableRow>
              ) : filteredCars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No cars found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{car.name}</p>
                        <p className="text-sm text-gray-600">{car.maker} • {car.year}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{car.carnumber}</TableCell>
                    <TableCell className="capitalize">{car.type}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[car.inmaintainance ? 'maintenance' : (car.isavailable ? 'available' : 'rented')]}> 
                        {car.inmaintainance ? 'maintenance' : (car.isavailable ? 'available' : 'rented')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatCurrency(car.price)}/day</p>
                      {car.discountedprice < car.price && (
                        <p className="text-sm text-green-600">{formatCurrency(car.discountedprice)} (discounted)</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{car.vendorid}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCar(car)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Car Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {car.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCar && (
                              <div className="space-y-6">
                                {/* Car Header */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-semibold">{selectedCar.name}</h3>
                                    <p className="text-gray-600">{selectedCar.maker} • {selectedCar.year}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className={statusColors[selectedCar.inmaintainance ? 'maintenance' : (selectedCar.isavailable ? 'available' : 'rented')]}>
                                        {selectedCar.inmaintainance ? 'maintenance' : (selectedCar.isavailable ? 'available' : 'rented')}
                                      </Badge>
                                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                        {selectedCar.carnumber}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold">{formatCurrency(selectedCar.price)}</p>
                                    <p className="text-sm text-gray-600">per day</p>
                                    {selectedCar.discountedprice < selectedCar.price && (
                                      <p className="text-sm text-green-600">{formatCurrency(selectedCar.discountedprice)} (discounted)</p>
                                    )}
                                  </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                  {/* Car Details */}
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      Car Details
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Car Number</p>
                                        <p className="font-mono font-medium">{selectedCar.carnumber}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">RC Number</p>
                                        <p className="font-medium">{selectedCar.rcnumber}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Color</p>
                                        <p className="font-medium">{selectedCar.color}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Specifications */}
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      Specifications
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Transmission</p>
                                        <p className="font-medium">{selectedCar.transmission}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Fuel Type</p>
                                        <p className="font-medium">{selectedCar.fuel}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Seats</p>
                                        <p className="font-medium">{selectedCar.seats}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Status and Business Info */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <Wrench className="h-4 w-4" />
                                      Status & Business
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Maintenance Status</p>
                                        <p className="font-medium">{selectedCar.inmaintainance ? 'In Maintenance' : 'Not in Maintenance'}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Available</p>
                                        <p className="font-medium">{selectedCar.isavailable ? 'Yes' : 'No'}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Approved</p>
                                        <p className="font-medium">{selectedCar.isapproved ? 'Yes' : 'No'}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Popular</p>
                                        <p className="font-medium">{selectedCar.ispopular ? 'Yes' : 'No'}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Business Information
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Vendor ID</p>
                                        <p className="font-medium">{selectedCar.vendorid}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Parking ID</p>
                                        <p className="font-medium">{selectedCar.parkingid || 'Not assigned'}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Car ID</p>
                                        <p className="font-medium">{selectedCar.id}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Document Images */}
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Documents
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {selectedCar.rcimg && (
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">RC Image</p>
                                        <a 
                                          href={selectedCar.rcimg} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-orange-600 hover:underline text-sm break-all"
                                        >
                                          View RC Document
                                        </a>
                                      </div>
                                    )}
                                    {selectedCar.pollutionimg && (
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">Pollution Certificate</p>
                                        <a 
                                          href={selectedCar.pollutionimg} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-orange-600 hover:underline text-sm break-all"
                                        >
                                          View Pollution Certificate
                                        </a>
                                      </div>
                                    )}
                                    {selectedCar.insuranceimg && (
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-2">Insurance</p>
                                        <a 
                                          href={selectedCar.insuranceimg} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-orange-600 hover:underline text-sm break-all"
                                        >
                                          View Insurance Document
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Car Images */}
                                {(selectedCar.mainimg || (selectedCar.images && selectedCar.images.length > 0)) && (
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <Upload className="h-4 w-4" />
                                      Car Images
                                    </h4>
                                    <div className="space-y-3">
                                      {selectedCar.mainimg && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <p className="text-sm text-gray-600 mb-2">Main Image</p>
                                          <a 
                                            href={selectedCar.mainimg} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-orange-600 hover:underline text-sm break-all"
                                          >
                                            View Main Image
                                          </a>
                                        </div>
                                      )}
                                      {selectedCar.images && selectedCar.images.length > 0 && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <p className="text-sm text-gray-600 mb-2">Additional Images ({selectedCar.images.length})</p>
                                          <div className="space-y-1">
                                            {selectedCar.images.map((image, index) => (
                                              <div key={index}>
                                                <a 
                                                  href={image} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="text-orange-600 hover:underline text-sm break-all"
                                                >
                                                  Image {index + 1}
                                                </a>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Timestamps */}
                                <div>
                                  <h4 className="font-medium mb-3">Timestamps</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Created At</p>
                                      <p className="font-medium">{formatDate(selectedCar.createdAt)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Updated At</p>
                                      <p className="font-medium">{formatDate(selectedCar.updatedAt)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/cars/edit/${car.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
