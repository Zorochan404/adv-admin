'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { ArrowLeft, MapPin, Clock, Shield, Car } from 'lucide-react'

interface ParkingPlotForm {
  name: string
  address: string
  latitude: number
  longitude: number
  capacity: number
  hourlyRate: number
  dailyRate: number
  amenities: string[]
  openTime: string
  closeTime: string
  description: string
}

const availableAmenities = [
  '24/7 Security',
  'CCTV Surveillance', 
  'EV Charging',
  'Covered Parking',
  'Valet Parking',
  'Car Wash',
  'Shuttle Service',
  'Airport Shuttle',
  'Food Court',
  'Restrooms',
  'Tourist Information',
  'Beach Access',
  'Wi-Fi',
  'ATM',
  'First Aid'
]

export default function AddParkingPlotPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ParkingPlotForm>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    capacity: 50,
    hourlyRate: 100,
    dailyRate: 2000,
    amenities: [],
    openTime: '00:00',
    closeTime: '23:59',
    description: ''
  })

  const handleInputChange = (field: keyof ParkingPlotForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.address || !formData.capacity) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.latitude === 0 || formData.longitude === 0) {
      toast.error('Please provide valid coordinates')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send this data to your backend
      console.log('New parking plot data:', formData)
      
      toast.success('Parking plot added successfully!')
      router.push('/dashboard/parking')
    } catch {
      toast.error('Failed to add parking plot. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Parking Plot</h1>
          <p className="text-gray-600 mt-2">
            Create a new parking location for your fleet management
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details for the new parking plot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plot Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Mumbai Central Parking Hub"
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  placeholder="50"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Bandra West, Mumbai, Maharashtra 400050"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                  placeholder="19.0760"
                  required
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                  placeholder="72.8777"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Additional details about the parking location..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Pricing Information
            </CardTitle>
            <CardDescription>
              Set the hourly and daily rates for this parking plot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dailyRate">Daily Rate (₹) *</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => handleInputChange('dailyRate', parseInt(e.target.value))}
                  placeholder="2000"
                  min="1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
            <CardDescription>
              Set the operating hours for this parking plot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">Opening Time</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={formData.openTime}
                  onChange={(e) => handleInputChange('openTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) => handleInputChange('closeTime', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Amenities & Features
            </CardTitle>
            <CardDescription>
              Select the amenities available at this parking plot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/parking')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-32"
          >
            {isSubmitting ? 'Adding...' : 'Add Parking Plot'}
          </Button>
        </div>
      </form>
    </div>
  )
}
