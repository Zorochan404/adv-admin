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
import { formatDate } from '@/lib/utils'
import { mockUsers, mockBookings } from '@/data/mock-data'
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers.filter(user => user.role === 'user'))
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesStatus
  })

  const getUserBookings = (userId: string) => {
    return mockBookings.filter(booking => booking.userId === userId)
  }

  const getUserStats = (userId: string) => {
    const userBookings = getUserBookings(userId)
    return {
      totalBookings: userBookings.length,
      activeBookings: userBookings.filter(b => b.status === 'active').length,
      totalSpent: userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">
            Manage customer accounts and view user activity
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold">{users.filter(u => !u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => {
                    const userDate = new Date(u.createdAt)
                    const now = new Date()
                    return userDate.getMonth() === now.getMonth() && 
                           userDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>Manage and monitor user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
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
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const stats = getUserStats(user.id)
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.isActive ? 'default' : 'secondary'}
                        className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{stats.totalBookings}</p>
                        <p className="text-sm text-gray-600">
                          {stats.activeBookings} active
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.location ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-32">
                            {user.location.address}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No location</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                Detailed information for {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* User Info */}
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                    <AvatarFallback className="text-lg">
                                      {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <p className="text-gray-600">{selectedUser.phone}</p>
                                    <Badge 
                                      variant={selectedUser.isActive ? 'default' : 'secondary'}
                                      className={selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                    >
                                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                              <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{getUserStats(selectedUser.id).totalBookings}</p>
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                  </div>
                                  <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{getUserStats(selectedUser.id).activeBookings}</p>
                                    <p className="text-sm text-gray-600">Active Bookings</p>
                                  </div>
                                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">${getUserStats(selectedUser.id).totalSpent}</p>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                  </div>
                                </div>

                                {/* Recent Bookings */}
                                <div>
                                  <h4 className="font-medium mb-3">Recent Bookings</h4>
                                  <div className="space-y-3">
                                    {getUserBookings(selectedUser.id).slice(0, 3).map(booking => (
                                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <p className="font-medium">{booking.car.make} {booking.car.model}</p>
                                          <p className="text-sm text-gray-600">
                                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}>
                                            {booking.status}
                                          </Badge>
                                          <p className="text-sm text-gray-600 mt-1">${booking.totalAmount}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Location */}
                                {selectedUser.location && (
                                  <div>
                                    <h4 className="font-medium mb-3">Location</h4>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-gray-600" />
                                        <span>{selectedUser.location.address}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-2">
                                        Coordinates: {selectedUser.location.lat}, {selectedUser.location.lng}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
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
