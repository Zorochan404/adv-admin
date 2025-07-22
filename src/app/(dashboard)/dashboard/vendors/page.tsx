"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { deleteVendor, getVendors, VendorFormData } from "./api";

// Mock vendor data


export default function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<VendorFormData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<VendorFormData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      const vendors = await getVendors();
      console.log(vendors);
      setVendors(vendors);
      setIsLoading(false);
    };
    fetchVendors();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-lg font-medium">Loading vendors...</span>
      </div>
    );
  }

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.number.toString().includes(searchTerm) ||
    (vendor.id && vendor.id.toString().includes(searchTerm))
  );

  // Handlers
  const handleDeleteVendor = (id: number) => {
    deleteVendor(id);
    router.refresh();
    toast.success("Vendor deleted successfully!");

  };

  const handleAddVendor = (vendor: VendorFormData) => {
    setVendors((prev) => [...prev, { ...vendor, id: Date.now() }]);
    setIsAddDialogOpen(false);
    toast.success("Vendor added successfully!");
  };

  const handleEditVendor = (vendor: VendorFormData) => {
  
    setIsEditDialogOpen(false);
    toast.success("Vendor updated successfully!");
  };

  return (


    
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors Management</h1>
          <p className="text-gray-600 mt-2">Manage your vendors</p>
        </div>
        <Button onClick={() => router.push('/dashboard/vendors/add')}>
          <Plus className="h-4 w-4 mr-2" /> Add Vendor
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors List</CardTitle>
          <CardDescription>View and manage all vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search by name, email, or phone or id..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Vendors Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor : VendorFormData) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.id?.toString()}</TableCell>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.number}</TableCell>
                    <TableCell>{vendor.locality}</TableCell>
               
                    <TableCell>
                      <div className="flex gap-2">
                        {/* View Vendor */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedVendor(vendor)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Vendor Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {vendor.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                            <div>
                                <span className="font-semibold">ID:</span> {vendor.id}
                              </div>
                              <div>
                                <span className="font-semibold">Name:</span> {vendor.name}
                              </div>
                              <div>
                                <span className="font-semibold">Age:</span> {vendor.age ?? "-"}
                              </div>
                              <div>
                                <span className="font-semibold">Email:</span> {vendor.email}
                              </div>
                              <div>
                                <span className="font-semibold">Phone:</span> {vendor.number}
                              </div>
                              <div>
                                <span className="font-semibold">Address Location:</span> {vendor.locality}
                              </div>
                              <div>
                                <span className="font-semibold">State:</span> {vendor.state}
                              </div>
                              <div>
                                <span className="font-semibold">Country:</span> {vendor.country}
                              </div>
                              <div>
                                <span className="font-semibold">Pincode:</span> {vendor.pincode}
                              </div>
                              <div>
                                <span className="font-semibold">Aadhar Number:</span> {vendor.aadharNumber}
                              </div>
                              <div>
                                <span className="font-semibold">DL Number:</span> {vendor.dlNumber}
                              </div>
                              <div>
                                <span className="font-semibold">Passport Number:</span> {vendor.passportNumber}
                              </div>
                              <div>
                                <span className="font-semibold">Role:</span> {vendor.role}
                              </div>
                              <div>
                                <span className="font-semibold">Is Verified:</span>{" "}
                                {vendor.isverified ? (
                                  <span className="text-green-600 font-semibold">Yes</span>
                                ) : (
                                  <span className="text-red-600 font-semibold">No</span>
                                )}
                              </div>
                              
                              {/* Images */}
                              {vendor.avatar && (
                                <div>
                                  <span className="font-semibold">Avatar:</span>
                                  <div className="mt-1">
                                    <a href={vendor.avatar} target="_blank" rel="noopener noreferrer">
                                      <img src={vendor.avatar} alt="Avatar" className="w-24 h-24 object-cover rounded border" />
                                    </a>
                                  </div>
                                </div>
                              )}
                              {vendor.aadharimg && (
                                <div>
                                  <span className="font-semibold">Aadhar Image:</span>
                                  <div className="mt-1">
                                    <a href={vendor.aadharimg} target="_blank" rel="noopener noreferrer">
                                      <img src={vendor.aadharimg} alt="Aadhar" className="w-24 h-16 object-cover rounded border" />
                                    </a>
                                  </div>
                                </div>
                              )}
                              {vendor.dlimg && (
                                <div>
                                  <span className="font-semibold">DL Image:</span>
                                  <div className="mt-1">
                                    <a href={vendor.dlimg} target="_blank" rel="noopener noreferrer">
                                      <img src={vendor.dlimg} alt="DL" className="w-24 h-16 object-cover rounded border" />
                                    </a>
                                  </div>
                                </div>
                              )}
                              {vendor.passportimg && (
                                <div>
                                  <span className="font-semibold">Passport Image:</span>
                                  <div className="mt-1">
                                    <a href={vendor.passportimg} target="_blank" rel="noopener noreferrer">
                                      <img src={vendor.passportimg} alt="Passport" className="w-24 h-16 object-cover rounded border" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {/* Edit Vendor */}
                        
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVendor(vendor);
                                router.push(`/dashboard/vendors/edit/${vendor.id}`);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                         
                         
                        {/* Delete Vendor */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVendor(vendor.id!)}
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

      {/* Add Vendor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm
            onSubmit={handleAddVendor}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Vendor Form Component
function VendorForm({ initial, onSubmit, onCancel }: {
  initial?: VendorFormData | null,
  onSubmit: (vendor: VendorFormData) => void,
  onCancel: () => void
}) {
 
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ ...initial! });
      }}
      className="space-y-4"
    >
      <div>
        <Label>Name</Label>
        <Input
          value={initial?.name}
          onChange={e => onSubmit({ ...initial!, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={initial?.email}
          onChange={e => onSubmit({ ...initial!, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Phone</Label>
        <Input
          value={initial?.number}
          onChange={e => onSubmit({ ...initial!, number: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={initial?.locality}
          onChange={e => onSubmit({ ...initial!, locality: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit" className="flex-1">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
}
