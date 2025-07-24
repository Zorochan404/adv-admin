'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'

import {
  Car,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  Activity,
  Wrench
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { getBookings } from './bookings/api'
import { fetchCars } from './cars/api'
import { getUsers } from './users/api'
import { getParkingSpots } from './parking/api'

type FilterPeriod = 'today' | 'week' | 'month'

export default function DashboardPage() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('week')
  const [bookings, setBookings] = useState<any[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [parkingSpots, setParkingSpots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [bookingsRes, carsRes, usersRes, parkingRes] = await Promise.all([
          getBookings(),
          fetchCars(),
          getUsers(),
          getParkingSpots(),
        ])
        setBookings(bookingsRes.data || [])
        setCars(carsRes.data || [])
        setUsers(usersRes.data || [])
        setParkingSpots(parkingRes || [])
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter bookings by period
  const filteredBookings = useMemo(() => {
    const now = new Date()
    const startDate = new Date()
    switch (filterPeriod) {
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
    return bookings.filter(b => {
      const created = b.createdAt ? new Date(b.createdAt) : null
      return created && created >= startDate
    })
  }, [bookings, filterPeriod])

  // Total Revenue
  const totalRevenue = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  }, [filteredBookings])

  // Active Bookings
  const activeBookingsCount = useMemo(() => {
    return bookings.filter(b => b.status === 'active').length
  }, [bookings])

  // Car Availability
  const carAvailability = useMemo(() => {
    const total = cars.length
    const available = cars.filter(c => c.isavailable).length
    const rented = cars.filter(c => c.status === 'rented').length
    const maintenance = cars.filter(c => c.status === 'maintenance').length
    const outOfService = cars.filter(c => c.status === 'out_of_service').length
    return {
      total,
      available,
      rented,
      maintenance,
      outOfService,
      availabilityRate: total ? ((available / total) * 100).toFixed(1) : '0.0'
    }
  }, [cars])

  // Total Users
  const totalUsersCount = useMemo(() => users.length, [users])

  // Parking Utilization
  const parkingUtilization = useMemo(() => {
    return parkingSpots.map(spot => {
      const carsAtSpot = cars.filter(car => car.parkingid === spot.id)
      const utilization = spot.capacity ? ((carsAtSpot.length / spot.capacity) * 100).toFixed(1) : '0.0'
      return {
        name: spot.name,
        cars: carsAtSpot.length,
        capacity: spot.capacity,
        utilization: parseFloat(utilization),
        available: spot.capacity - carsAtSpot.length
      }
    })
  }, [parkingSpots, cars])

  // Revenue by Car Type
  const revenueByCarType = useMemo(() => {
    const typeRevenue: Record<string, { revenue: number, bookings: number }> = {}
    filteredBookings.forEach(booking => {
      const carType = booking.car?.type || 'Unknown'
      if (!typeRevenue[carType]) typeRevenue[carType] = { revenue: 0, bookings: 0 }
      typeRevenue[carType].revenue += booking.totalPrice || 0
      typeRevenue[carType].bookings += 1
    })
    return Object.entries(typeRevenue).map(([type, data]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      revenue: data.revenue,
      bookings: data.bookings
    }))
  }, [filteredBookings])

  // Chart Data
  const chartData = useMemo(() => {
    const days = filterPeriod === 'today' ? 1 : filterPeriod === 'week' ? 7 : 30
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const dateStr = date.toISOString().split('T')[0]
      const dayBookings = filteredBookings.filter(b => {
        const created = b.createdAt ? new Date(b.createdAt) : null
        const bookingDateStr = created ? created.toISOString().split('T')[0] : ''
        return bookingDateStr === dateStr
      })
      data.push({
        date: dateStr,
        revenue: dayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        bookings: dayBookings.length
      })
    }
    return data
  }, [filteredBookings, filterPeriod])

  // Recent Bookings
  const recentBookings = useMemo(() => {
    return bookings
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [bookings])

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading dashboard...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time insights into your car rental and parking operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by:</span>
          <Select value={filterPeriod} onValueChange={(value: FilterPeriod) => setFilterPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">7 Days</SelectItem>
              <SelectItem value="month">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-600 mt-1">
              {filterPeriod === 'today' ? 'Today' :
               filterPeriod === 'week' ? 'Last 7 days' : 'Last 30 days'} revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookingsCount}</div>
            <p className="text-xs text-gray-600 mt-1">Currently active rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Car Availability
            </CardTitle>
            <Car className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carAvailability.availabilityRate}%</div>
            <p className="text-xs text-gray-600 mt-1">
              {carAvailability.available} of {carAvailability.total} cars available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsersCount}</div>
            <p className="text-xs text-gray-600 mt-1">Registered customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Car Availability Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Car Availability Status
          </CardTitle>
          <CardDescription>Real-time fleet availability and status overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">{carAvailability.available}</p>
              <p className="text-sm text-green-600">Available</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-700">{carAvailability.rented}</p>
              <p className="text-sm text-orange-600">Rented</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Wrench className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-700">{carAvailability.maintenance}</p>
              <p className="text-sm text-orange-600">Maintenance</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">{carAvailability.outOfService}</p>
              <p className="text-sm text-red-600">Out of Service</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              {filterPeriod === 'today' ? 'Hourly revenue today' :
               filterPeriod === 'week' ? 'Daily revenue for the past week' :
               'Daily revenue for the past month'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return filterPeriod === 'today'
                      ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                      : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  }}
                />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={{ fill: '#ea580c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Activity</CardTitle>
            <CardDescription>
              {filterPeriod === 'today' ? 'Bookings today' :
               filterPeriod === 'week' ? 'Bookings for the past week' :
               'Bookings for the past month'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
                  formatter={(value) => [value, 'Bookings']}
                />
                <Bar dataKey="bookings" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Parking Utilization & Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parking Spot Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Parking Spot Utilization
            </CardTitle>
            <CardDescription>Current capacity usage across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parkingUtilization.map((spot) => (
                <div key={spot.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{spot.name}</span>
                    <span className="text-sm text-gray-600">
                      {spot.cars}/{spot.capacity} ({spot.utilization}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        spot.utilization > 80 ? 'bg-red-500' :
                        spot.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${spot.utilization}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{spot.available} available</span>
                    <span>{spot.cars} occupied</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Car Type */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Car Type</CardTitle>
            <CardDescription>
              Earnings breakdown by vehicle category ({filterPeriod === 'today' ? 'today' :
               filterPeriod === 'week' ? 'last 7 days' : 'last 30 days'})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByCarType.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Car className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-gray-600">{item.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
              ))}
              {revenueByCarType.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No revenue data for selected period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Latest rental activity ({filteredBookings.length} bookings in selected period)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Car className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.user?.name}</p>
                    <p className="text-sm text-gray-600">
                      {booking.car?.make} {booking.car?.model} ({booking.car?.uniqueId})
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={booking.status === 'active' ? 'default' : 'secondary'}
                    className={
                      booking.status === 'active' ? 'bg-green-100 text-green-800' :
                      booking.status === 'completed' ? 'bg-orange-100 text-orange-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings found for selected period
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
