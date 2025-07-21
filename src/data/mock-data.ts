import { User, Car, ParkingSpot, Booking } from '@/types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '+1234567890',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    avatar: undefined,
  },
  {
    id: '2',
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '+1234567891',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    isActive: true,
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY'
    }
  },
  {
    id: '3',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    phone: '+91-9876543210',
    role: 'user',
    createdAt: new Date('2024-02-01'),
    isActive: true,
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Bandra West, Mumbai, Maharashtra'
    }
  },
  {
    id: '4',
    email: 'rajesh.kumar@example.com',
    name: 'Rajesh Kumar',
    phone: '+91-9876543211',
    role: 'user',
    createdAt: new Date('2024-02-15'),
    isActive: true,
    location: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Connaught Place, New Delhi'
    }
  },
  {
    id: '5',
    email: 'priya.patel@example.com',
    name: 'Priya Patel',
    phone: '+91-9876543212',
    role: 'user',
    createdAt: new Date('2024-03-01'),
    isActive: true,
    location: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'Ahmedabad, Gujarat'
    }
  },
  {
    id: '6',
    email: 'arjun.singh@example.com',
    name: 'Arjun Singh',
    phone: '+91-9876543213',
    role: 'user',
    createdAt: new Date('2024-03-15'),
    isActive: true,
    location: {
      lat: 26.9124,
      lng: 75.7873,
      address: 'Jaipur, Rajasthan'
    }
  },
  {
    id: '7',
    email: 'meera.reddy@example.com',
    name: 'Meera Reddy',
    phone: '+91-9876543214',
    role: 'user',
    createdAt: new Date('2024-04-01'),
    isActive: true,
    location: {
      lat: 17.3850,
      lng: 78.4867,
      address: 'Hyderabad, Telangana'
    }
  },
  {
    id: '8',
    email: 'vikram.chauhan@example.com',
    name: 'Vikram Chauhan',
    phone: '+91-9876543215',
    role: 'user',
    createdAt: new Date('2024-04-15'),
    isActive: true,
    location: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Gurgaon, Haryana'
    }
  },
  {
    id: '9',
    email: 'ananya.krishna@example.com',
    name: 'Ananya Krishnamurthy',
    phone: '+91-9876543216',
    role: 'user',
    createdAt: new Date('2024-05-01'),
    isActive: true,
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Chennai, Tamil Nadu'
    }
  },
  {
    id: '10',
    email: 'rohit.sharma@example.com',
    name: 'Rohit Sharma',
    phone: '+91-9876543217',
    role: 'user',
    createdAt: new Date('2024-05-15'),
    isActive: true,
    location: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Kolkata, West Bengal'
    }
  },
]

// Mock Parking Spots
export const mockParkingSpots: ParkingSpot[] = [
  {
    id: '1',
    name: 'Mumbai Central Parking Hub',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    location: {
      lat: 19.0760,
      lng: 72.8777
    },
    capacity: 50,
    currentOccupancy: 4, // Cars: ADV-001, ADV-002, ADV-004, ADV-008
    availableCars: [],
    hourlyRate: 100,
    dailyRate: 2000,
    amenities: ['24/7 Security', 'EV Charging', 'Covered Parking'],
    operatingHours: {
      open: '00:00',
      close: '23:59'
    },
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Bangalore Tech Park Center',
    address: 'Koramangala, Bangalore, Karnataka 560034',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    capacity: 100,
    currentOccupancy: 2, // Cars: ADV-003, ADV-005
    availableCars: [],
    hourlyRate: 80,
    dailyRate: 1500,
    amenities: ['Shuttle Service', 'Car Wash', 'Valet Parking'],
    operatingHours: {
      open: '05:00',
      close: '23:00'
    },
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Delhi Airport Parking Complex',
    address: 'Indira Gandhi International Airport, New Delhi 110037',
    location: {
      lat: 28.5562,
      lng: 77.1000
    },
    capacity: 150,
    currentOccupancy: 2, // Cars: ADV-006, ADV-007
    availableCars: [],
    hourlyRate: 120,
    dailyRate: 2500,
    amenities: ['Airport Shuttle', '24/7 Security', 'Covered Parking'],
    operatingHours: {
      open: '00:00',
      close: '23:59'
    },
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '4',
    name: 'Pune IT Hub Parking',
    address: 'Hinjewadi Phase 1, Pune, Maharashtra 411057',
    location: {
      lat: 18.5912,
      lng: 73.7389
    },
    capacity: 80,
    currentOccupancy: 1, // Cars: ADV-009
    availableCars: [],
    hourlyRate: 90,
    dailyRate: 1800,
    amenities: ['EV Charging', 'CCTV Surveillance', 'Food Court'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    name: 'Chennai Marina Parking',
    address: 'Marina Beach Road, Chennai, Tamil Nadu 600013',
    location: {
      lat: 13.0475,
      lng: 80.2824
    },
    capacity: 60,
    currentOccupancy: 1, // Cars: ADV-010
    availableCars: [],
    hourlyRate: 70,
    dailyRate: 1400,
    amenities: ['Beach Access', 'Tourist Information', 'Restrooms'],
    operatingHours: {
      open: '05:00',
      close: '23:00'
    },
    isActive: true,
    createdAt: new Date('2024-02-15')
  }
]

// Mock Cars
export const mockCars: Car[] = [
  {
    id: '1',
    uniqueId: 'ADV-001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    licensePlate: 'MH 01 AB 1234',
    registrationCertificate: 'RC-MH-2023-001',
    pollutionCertificate: 'PC-MH-2024-001',
    insuranceDetails: {
      provider: 'ICICI Lombard General Insurance',
      policyNumber: 'IL-2024-TOY-001',
      expiryDate: new Date('2025-06-15')
    },
    maintenanceDate: new Date('2024-11-15'),
    ownerName: 'Rajesh Kumar',
    type: 'sedan',
    status: 'available',
    pricePerDay: 15000,
    features: ['GPS', 'Bluetooth', 'Backup Camera'],
    images: ['/cars/camry-1.jpg'],
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Bandra West, Mumbai, Maharashtra'
    },
    parkingSpotId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    uniqueId: 'ADV-002',
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    licensePlate: 'DL 03 CD 5678',
    registrationCertificate: 'RC-DL-2023-002',
    pollutionCertificate: 'PC-DL-2024-002',
    insuranceDetails: {
      provider: 'Bajaj Allianz General Insurance',
      policyNumber: 'BA-2024-HON-002',
      expiryDate: new Date('2025-08-20')
    },
    maintenanceDate: new Date('2024-10-20'),
    ownerName: 'Priya Patel',
    type: 'suv',
    status: 'rented', // Active booking ID: 1
    pricePerDay: 20000,
    features: ['GPS', 'Bluetooth', 'All-Wheel Drive', 'Sunroof'],
    images: ['/cars/crv-1.jpg'],
    location: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Connaught Place, New Delhi'
    },
    parkingSpotId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    uniqueId: 'ADV-003',
    make: 'BMW',
    model: 'X5',
    year: 2024,
    licensePlate: 'KA 05 EF 9012',
    registrationCertificate: 'RC-KA-2024-003',
    pollutionCertificate: 'PC-KA-2024-003',
    insuranceDetails: {
      provider: 'HDFC ERGO General Insurance',
      policyNumber: 'HE-2024-BMW-003',
      expiryDate: new Date('2025-12-10')
    },
    maintenanceDate: new Date('2024-12-01'),
    ownerName: 'Arjun Singh',
    type: 'suv',
    status: 'available',
    pricePerDay: 35000,
    features: ['GPS', 'Bluetooth', 'Leather Seats', 'Premium Sound'],
    images: ['/cars/x5-1.jpg'],
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Koramangala, Bangalore, Karnataka'
    },
    parkingSpotId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    uniqueId: 'ADV-004',
    model: 'Model 3',
    make: 'Tesla',
    year: 2024,
    licensePlate: 'TN 09 GH 3456',
    registrationCertificate: 'RC-TN-2024-004',
    pollutionCertificate: 'PC-TN-2024-004',
    insuranceDetails: {
      provider: 'Tata AIG General Insurance',
      policyNumber: 'TA-2024-TES-004',
      expiryDate: new Date('2025-09-30')
    },
    maintenanceDate: new Date('2024-12-25'),
    ownerName: 'Ananya Krishnamurthy',
    type: 'sedan',
    status: 'maintenance',
    pricePerDay: 28000,
    features: ['Autopilot', 'Supercharging', 'Premium Interior'],
    images: ['/cars/model3-1.jpg'],
    parkingSpotId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    uniqueId: 'ADV-005',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2023,
    licensePlate: 'GJ 01 IJ 7890',
    registrationCertificate: 'RC-GJ-2023-005',
    pollutionCertificate: 'PC-GJ-2024-005',
    insuranceDetails: {
      provider: 'New India Assurance',
      policyNumber: 'NI-2024-MAR-005',
      expiryDate: new Date('2025-07-15')
    },
    maintenanceDate: new Date('2024-11-10'),
    ownerName: 'Vikram Chauhan',
    type: 'hatchback',
    status: 'available',
    pricePerDay: 8000,
    features: ['AC', 'Power Steering', 'Central Locking'],
    images: ['/cars/swift-1.jpg'],
    parkingSpotId: '2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '6',
    uniqueId: 'ADV-006',
    make: 'Hyundai',
    model: 'Creta',
    year: 2024,
    licensePlate: 'AP 09 KL 2345',
    registrationCertificate: 'RC-AP-2024-006',
    pollutionCertificate: 'PC-AP-2024-006',
    insuranceDetails: {
      provider: 'Oriental Insurance',
      policyNumber: 'OI-2024-HYU-006',
      expiryDate: new Date('2025-11-20')
    },
    maintenanceDate: new Date('2024-12-05'),
    ownerName: 'Meera Reddy',
    type: 'suv',
    status: 'rented', // Active booking ID: 2
    pricePerDay: 18000,
    features: ['Sunroof', 'Touchscreen', 'Reverse Camera'],
    images: ['/cars/creta-1.jpg'],
    parkingSpotId: '3',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '7',
    uniqueId: 'ADV-007',
    make: 'Mahindra',
    model: 'Thar',
    year: 2023,
    licensePlate: 'RJ 14 MN 6789',
    registrationCertificate: 'RC-RJ-2023-007',
    pollutionCertificate: 'PC-RJ-2024-007',
    insuranceDetails: {
      provider: 'United India Insurance',
      policyNumber: 'UI-2024-MAH-007',
      expiryDate: new Date('2025-05-10')
    },
    maintenanceDate: new Date('2024-10-15'),
    ownerName: 'Rohit Sharma',
    type: 'suv',
    status: 'available',
    pricePerDay: 22000,
    features: ['4WD', 'Convertible Top', 'Off-road Tires'],
    images: ['/cars/thar-1.jpg'],
    parkingSpotId: '3',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '8',
    uniqueId: 'ADV-008',
    make: 'Tata',
    model: 'Nexon',
    year: 2024,
    licensePlate: 'WB 02 OP 3456',
    registrationCertificate: 'RC-WB-2024-008',
    pollutionCertificate: 'PC-WB-2024-008',
    insuranceDetails: {
      provider: 'National Insurance',
      policyNumber: 'NI-2024-TAT-008',
      expiryDate: new Date('2025-08-25')
    },
    maintenanceDate: new Date('2024-11-20'),
    ownerName: 'John Doe',
    type: 'suv',
    status: 'rented', // Active booking ID: 3
    pricePerDay: 16000,
    features: ['Electric Sunroof', 'Harman Audio', 'iRA Connected'],
    images: ['/cars/nexon-1.jpg'],
    parkingSpotId: '1',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '9',
    uniqueId: 'ADV-009',
    make: 'Kia',
    model: 'Seltos',
    year: 2023,
    licensePlate: 'UP 16 QR 7890',
    registrationCertificate: 'RC-UP-2023-009',
    pollutionCertificate: 'PC-UP-2024-009',
    insuranceDetails: {
      provider: 'Royal Sundaram Insurance',
      policyNumber: 'RS-2024-KIA-009',
      expiryDate: new Date('2025-04-30')
    },
    maintenanceDate: new Date('2024-12-10'),
    ownerName: 'Amit Gupta',
    type: 'suv',
    status: 'available',
    pricePerDay: 19000,
    features: ['Ventilated Seats', 'Wireless Charging', 'UVO Connect'],
    images: ['/cars/seltos-1.jpg'],
    parkingSpotId: '4',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '10',
    uniqueId: 'ADV-010',
    make: 'Volkswagen',
    model: 'Polo',
    year: 2023,
    licensePlate: 'HR 26 ST 1234',
    registrationCertificate: 'RC-HR-2023-010',
    pollutionCertificate: 'PC-HR-2024-010',
    insuranceDetails: {
      provider: 'Reliance General Insurance',
      policyNumber: 'RG-2024-VOL-010',
      expiryDate: new Date('2025-06-05')
    },
    maintenanceDate: new Date('2024-11-25'),
    ownerName: 'Deepika Sharma',
    type: 'hatchback',
    status: 'maintenance',
    pricePerDay: 12000,
    features: ['Touchscreen', 'Cruise Control', 'Rain Sensing Wipers'],
    images: ['/cars/polo-1.jpg'],
    parkingSpotId: '5',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  }
]

// Update parking spots with available cars
mockParkingSpots[0].availableCars = mockCars.filter(car =>
  car.parkingSpotId === '1' && car.status === 'available'
)
mockParkingSpots[1].availableCars = mockCars.filter(car =>
  car.parkingSpotId === '2' && car.status === 'available'
)
mockParkingSpots[2].availableCars = mockCars.filter(car =>
  car.parkingSpotId === '3' && car.status === 'available'
)
mockParkingSpots[3].availableCars = mockCars.filter(car =>
  car.parkingSpotId === '4' && car.status === 'available'
)
mockParkingSpots[4].availableCars = mockCars.filter(car =>
  car.parkingSpotId === '5' && car.status === 'available'
)

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers[1],
    carId: '2',
    car: mockCars[1],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date('2024-12-20T10:00:00'),
    endDate: new Date('2024-12-22T10:00:00'),
    status: 'active',
    totalAmount: 40000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Bandra West, Mumbai, Maharashtra'
    },
    dropoffLocation: {
      lat: 19.0176,
      lng: 72.8562,
      address: 'Juhu Beach, Mumbai, Maharashtra'
    },
    notes: 'Business trip rental',
    createdAt: new Date(), // Today
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers[2],
    carId: '6',
    car: mockCars[5],
    parkingSpotId: '3',
    parkingSpot: mockParkingSpots[2],
    startDate: new Date('2024-12-18T09:00:00'),
    endDate: new Date('2024-12-20T17:00:00'),
    status: 'active',
    totalAmount: 36000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 17.3850,
      lng: 78.4867,
      address: 'Hyderabad Airport, Telangana'
    },
    dropoffLocation: {
      lat: 17.4065,
      lng: 78.4772,
      address: 'HITEC City, Hyderabad, Telangana'
    },
    notes: 'Airport pickup',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    userId: '4',
    user: mockUsers[3],
    carId: '8',
    car: mockCars[7],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date('2024-12-21T14:00:00'),
    endDate: new Date('2024-12-23T12:00:00'),
    status: 'active',
    totalAmount: 32000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Salt Lake City, Kolkata, West Bengal'
    },
    dropoffLocation: {
      lat: 22.5744,
      lng: 88.3629,
      address: 'Park Street, Kolkata, West Bengal'
    },
    notes: 'Family vacation',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    userId: '5',
    user: mockUsers[4],
    carId: '5',
    car: mockCars[4],
    parkingSpotId: '2',
    parkingSpot: mockParkingSpots[1],
    startDate: new Date('2024-12-15T08:00:00'),
    endDate: new Date('2024-12-17T20:00:00'),
    status: 'completed',
    totalAmount: 24000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'Ahmedabad Railway Station, Gujarat'
    },
    dropoffLocation: {
      lat: 23.0395,
      lng: 72.5660,
      address: 'Mahatma Gandhi Road, Ahmedabad, Gujarat'
    },
    notes: 'City tour',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    userId: '6',
    user: mockUsers[5],
    carId: '7',
    car: mockCars[6],
    parkingSpotId: '3',
    parkingSpot: mockParkingSpots[2],
    startDate: new Date('2024-12-22T11:00:00'),
    endDate: new Date('2024-12-24T15:00:00'),
    status: 'confirmed',
    totalAmount: 44000,
    paymentStatus: 'pending',
    pickupLocation: {
      lat: 26.9124,
      lng: 75.7873,
      address: 'Jaipur Airport, Rajasthan'
    },
    dropoffLocation: {
      lat: 26.9260,
      lng: 75.8235,
      address: 'City Palace, Jaipur, Rajasthan'
    },
    notes: 'Heritage tour',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: '6',
    userId: '7',
    user: mockUsers[6],
    carId: '9',
    car: mockCars[8],
    parkingSpotId: '4',
    parkingSpot: mockParkingSpots[3],
    startDate: new Date('2024-12-16T07:00:00'),
    endDate: new Date('2024-12-18T19:00:00'),
    status: 'completed',
    totalAmount: 38000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Gurgaon Cyber City, Haryana'
    },
    dropoffLocation: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Connaught Place, New Delhi'
    },
    notes: 'Corporate meeting',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '7',
    userId: '8',
    user: mockUsers[7],
    carId: '1',
    car: mockCars[0],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date('2024-12-19T13:00:00'),
    endDate: new Date('2024-12-21T11:00:00'),
    status: 'completed',
    totalAmount: 30000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Bandra West, Mumbai, Maharashtra'
    },
    dropoffLocation: {
      lat: 19.0330,
      lng: 72.8697,
      address: 'Andheri East, Mumbai, Maharashtra'
    },
    notes: 'Weekend trip',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: '8',
    userId: '9',
    user: mockUsers[8],
    carId: '3',
    car: mockCars[2],
    parkingSpotId: '2',
    parkingSpot: mockParkingSpots[1],
    startDate: new Date('2024-12-23T16:00:00'),
    endDate: new Date('2024-12-25T14:00:00'),
    status: 'confirmed',
    totalAmount: 70000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Koramangala, Bangalore, Karnataka'
    },
    dropoffLocation: {
      lat: 12.9698,
      lng: 77.7500,
      address: 'Whitefield, Bangalore, Karnataka'
    },
    notes: 'Luxury rental for special occasion',
    createdAt: new Date('2024-12-23'),
    updatedAt: new Date('2024-12-23')
  },
  {
    id: '9',
    userId: '10',
    user: mockUsers[9],
    carId: '4',
    car: mockCars[3],
    parkingSpotId: '5',
    parkingSpot: mockParkingSpots[4],
    startDate: new Date('2024-12-14T10:00:00'),
    endDate: new Date('2024-12-16T18:00:00'),
    status: 'completed',
    totalAmount: 56000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Chennai Central, Tamil Nadu'
    },
    dropoffLocation: {
      lat: 13.0475,
      lng: 80.2824,
      address: 'Marina Beach, Chennai, Tamil Nadu'
    },
    notes: 'Electric vehicle experience',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: '10',
    userId: '2',
    user: mockUsers[1],
    carId: '10',
    car: mockCars[9],
    parkingSpotId: '5',
    parkingSpot: mockParkingSpots[4],
    startDate: new Date('2024-12-12T09:00:00'),
    endDate: new Date('2024-12-14T17:00:00'),
    status: 'completed',
    totalAmount: 24000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 28.4089,
      lng: 77.3178,
      address: 'Noida Sector 18, Uttar Pradesh'
    },
    dropoffLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'India Gate, New Delhi'
    },
    notes: 'Sightseeing tour',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-14')
  },
  {
    id: '11',
    userId: '3',
    user: mockUsers[2],
    carId: '1',
    car: mockCars[0],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date('2024-12-10T08:00:00'),
    endDate: new Date('2024-12-12T20:00:00'),
    status: 'completed',
    totalAmount: 45000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Bandra West, Mumbai, Maharashtra'
    },
    dropoffLocation: {
      lat: 19.0176,
      lng: 72.8562,
      address: 'Juhu Beach, Mumbai, Maharashtra'
    },
    notes: 'Weekend getaway',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-12')
  },
  {
    id: '12',
    userId: '4',
    user: mockUsers[3],
    carId: '3',
    car: mockCars[2],
    parkingSpotId: '2',
    parkingSpot: mockParkingSpots[1],
    startDate: new Date('2024-12-08T14:00:00'),
    endDate: new Date('2024-12-10T18:00:00'),
    status: 'completed',
    totalAmount: 70000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Koramangala, Bangalore, Karnataka'
    },
    dropoffLocation: {
      lat: 12.9698,
      lng: 77.7500,
      address: 'Whitefield, Bangalore, Karnataka'
    },
    notes: 'Business meetings',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: '13',
    userId: '5',
    user: mockUsers[4],
    carId: '5',
    car: mockCars[4],
    parkingSpotId: '2',
    parkingSpot: mockParkingSpots[1],
    startDate: new Date('2024-12-06T09:00:00'),
    endDate: new Date('2024-12-08T17:00:00'),
    status: 'completed',
    totalAmount: 24000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 23.0225,
      lng: 72.5714,
      address: 'Ahmedabad Railway Station, Gujarat'
    },
    dropoffLocation: {
      lat: 23.0395,
      lng: 72.5660,
      address: 'Mahatma Gandhi Road, Ahmedabad, Gujarat'
    },
    notes: 'Family visit',
    createdAt: new Date('2024-12-06'),
    updatedAt: new Date('2024-12-08')
  },
  {
    id: '14',
    userId: '6',
    user: mockUsers[5],
    carId: '7',
    car: mockCars[6],
    parkingSpotId: '3',
    parkingSpot: mockParkingSpots[2],
    startDate: new Date('2024-12-04T11:00:00'),
    endDate: new Date('2024-12-06T15:00:00'),
    status: 'completed',
    totalAmount: 44000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 26.9124,
      lng: 75.7873,
      address: 'Jaipur Airport, Rajasthan'
    },
    dropoffLocation: {
      lat: 26.9260,
      lng: 75.8235,
      address: 'City Palace, Jaipur, Rajasthan'
    },
    notes: 'Tourism',
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-06')
  },
  {
    id: '15',
    userId: '7',
    user: mockUsers[6],
    carId: '2',
    car: mockCars[1],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date('2024-12-02T10:00:00'),
    endDate: new Date('2024-12-04T16:00:00'),
    status: 'completed',
    totalAmount: 40000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 28.7041,
      lng: 77.1025,
      address: 'Connaught Place, New Delhi'
    },
    dropoffLocation: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Gurgaon Cyber City, Haryana'
    },
    notes: 'Corporate travel',
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-04')
  },
  {
    id: '16',
    userId: '8',
    user: mockUsers[7],
    carId: '9',
    car: mockCars[8],
    parkingSpotId: '4',
    parkingSpot: mockParkingSpots[3],
    startDate: new Date('2024-11-30T07:00:00'),
    endDate: new Date('2024-12-02T19:00:00'),
    status: 'completed',
    totalAmount: 57000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 18.5204,
      lng: 73.8567,
      address: 'Pune Railway Station, Maharashtra'
    },
    dropoffLocation: {
      lat: 18.5912,
      lng: 73.7389,
      address: 'Hinjewadi Phase 1, Pune, Maharashtra'
    },
    notes: 'Office relocation',
    createdAt: new Date('2024-11-30'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '17',
    userId: '9',
    user: mockUsers[8],
    carId: '4',
    car: mockCars[3],
    parkingSpotId: '5',
    parkingSpot: mockParkingSpots[4],
    startDate: new Date('2024-11-28T12:00:00'),
    endDate: new Date('2024-11-30T14:00:00'),
    status: 'completed',
    totalAmount: 56000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Chennai Central, Tamil Nadu'
    },
    dropoffLocation: {
      lat: 13.0475,
      lng: 80.2824,
      address: 'Marina Beach, Chennai, Tamil Nadu'
    },
    notes: 'Conference attendance',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: '18',
    userId: '10',
    user: mockUsers[9],
    carId: '6',
    car: mockCars[5],
    parkingSpotId: '3',
    parkingSpot: mockParkingSpots[2],
    startDate: new Date('2024-11-26T15:00:00'),
    endDate: new Date('2024-11-28T11:00:00'),
    status: 'completed',
    totalAmount: 36000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 17.3850,
      lng: 78.4867,
      address: 'Hyderabad Airport, Telangana'
    },
    dropoffLocation: {
      lat: 17.4065,
      lng: 78.4772,
      address: 'HITEC City, Hyderabad, Telangana'
    },
    notes: 'Client meetings',
    createdAt: new Date('2024-11-26'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: '19',
    userId: '2',
    user: mockUsers[1],
    carId: '8',
    car: mockCars[7],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date('2024-11-24T09:00:00'),
    endDate: new Date('2024-11-26T17:00:00'),
    status: 'completed',
    totalAmount: 48000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Salt Lake City, Kolkata, West Bengal'
    },
    dropoffLocation: {
      lat: 22.5744,
      lng: 88.3629,
      address: 'Park Street, Kolkata, West Bengal'
    },
    notes: 'Festival celebration',
    createdAt: new Date('2024-11-24'),
    updatedAt: new Date('2024-11-26')
  },
  {
    id: '20',
    userId: '3',
    user: mockUsers[2],
    carId: '10',
    car: mockCars[9],
    parkingSpotId: '5',
    parkingSpot: mockParkingSpots[4],
    startDate: new Date('2024-11-22T13:00:00'),
    endDate: new Date('2024-11-24T15:00:00'),
    status: 'completed',
    totalAmount: 24000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 28.4089,
      lng: 77.3178,
      address: 'Noida Sector 18, Uttar Pradesh'
    },
    dropoffLocation: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'India Gate, New Delhi'
    },
    notes: 'Shopping trip',
    createdAt: new Date('2024-11-22'),
    updatedAt: new Date('2024-11-24')
  },
  {
    id: '21',
    userId: '4',
    user: mockUsers[3],
    carId: '1',
    car: mockCars[0],
    parkingSpotId: '1',
    parkingSpot: mockParkingSpots[0],
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'confirmed',
    totalAmount: 45000,
    paymentStatus: 'paid',
    pickupLocation: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Bandra West, Mumbai, Maharashtra'
    },
    dropoffLocation: {
      lat: 19.0176,
      lng: 72.8562,
      address: 'Juhu Beach, Mumbai, Maharashtra'
    },
    notes: 'Weekend getaway',
    createdAt: new Date(), // Today
    updatedAt: new Date()
  },
  {
    id: '22',
    userId: '5',
    user: mockUsers[4],
    carId: '3',
    car: mockCars[2],
    parkingSpotId: '2',
    parkingSpot: mockParkingSpots[1],
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'confirmed',
    totalAmount: 70000,
    paymentStatus: 'pending',
    pickupLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Koramangala, Bangalore, Karnataka'
    },
    dropoffLocation: {
      lat: 12.9698,
      lng: 77.7500,
      address: 'Whitefield, Bangalore, Karnataka'
    },
    notes: 'Business trip',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
]

// Dynamic calculations - all stats are now calculated from actual data in components
