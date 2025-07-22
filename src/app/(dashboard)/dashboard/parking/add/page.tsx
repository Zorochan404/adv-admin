'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addParkingSpot, ParkingSpot } from '../api'
import { toast } from 'sonner'
import { ArrowLeft, MapPin, Car, Navigation } from 'lucide-react'
import { uploadImageToCloudinary, validateImageFile } from '@/lib/cloudinary'



interface ParkingSpotForm {
  name: string
  locality: string
  city: string
  state: string
  country: string
  pincode: string
  capacity: number
  mainimg: string
  images: string[]
  lat: number
  lng: number
}

// Remove amenities array as it's not needed

export default function AddParkingSpotPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ParkingSpotForm>({
    name: '',
    locality: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    capacity: 50,
    mainimg: '',
    images: [],
    lat: 0,
    lng: 0
  })

  const [mainImageLoading, setMainImageLoading] = useState(false)
  const [additionalImagesLoading, setAdditionalImagesLoading] = useState(false)

  const handleInputChange = (field: keyof ParkingSpotForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (field: 'mainimg' | 'images', value: string) => {
    if (field === 'mainimg') {
      setFormData(prev => ({
        ...prev,
        mainimg: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, value]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Cloudinary upload handlers
  const handleMainImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!validateImageFile(file)) {
      toast.error('Invalid file type or size (max 10MB, jpg/png/webp)')
      return
    }
    setMainImageLoading(true)
    const res = await uploadImageToCloudinary(file, 'parking/main')
    setMainImageLoading(false)
    if (res.success && res.data?.secure_url) {
      setFormData(prev => ({ ...prev, mainimg: res.data!.secure_url }))
      toast.success('Main image uploaded!')
    } else {
      toast.error(res.error || 'Failed to upload main image')
    }
  }

  const handleAdditionalImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setAdditionalImagesLoading(true)
    for (const file of files) {
      if (!validateImageFile(file)) {
        toast.error('Invalid file type or size (max 10MB, jpg/png/webp)')
        continue
      }
      const res = await uploadImageToCloudinary(file, 'parking/additional')
      if (res.success && res.data) {
        setFormData(prev => ({ ...prev, images: [...prev.images, res.data!.secure_url] }))
        toast.success('Image uploaded!')
      } else {
        toast.error(res.error || 'Failed to upload image')
      }
    }
    setAdditionalImagesLoading(false)
  }

  // Map component for location selection
  const MapComponent = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const markerRef = useRef<any>(null)
    const [mapLoaded, setMapLoaded] = useState(false)

    useEffect(() => {
      if (mapRef.current && !mapLoaded) {
        // Load Leaflet CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Load Leaflet JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          if (mapRef.current) {
            const L = (window as any).L
            const leafletMap = L.map(mapRef.current).setView([20.5937, 78.9629], 5)
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(leafletMap)

            // Place marker if coordinates are already set
            if (formData.lat !== 0 && formData.lng !== 0) {
              markerRef.current = L.marker([formData.lat, formData.lng]).addTo(leafletMap)
              leafletMap.setView([formData.lat, formData.lng], 14)
            }

            // Add click handler to place marker
            leafletMap.on('click', (e: any) => {
              const { lat, lng } = e.latlng
              // Remove existing marker
              if (markerRef.current) {
                leafletMap.removeLayer(markerRef.current)
              }
              // Add new marker
              markerRef.current = L.marker([lat, lng]).addTo(leafletMap)
              // Update form data
              setFormData(prev => ({
                ...prev,
                lat: lat,
                lng: lng
              }))
              toast.success(`Location selected: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
            })

            // Store map reference for focus function
            ;(window as any).parkingMap = leafletMap
            ;(window as any).parkingMapMarkerRef = markerRef
            setMapLoaded(true)
          }
        }
        document.head.appendChild(script)
      }
    }, [mapLoaded])

    // Keep marker in sync with formData.lat/lng
    useEffect(() => {
      const L = (window as any).L
      const map = (window as any).parkingMap
      if (map && L) {
        // Remove old marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current)
          markerRef.current = null
        }
        // Add marker if coordinates are set
        if (formData.lat !== 0 && formData.lng !== 0) {
          markerRef.current = L.marker([formData.lat, formData.lng]).addTo(map)
          map.setView([formData.lat, formData.lng], 14)
        }
      }
    }, [formData.lat, formData.lng])

    const focusOnAddress = () => {
      const map = (window as any).parkingMap
      const L = (window as any).L
      if (!map || !formData.city || !formData.state || !formData.country) {
        toast.error('Please fill in city, state, and country first')
        return
      }
      const address = `${formData.city}, ${formData.state}, ${formData.country}`
      // Use Nominatim for geocoding
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0]
            map.setView([parseFloat(lat), parseFloat(lon)], 12)
            toast.success(`Focused on ${address}`)
            // If coordinates are already set, keep marker at those coordinates
            if (formData.lat !== 0 && formData.lng !== 0) {
              if (markerRef.current) {
                map.removeLayer(markerRef.current)
              }
              markerRef.current = L.marker([formData.lat, formData.lng]).addTo(map)
            }
          } else {
            toast.error('Could not find location. Please try a different address.')
          }
        })
        .catch(() => {
          toast.error('Error finding location. Please try again.')
        })
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            onClick={focusOnAddress}
            disabled={!formData.city || !formData.state || !formData.country}
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Focus on Address
          </Button>
          {formData.lat !== 0 && formData.lng !== 0 && (
            <span className="text-sm text-gray-600">
              Selected: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
            </span>
          )}
        </div>
        <div 
          ref={mapRef} 
          className="w-full h-64 border rounded-lg"
          style={{ zIndex: 1 }}
        />
        <p className="text-sm text-gray-600">
          Click on the map to place a marker and set coordinates
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.locality || !formData.city || !formData.state || !formData.country || !formData.pincode || !formData.capacity) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.lat === 0 || formData.lng === 0) {
      toast.error('Please select a location on the map')
      return
    }

    setIsSubmitting(true)

          try {

        const parkingSpotData = {
          ...formData,
          pincode: Number(formData.pincode),
        };
        
        console.log('Submitting parking spot data:', parkingSpotData);
        const res = await addParkingSpot(parkingSpotData);

     if(res){
      toast.success('Parking spot added successfully!')
      router.push('/dashboard/parking')
  
     }else{
      toast.error('Failed to add parking spot. Please try again.')

      }
    } catch {
      toast.error('Failed to add parking spot. Please try again.')
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Parking Spot</h1>
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
              Enter the basic details for the new parking spot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Parking Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="City Center Parking"
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
              <Label htmlFor="locality">Locality *</Label>
              <Input
                id="locality"
                value={formData.locality}
                onChange={(e) => handleInputChange('locality', e.target.value)}
                placeholder="MG Road"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Bengaluru"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Karnataka"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="India"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="560001"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Selection
            </CardTitle>
            <CardDescription>
              Select the exact location on the map by clicking to place a marker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapComponent />
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Images
            </CardTitle>
            <CardDescription>
              Add main image and additional images for the parking spot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mainimg">Main Image</Label>
              <Input
                id="mainimg"
                type="file"
                accept="image/*"
                onChange={handleMainImageFile}
                disabled={mainImageLoading}
              />
              {mainImageLoading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
              {formData.mainimg && (
                <div className="mt-2">
                  <img src={formData.mainimg} alt="Main" className="w-32 h-24 object-cover rounded border" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="additionalImage">Additional Images</Label>
              <Input
                id="additionalImage"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImageFiles}
                disabled={additionalImagesLoading}
              />
              {additionalImagesLoading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
              {formData.images.length > 0 && (
                <div className="mt-2 space-y-2">
                  <Label>Additional Images:</Label>
                  <div className="flex gap-2 flex-wrap">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt={`Parking ${index + 1}`} className="w-24 h-16 object-cover rounded border" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            {isSubmitting ? 'Adding...' : 'Add Parking Spot'}
          </Button>
        </div>
      </form>
    </div>
  )
}
