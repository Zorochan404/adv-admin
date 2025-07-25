'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Plus, Upload, X, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import Cookies from 'js-cookie'
import { uploadImageToCloudinary, validateImageFile } from '@/lib/cloudinary'

interface CarFormData {
  name: string
  maker: string
  year: number
  carnumber: string
  price: number
  insurancePrice: number
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
  images: string[]
  mainimg: string
  vendorid: number
  parkingid: number | null
  isapproved: boolean
  ispopular: boolean
}

export default function AddCarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Individual loading states for each image upload
  const [mainImageLoading, setMainImageLoading] = useState(false)
  const [additionalImageLoading, setAdditionalImageLoading] = useState(false)
  const [rcImageLoading, setRcImageLoading] = useState(false)
  const [pollutionImageLoading, setPollutionImageLoading] = useState(false)
  const [insuranceImageLoading, setInsuranceImageLoading] = useState(false)
  
  const [formData, setFormData] = useState<CarFormData>({
    name: '',
    maker: '',
    year: new Date().getFullYear(),
    carnumber: '',
    price: 0,
    insurancePrice: 0,
    discountedprice: 0,
    color: '',
    transmission: 'Manual',
    fuel: 'Petrol',
    type: 'Sedan',
    seats: 5,
    rcnumber: '',
    rcimg: '',
    pollutionimg: '',
    insuranceimg: '',
    inmaintainance: false,
    isavailable: true,
    images: [],
    mainimg: '',
    vendorid: 0,
    parkingid: null,
    isapproved: false,
    ispopular: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_base_url
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        toast.error('No access token found')
        return
      }

      const response = await axios.post(`${baseUrl}/cars/add`, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.data.success) {
        toast.success('Car added successfully!')
        router.push('/dashboard/cars')
      } else {
        toast.error(response.data.message || 'Failed to add car')
      }
    } catch (error: any) {
      console.error('Add car error:', error)
      toast.error(error.response?.data?.message || 'An error occurred while adding the car')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CarFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Individual upload functions for each image type
  const uploadMainImage = async (file: File) => {
    if (!validateImageFile(file)) {
      toast.error('Invalid file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.')
      return
    }

    setMainImageLoading(true)
    try {
      const result = await uploadImageToCloudinary(file, 'car-rental/main')
      if (result.success && result.data) {
    setFormData(prev => ({
      ...prev,
          mainimg: result.data!.secure_url
        }))
        toast.success('Main image uploaded successfully!')
      } else {
        toast.error('Failed to upload main image')
      }
    } catch (error) {
      console.error('Main image upload error:', error)
      toast.error('Failed to upload main image')
    } finally {
      setMainImageLoading(false)
    }
  }

  const uploadAdditionalImage = async (file: File) => {
    if (!validateImageFile(file)) {
      toast.error('Invalid file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.')
      return
    }

    try {
      const result = await uploadImageToCloudinary(file, 'car-rental/additional')
      if (result.success && result.data) {
    setFormData(prev => ({
      ...prev,
          images: [...prev.images, result.data!.secure_url]
        }))
        toast.success(`${file.name} uploaded successfully!`)
      } else {
        toast.error(`Failed to upload ${file.name}`)
      }
    } catch (error) {
      console.error('Additional image upload error:', error)
      toast.error(`Failed to upload ${file.name}`)
    }
  }

  const uploadRcImage = async (file: File) => {
    if (!validateImageFile(file)) {
      toast.error('Invalid file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.')
      return
    }

    setRcImageLoading(true)
    try {
      const result = await uploadImageToCloudinary(file, 'car-rental/documents')
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          rcimg: result.data!.secure_url
        }))
        toast.success('RC document uploaded successfully!')
      } else {
        toast.error('Failed to upload RC document')
      }
    } catch (error) {
      console.error('RC image upload error:', error)
      toast.error('Failed to upload RC document')
    } finally {
      setRcImageLoading(false)
    }
  }

  const uploadPollutionImage = async (file: File) => {
    if (!validateImageFile(file)) {
      toast.error('Invalid file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.')
      return
    }

    setPollutionImageLoading(true)
    try {
      const result = await uploadImageToCloudinary(file, 'car-rental/documents')
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          pollutionimg: result.data!.secure_url
        }))
        toast.success('Pollution certificate uploaded successfully!')
      } else {
        toast.error('Failed to upload pollution certificate')
      }
    } catch (error) {
      console.error('Pollution image upload error:', error)
      toast.error('Failed to upload pollution certificate')
    } finally {
      setPollutionImageLoading(false)
    }
  }

  const uploadInsuranceImage = async (file: File) => {
    if (!validateImageFile(file)) {
      toast.error('Invalid file. Please upload a valid image (JPEG, PNG, WebP) under 10MB.')
      return
    }

    setInsuranceImageLoading(true)
    try {
      const result = await uploadImageToCloudinary(file, 'car-rental/documents')
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          insuranceimg: result.data!.secure_url
        }))
        toast.success('Insurance document uploaded successfully!')
        } else {
        toast.error('Failed to upload insurance document')
        }
    } catch (error) {
      console.error('Insurance image upload error:', error)
      toast.error('Failed to upload insurance document')
    } finally {
      setInsuranceImageLoading(false)
    }
  }

  // Handle file input changes
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadMainImage(file)
    }
  }

  const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return
    
    setAdditionalImageLoading(true)
    
    try {
      // Upload all files sequentially
      for (const file of files) {
        await uploadAdditionalImage(file)
      }
    } finally {
      setAdditionalImageLoading(false)
      // Clear the input so the same files can be selected again if needed
      e.target.value = ''
    }
  }

  const handleRcImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadRcImage(file)
        }
      }

  const handlePollutionImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadPollutionImage(file)
    }
  }

  const handleInsuranceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadInsuranceImage(file)
        }
      }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // No need to revoke object URLs here as they are managed by the upload functions
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
          <p className="text-gray-600 mt-2">
            Add a new car to your rental fleet
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Information</CardTitle>
          <CardDescription>
            Fill in the details to add a new car to your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Car Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Hyundai Creta"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maker">Maker *</Label>
                  <Input
                    id="maker"
                    value={formData.maker}
                    onChange={(e) => handleInputChange('maker', e.target.value)}
                    placeholder="Hyundai"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="carnumber">Car Number *</Label>
                  <Input
                    id="carnumber"
                    value={formData.carnumber}
                    onChange={(e) => handleInputChange('carnumber', e.target.value)}
                    placeholder="AS01BC1234"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="White"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <Select value={formData.fuel} onValueChange={(value) => handleInputChange('fuel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price per Day (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="3000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="insurancePrice">Insurance Price (₹) *</Label>
                  <Input
                    id="insurancePrice"
                    type="number"
                    value={formData.insurancePrice}
                    onChange={(e) => handleInputChange('insurancePrice', parseFloat(e.target.value))}
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountedprice">Discounted Price (₹)</Label>
                  <Input
                    id="discountedprice"
                    type="number"
                    value={formData.discountedprice}
                    onChange={(e) => handleInputChange('discountedprice', parseFloat(e.target.value))}
                    placeholder="2700"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rcnumber">RC Number *</Label>
                  <Input
                    id="rcnumber"
                    value={formData.rcnumber}
                    onChange={(e) => handleInputChange('rcnumber', e.target.value)}
                    placeholder="AS123456789"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rcimg">RC Image</Label>
                  <div className="space-y-2">
                    <Input
                      id="rcimg"
                      value={formData.rcimg}
                      onChange={(e) => handleInputChange('rcimg', e.target.value)}
                      placeholder="https://cdn.example.com/docs/rc1.jpg"
                    />
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="rcimg-file"
                        accept="image/*"
                        onChange={handleRcImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="rcimg-file"
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                      >
                        <Upload className="h-4 w-4" />
                        Upload RC
                      </label>
                      {rcImageLoading && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                          <span className="text-sm text-gray-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* RC Image Preview */}
                    {(formData.rcimg) && (
                      <div className="mt-3">
                        <Label className="text-sm text-gray-600">Preview:</Label>
                        <div className="mt-2 relative inline-block">
                          <img
                            src={formData.rcimg}
                            alt="RC document"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => {
                              if (formData.rcimg) {
                                window.open(formData.rcimg, '_blank')
                              }
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pollutionimg">Pollution Certificate</Label>
                  <div className="space-y-2">
                    <Input
                      id="pollutionimg"
                      value={formData.pollutionimg}
                      onChange={(e) => handleInputChange('pollutionimg', e.target.value)}
                      placeholder="https://cdn.example.com/docs/pollution1.jpg"
                    />
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="pollutionimg-file"
                        accept="image/*"
                        onChange={handlePollutionImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="pollutionimg-file"
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Pollution Cert
                      </label>
                      {pollutionImageLoading && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                          <span className="text-sm text-gray-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Pollution Certificate Preview */}
                    {(formData.pollutionimg) && (
                      <div className="mt-3">
                        <Label className="text-sm text-gray-600">Preview:</Label>
                        <div className="mt-2 relative inline-block">
                          <img
                            src={formData.pollutionimg}
                            alt="Pollution certificate"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => {
                              if (formData.pollutionimg) {
                                window.open(formData.pollutionimg, '_blank')
                              }
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="insuranceimg">Insurance</Label>
                  <div className="space-y-2">
                    <Input
                      id="insuranceimg"
                      value={formData.insuranceimg}
                      onChange={(e) => handleInputChange('insuranceimg', e.target.value)}
                      placeholder="https://cdn.example.com/docs/insurance1.jpg"
                    />
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="insuranceimg-file"
                        accept="image/*"
                        onChange={handleInsuranceImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="insuranceimg-file"
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Insurance
                      </label>
                      {insuranceImageLoading && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                          <span className="text-sm text-gray-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Insurance Preview */}
                    {(formData.insuranceimg) && (
                      <div className="mt-3">
                        <Label className="text-sm text-gray-600">Preview:</Label>
                        <div className="mt-2 relative inline-block">
                          <img
                            src={formData.insuranceimg}
                            alt="Insurance document"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => {
                              if (formData.insuranceimg) {
                                window.open(formData.insuranceimg, '_blank')
                              }
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Images</h3>
              
              {/* Main Image */}
              <div>
                <Label htmlFor="mainimg">Main Image *</Label>
                <div className="space-y-2">
                  <Input
                    id="mainimg"
                    value={formData.mainimg}
                    onChange={(e) => handleInputChange('mainimg', e.target.value)}
                    placeholder="https://cdn.example.com/images/creta_main.jpg"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="mainimg-file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="mainimg-file"
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Main Image
                    </label>
                    {mainImageLoading && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Main Image Preview */}
                  {(formData.mainimg) && (
                    <div className="mt-3">
                      <Label className="text-sm text-gray-600">Preview:</Label>
                      <div className="mt-2 relative inline-block">
                        <img
                          src={formData.mainimg}
                          alt="Main car image"
                          className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => {
                            if (formData.mainimg) {
                              window.open(formData.mainimg, '_blank')
                            }
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <Label>Additional Images</Label>
                <div className="space-y-2">
                  {/* File upload for additional images */}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="additional-images"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="additional-images"
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Additional Images
                    </label>
                    {additionalImageLoading && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    )}
                  </div>

                  {/* Display uploaded files */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm">{image.split('/').pop() || ''}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImageUrl(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Additional Images Preview */}
                  {(formData.images.length > 0) && (
                    <div className="mt-3">
                      <Label className="text-sm text-gray-600">Preview:</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {/* Preview uploaded files */}
                        {formData.images.map((image, index) => (
                          <div key={`preview-${index}`} className="relative">
                            <img
                              src={image}
                              alt={`Additional image ${index + 1}`}
                              className="w-24 h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute top-1 right-1 h-5 w-5 p-0"
                              onClick={() => window.open(image, '_blank')}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorid">Vendor ID *</Label>
                  <Input
                    id="vendorid"
                    type="number"
                    value={formData.vendorid}
                    onChange={(e) => handleInputChange('vendorid', parseInt(e.target.value))}
                    placeholder="11"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parkingid">Parking ID</Label>
                  <Input
                    id="parkingid"
                    type="number"
                    value={formData.parkingid || ''}
                    onChange={(e) => handleInputChange('parkingid', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="4"
                  />
                </div>
              </div>
            </div>

            {/* Status Toggles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isavailable"
                    checked={formData.isavailable}
                    onCheckedChange={(checked: any) => handleInputChange('isavailable', checked)}
                  />
                  <Label htmlFor="isavailable">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inmaintainance"
                    checked={formData.inmaintainance}
                    onCheckedChange={(checked: any) => handleInputChange('inmaintainance', checked)}
                  />
                  <Label htmlFor="inmaintainance">In Maintenance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isapproved"
                    checked={formData.isapproved}
                    onCheckedChange={(checked: any) => handleInputChange('isapproved', checked)}
                  />
                  <Label htmlFor="isapproved">Approved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ispopular"
                    checked={formData.ispopular}
                    onCheckedChange={(checked: any) => handleInputChange('ispopular', checked)}
                  />
                  <Label htmlFor="ispopular">Popular</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading || mainImageLoading || additionalImageLoading || rcImageLoading || pollutionImageLoading || insuranceImageLoading} className="flex-1">
                {loading ? 'Adding Car...' : 'Add Car'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/cars')}
                disabled={loading || mainImageLoading || additionalImageLoading || rcImageLoading || pollutionImageLoading || insuranceImageLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 