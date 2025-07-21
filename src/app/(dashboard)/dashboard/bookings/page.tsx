'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { mockBookings } from '@/data/mock-data'
import {
  Search,
  MapPin,
  Car,
  Clock,
  DollarSign,
  Eye,
  CheckCircle,
  Navigation
} from 'lucide-react'

const statusColors = {
  active: 'bg-green-100 text-green-800',
  upcoming: 'bg-orange-100 text-orange-800',
  past: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  active: Navigation,
  upcoming: Clock,
  past: CheckCircle
}

type FilterPeriod = 'today' | 'week' | 'month' | 'all'

export default function BookingsPage() {
  const [bookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<FilterPeriod>('week')
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null)

  // Filter bookings by time period
  const getFilteredBookingsByTime = () => {
    if (timeFilter === 'all') return bookings

    const now = new Date()
    const startDate = new Date()

    switch (timeFilter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'month':
        startDate.setDate(now.getDate() - 30)
        startDate.setHours(0, 0, 0, 0)
        break
    }

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= startDate
    })
  }

  const timeFilteredBookings = getFilteredBookingsByTime()

  const filteredBookings = timeFilteredBookings.filter(booking => {
    const matchesSearch =
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Categorize bookings for filtering
    const now = new Date()
    const startDate = new Date(booking.startDate)
    const endDate = new Date(booking.endDate)

    let bookingCategory = ''
    if (booking.status === 'active') {
      bookingCategory = 'active'
    } else if (startDate > now && (booking.status === 'confirmed' || booking.status === 'pending')) {
      bookingCategory = 'upcoming'
    } else if (endDate <= now && booking.status === 'completed') {
      bookingCategory = 'past'
    }

    const matchesStatus = statusFilter === 'all' || bookingCategory === statusFilter

    return matchesSearch && matchesStatus
  })



  const getBookingStats = () => {
    const filteredBookings = timeFilteredBookings
    const now = new Date()

    // Categorize bookings based on their start dates and status
    const activeBookings = mockBookings.filter(b => b.status === 'active')
    const upcomingBookings = filteredBookings.filter(b => {
      const startDate = new Date(b.startDate)
      return startDate > now && (b.status === 'confirmed' || b.status === 'pending')
    })
    const pastBookings = filteredBookings.filter(b => {
      const endDate = new Date(b.endDate)
      return endDate <= now && b.status === 'completed'
    })

    return {
      total: filteredBookings.length,
      active: activeBookings.length,
      upcoming: upcomingBookings.length,
      past: pastBookings.length,
      totalRevenue: filteredBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    }
  }

  const stats = getBookingStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage rental bookings - {
              timeFilter === 'today' ? 'Today' :
              timeFilter === 'week' ? 'Last 7 days' :
              timeFilter === 'month' ? 'Last 30 days' : 'All time'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by:</span>
          <Select value={timeFilter} onValueChange={(value: FilterPeriod) => setTimeFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">7 Days</SelectItem>
              <SelectItem value="month">30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Navigation className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Past Bookings</p>
                <p className="text-2xl font-bold">{stats.past}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {timeFilter === 'today' ? 'Today' :
                   timeFilter === 'week' ? 'Last 7 days' :
                   timeFilter === 'month' ? 'Last 30 days' : 'All time'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings List</CardTitle>
          <CardDescription>Monitor and manage all rental bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
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
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                // Determine booking category
                const now = new Date()
                const startDate = new Date(booking.startDate)
                const endDate = new Date(booking.endDate)

                let bookingCategory = ''
                if (booking.status === 'active') {
                  bookingCategory = 'active'
                } else if (startDate > now && (booking.status === 'confirmed' || booking.status === 'pending')) {
                  bookingCategory = 'upcoming'
                } else if (endDate <= now && booking.status === 'completed') {
                  bookingCategory = 'past'
                }

                const StatusIcon = statusIcons[bookingCategory as keyof typeof statusIcons]
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">
                      #{booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={booking.user.avatar} alt={booking.user.name} />
                          <AvatarFallback>
                            {booking.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.user.name}</p>
                          <p className="text-sm text-gray-600">{booking.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{booking.car.make} {booking.car.model}</p>
                          <p className="text-sm text-gray-600">{booking.car.licensePlate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDate(booking.startDate)}</p>
                        <p className="text-sm text-gray-600">to {formatDate(booking.endDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {StatusIcon && <StatusIcon className="h-4 w-4" />}
                        <Badge className={statusColors[bookingCategory as keyof typeof statusColors]}>
                          {bookingCategory}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                        <Badge 
                          variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}
                          className={
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Complete information for booking #{booking.id}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBooking && (() => {
                            // Determine booking category for selected booking
                            const now = new Date()
                            const startDate = new Date(selectedBooking.startDate)
                            const endDate = new Date(selectedBooking.endDate)

                            let selectedBookingCategory = ''
                            if (selectedBooking.status === 'active') {
                              selectedBookingCategory = 'active'
                            } else if (startDate > now && (selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending')) {
                              selectedBookingCategory = 'upcoming'
                            } else if (endDate <= now && selectedBooking.status === 'completed') {
                              selectedBookingCategory = 'past'
                            }

                            return (
                              <div className="space-y-6">
                                {/* Booking Header */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-semibold">Booking #{selectedBooking.id}</h3>
                                    <p className="text-gray-600">Created on {formatDateTime(selectedBooking.createdAt)}</p>
                                  </div>
                                  <Badge className={statusColors[selectedBookingCategory as keyof typeof statusColors]}>
                                    {selectedBookingCategory}
                                  </Badge>
                                </div>

                              {/* Customer & Vehicle Info */}
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Customer Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <Avatar>
                                        <AvatarImage src={selectedBooking.user.avatar} alt={selectedBooking.user.name} />
                                        <AvatarFallback>
                                          {selectedBooking.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{selectedBooking.user.name}</p>
                                        <p className="text-sm text-gray-600">{selectedBooking.user.email}</p>
                                        <p className="text-sm text-gray-600">{selectedBooking.user.phone}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3">Vehicle Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Car className="h-5 w-5 text-gray-400" />
                                      <span className="font-medium">
                                        {selectedBooking.car.make} {selectedBooking.car.model} ({selectedBooking.car.year})
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">License: {selectedBooking.car.licensePlate}</p>
                                    <p className="text-sm text-gray-600">Unique ID: {selectedBooking.car.uniqueId}</p>
                                    <p className="text-sm text-gray-600">Type: {selectedBooking.car.type}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Booking Details */}
                              <div>
                                <h4 className="font-medium mb-3">Booking Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Clock className="h-4 w-4 text-gray-600" />
                                      <span className="font-medium">Rental Period</span>
                                    </div>
                                    <p className="text-sm">Start: {formatDateTime(selectedBooking.startDate)}</p>
                                    <p className="text-sm">End: {formatDateTime(selectedBooking.endDate)}</p>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <DollarSign className="h-4 w-4 text-gray-600" />
                                      <span className="font-medium">Payment</span>
                                    </div>
                                    <p className="text-lg font-bold">{formatCurrency(selectedBooking.totalAmount)}</p>
                                    <Badge 
                                      variant={selectedBooking.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                      className={
                                        selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                        selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }
                                    >
                                      {selectedBooking.paymentStatus}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Locations */}
                              <div>
                                <h4 className="font-medium mb-3">Locations</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <MapPin className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">Pickup Location</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{selectedBooking.pickupLocation.address}</p>
                                  </div>
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <MapPin className="h-4 w-4 text-red-600" />
                                      <span className="font-medium">Dropoff Location</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{selectedBooking.dropoffLocation.address}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {selectedBooking.notes && (
                                <div>
                                  <h4 className="font-medium mb-3">Notes</h4>
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm">{selectedBooking.notes}</p>
                                  </div>
                                </div>
                              )}
                              </div>
                            )
                          })()}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
