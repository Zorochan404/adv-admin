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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { Calendar, Search, Eye, Edit, Trash2, Car, User, MapPin, CreditCard, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { getBookings, deleteBooking, updateBookingStatus, Booking } from './api'

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Fetch bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const result = await getBookings()
        if (result.success && result.data) {
          // Handle both array and direct array responses
          const bookingsData = Array.isArray(result.data) ? result.data : [result.data]
          setBookings(bookingsData)
        } else {
          toast.error(result.message || 'Failed to fetch bookings')
        }
      } catch (error) {
        console.error('Error loading bookings:', error)
        toast.error('Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  // Filtered bookings logic
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      (booking.user?.name && booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.user?.email && booking.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.car?.name && booking.car.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.car?.maker && booking.car.maker.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.car?.carnumber && booking.car.carnumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.id.toString().includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        const result = await deleteBooking(bookingId)
        if (result.success) {
          toast.success('Booking deleted successfully!')
          setBookings(bookings.filter(booking => booking.id !== bookingId))
        } else {
          toast.error(result.message || 'Failed to delete booking')
        }
      } catch (error) {
        console.error('Error deleting booking:', error)
        toast.error('Failed to delete booking')
      }
    }
  }

  const handleStatusUpdate = async (bookingId: number, newStatus: Booking['status']) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus)
      if (result.success) {
        toast.success('Booking status updated successfully!')
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ))
      } else {
        toast.error(result.message || 'Failed to update booking status')
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast.error('Failed to update booking status')
    }
  }

  const getStatusBadgeColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentBadgeColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all car rental bookings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
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
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.paymentStatus === 'paid').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings List</CardTitle>
          <CardDescription>Manage and monitor all car rental bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer name, email, car details, or booking ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bookings Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">#{booking.id}</p>
                        <p className="text-sm text-gray-600">{formatDate(booking.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {booking.user?.name ? booking.user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">{booking.user?.email || 'No email'}</p>
                          <p className="text-sm text-gray-600">{booking.user?.number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.car ? (
                        <div className="flex items-center gap-3">
                          <img src={booking.car.mainimg} alt={booking.car.name} className="w-12 h-8 object-cover rounded" />
                          <div>
                            <p className="font-medium">{booking.car.maker} {booking.car.name}</p>
                            <p className="text-sm text-gray-600">{booking.car.carnumber}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Car not found</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{calculateDuration(booking.startDate, booking.endDate)} days</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentBadgeColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                              <DialogDescription>
                                Complete information for booking #{booking.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedBooking && (
                              <div className="space-y-6">
                                {/* Booking Header */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-semibold">Booking #{selectedBooking.id}</h3>
                                    <p className="text-gray-600">Created on {formatDateTime(selectedBooking.createdAt)}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className={getStatusBadgeColor(selectedBooking.status)}>
                                        {selectedBooking.status}
                                      </Badge>
                                      <Badge className={getPaymentBadgeColor(selectedBooking.paymentStatus)}>
                                        {selectedBooking.paymentStatus}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold">{formatCurrency(selectedBooking.totalAmount)}</p>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                  </div>
                                </div>

                                {/* Customer Information */}
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Customer Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Customer Name</p>
                                      <p className="font-medium">{selectedBooking.user?.name || 'Unknown User'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Email</p>
                                      <p className="font-medium">{selectedBooking.user?.email || 'No email'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Phone Number</p>
                                      <p className="font-medium">{selectedBooking.user?.number}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Customer ID</p>
                                      <p className="font-medium">{selectedBooking.userId}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Car Information */}
                                {selectedBooking.car && (
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <Car className="h-4 w-4" />
                                      Car Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Car</p>
                                        <p className="font-medium">{selectedBooking.car.maker} {selectedBooking.car.name}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">License Plate</p>
                                        <p className="font-medium">{selectedBooking.car.carnumber}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Car ID</p>
                                        <p className="font-medium">{selectedBooking.carId}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Car Image</p>
                                        <img src={selectedBooking.car.mainimg} alt="Car" className="w-20 h-16 object-cover rounded mt-1" />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Booking Details */}
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Booking Details
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Start Date</p>
                                      <p className="font-medium">{formatDateTime(selectedBooking.startDate)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">End Date</p>
                                      <p className="font-medium">{formatDateTime(selectedBooking.endDate)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Duration</p>
                                      <p className="font-medium">{calculateDuration(selectedBooking.startDate, selectedBooking.endDate)} days</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Booking ID</p>
                                      <p className="font-medium">#{selectedBooking.id}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Location Information */}
                                {(selectedBooking.pickupLocation || selectedBooking.dropoffLocation) && (
                                  <div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      Location Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      {selectedBooking.pickupLocation && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <p className="text-sm text-gray-600">Pickup Location</p>
                                          <p className="font-medium">{selectedBooking.pickupLocation}</p>
                                        </div>
                                      )}
                                      {selectedBooking.dropoffLocation && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                          <p className="text-sm text-gray-600">Dropoff Location</p>
                                          <p className="font-medium">{selectedBooking.dropoffLocation}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                {selectedBooking.notes && (
                                  <div>
                                    <h4 className="font-medium mb-3">Notes</h4>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm">{selectedBooking.notes}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Timestamps */}
                                <div>
                                  <h4 className="font-medium mb-3">Timestamps</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Created At</p>
                                      <p className="font-medium">{formatDateTime(selectedBooking.createdAt)}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm text-gray-600">Updated At</p>
                                      <p className="font-medium">{formatDateTime(selectedBooking.updatedAt)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          value={booking.status}
                          onValueChange={(value: Booking['status']) => handleStatusUpdate(booking.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
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