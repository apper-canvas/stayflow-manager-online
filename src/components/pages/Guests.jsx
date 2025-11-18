import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { format } from "date-fns";
import { toast } from "react-toastify";
import reservationService from "@/services/api/reservationService";
import guestService from "@/services/api/guestService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import GuestProfileEditor from "@/components/organisms/GuestProfileEditor";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [reservationData, setReservationData] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [deletingGuest, setDeletingGuest] = useState(null);
const loadGuests = async () => {
  try {
    setLoading(true);
    setError("");
    const data = await guestService.getAll();
    setGuests(data);
  } catch (err) {
    setError(err.message || "Failed to load guests");
  } finally {
    setLoading(false);
  }
};

const loadReservations = async (guestId) => {
  try {
    setReservationLoading(true);
    const response = await reservationService.getAll();
    const guestReservations = response.filter(res => {
      const guestLookupId = res.guestId_c?.Id || res.guestId_c;
      return guestLookupId === guestId || res.guestName_c?.Id === guestId;
    });
    setReservationData(guestReservations);
  } catch (err) {
    console.error("Error loading reservations:", err);
    setReservationData([]);
  } finally {
    setReservationLoading(false);
  }
};

const handleEditGuest = (guest) => {
  setEditingGuest({ ...guest });
  setIsEditorOpen(true);
};

  const handleAddGuest = () => {
setEditingGuest({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      nationality: '',
      dateOfBirth: '',
      idType: '',
      idNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      allergies: [],
      stayNotes: '',
      guestId: '',
      guestType: '',
      companyName: '',
      gstNumberTaxId: '',
      designationJobTitle: ''
    });
    setIsEditorOpen(true);
  };

const handleCloseEditor = () => {
  setIsEditorOpen(false);
  setEditingGuest(null);
  setReservationData([]);
};
const handleSaveGuest = async (updatedGuest) => {
    try {
      if (updatedGuest.Id) {
        // Update existing guest
        await guestService.update(updatedGuest.Id, updatedGuest);
        toast.success("Guest profile updated successfully");
      } else {
        // Create new guest
        await guestService.create(updatedGuest);
        toast.success("Guest created successfully");
      }
      await loadGuests();
      handleCloseEditor();
    } catch (error) {
      const action = updatedGuest.Id ? "update" : "create";
      toast.error(error.message || `Failed to ${action} guest`);
    }
};

  const handleDeleteGuest = async (guest, event) => {
    // Prevent card selection when clicking delete
    event.stopPropagation();
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${guest.firstName} ${guest.lastName}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      setDeletingGuest(guest.Id);
      await guestService.delete(guest.Id);
      toast.success("Guest deleted successfully");
      
      // Clear selected guest if it was the deleted one
      if (selectedGuest?.Id === guest.Id) {
        setSelectedGuest(null);
      }
      
      // Reload guests list
      await loadGuests();
    } catch (error) {
      toast.error(error.message || "Failed to delete guest");
    } finally {
      setDeletingGuest(null);
    }
  };
useEffect(() => {
  loadGuests();
}, []);

useEffect(() => {
  if (selectedGuest?.Id) {
    loadReservations(selectedGuest.Id);
  } else {
    setReservationData([]);
  }
}, [selectedGuest]);

const filteredGuests = guests.filter(guest =>
    (guest.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guest.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guest.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (guest.phone || '').includes(searchQuery)
  );

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadGuests} />;

  return (
    <div className="p-6 space-y-6">
    {/* Header */}
    <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Guests</h1>
            <p className="text-gray-600 mt-1">Manage guest profiles and information</p>
        </div>
        <Button onClick={handleAddGuest}>
            <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />Add Guest
                    </Button>
    </div>
    {/* Search and Stats */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
            <SearchBar
                placeholder="Search guests by name, email, or phone..."
                onSearch={setSearchQuery}
                showButton={false} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{guests.length}</div>
                <div className="text-sm text-gray-600">Total Guests</div>
            </div>
        </div>
    </div>
    {/* Guests Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            {filteredGuests.length === 0 ? <Empty
                title="No guests found"
                description="No guests match your search criteria."
                icon="Users" /> : <div className="space-y-4">
                {filteredGuests.map(guest => <Card
                    key={guest.Id}
                    className={`cursor-pointer transition-all duration-200 ${selectedGuest?.Id === guest.Id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedGuest(guest)}>
                    <CardContent className="p-4">
<div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <ApperIcon name="User" className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {guest.firstName} {guest.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{guest.email}</p>
                                    <p className="text-sm text-gray-500">{guest.phone}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditGuest(guest);
                                        }}
                                        disabled={deletingGuest === guest.Id}
                                    >
                                        <ApperIcon name="Edit" className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 opacity-70 hover:opacity-100 hover:text-error hover:border-error transition-all"
                                        onClick={(e) => handleDeleteGuest(guest, e)}
                                        disabled={deletingGuest === guest.Id}
                                    >
                                        {deletingGuest === guest.Id ? (
                                            <ApperIcon name="Loader2" className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <ApperIcon name="Trash2" className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                                <div className="text-right">
                                    {guest.vipStatus && <Badge variant="warning" className="mb-1">
                                        <ApperIcon name="Crown" className="h-3 w-3 mr-1" />VIP
                                    </Badge>}
                                    <p className="text-sm text-gray-500">
                                        {guest.stayHistory.length} stays
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>)}
            </div>}
        </div>
        {/* Guest Details Sidebar */}
        <div className="lg:col-span-1">
            {selectedGuest ? <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ApperIcon name="User" className="h-5 w-5" />Guest Details
                                        </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                                <span>{selectedGuest.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                                <span>{selectedGuest.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400" />
                                <span>{selectedGuest.address.city}, {selectedGuest.address.country}</span>
                            </div>
                        </div>
                    </div>
                    {/* ID Information */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Identification</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span>{selectedGuest.idType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Number:</span>
                                <span>{selectedGuest.idNumber}</span>
                            </div>
                        </div>
                    </div>
                    {/* Preferences */}
                    {selectedGuest.preferences.length > 0 && <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedGuest.preferences.map(
                                (pref, index) => <Badge key={index} variant="secondary" className="text-xs">
                                    {pref}
                                </Badge>
                            )}
                        </div>
                    </div>}
                    {/* Stay History */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Stay History</h4>
                        {selectedGuest.stayHistory.length === 0 ? <p className="text-sm text-gray-500">No previous stays</p> : <div className="space-y-2">
                            {selectedGuest.stayHistory.slice(0, 3).map(
                                (stay, index) => <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                    <div className="font-medium">Room {stay.roomNumber}</div>
                                    <div className="text-sm text-gray-500">
                                        {stay?.checkIn && !isNaN(new Date(stay.checkIn).getTime()) ? format(new Date(stay.checkIn), "MMM dd, yyyy") : "Invalid date"}- 
                                                                    {stay?.checkOut && !isNaN(new Date(stay.checkOut).getTime()) ? format(new Date(stay.checkOut), "MMM dd, yyyy") : "Invalid date"}
                                    </div>
                                </div>
                            )}
                            {selectedGuest.stayHistory.length > 3 && <p className="text-xs text-gray-500 text-center">+{selectedGuest.stayHistory.length - 3}more stays
                                                        </p>}
                        </div>}
                        {/* Reservations */}
                        {reservationLoading ? <div className="py-4 text-center">
                            <p className="text-sm text-gray-500">Loading reservations...</p>
                        </div> : reservationData.length > 0 ? <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Reservation Details</h4>
                            <div className="space-y-4">
                                {reservationData.map((reservation, index) => <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                                    {/* Reservation ID and Nights */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Reservation ID</p>
                                            <p className="text-sm font-medium text-gray-900">{reservation.reservation_id_c || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Number of Nights</p>
                                            <p className="text-sm font-medium text-gray-900">{reservation.number_of_nights_c || 0}</p>
                                        </div>
                                    </div>
                                    {/* Tax and Service Charge */}
                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-600">Tax Percentage</p>
                                            <p className="text-sm font-medium text-gray-900">{reservation.tax_percentage_c || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Service Charge %</p>
                                            <p className="text-sm font-medium text-gray-900">{reservation.service_charge_percentage_c || "0"}%</p>
                                        </div>
                                    </div>
                                    {/* Discount Information */}
                                    <div className="pt-2 border-t border-gray-200 space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-600">Discount Type</p>
                                            <p className="text-sm font-medium text-gray-900">{reservation.discount_type_c || "None"}</p>
                                        </div>
                                        {reservation.discount_type_c !== "None" && <>
                                            <div>
                                                <p className="text-xs text-gray-600">Discount Value</p>
                                                <p className="text-sm font-medium text-gray-900">{reservation.discount_value_c || "0"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Discount Reason</p>
                                                <p className="text-sm text-gray-700">{reservation.discount_reason_c || "No reason provided"}</p>
                                            </div>
                                        </>}
                                    </div>
                                    {/* Services */}
                                    {reservation.service_name_c && <div className="pt-2 border-t border-gray-200 space-y-2 bg-white rounded p-2">
                                        <p className="text-xs font-semibold text-gray-600">Service Details</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <p className="text-xs text-gray-600">Service</p>
                                                <p className="text-sm font-medium text-gray-900">{reservation.service_name_c}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Quantity</p>
                                                <p className="text-sm font-medium text-gray-900">{reservation.quantity_c || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Price/Unit</p>
                                                <p className="text-sm font-medium text-gray-900">${reservation.price_per_unit_c || "0"}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-600">Total</p>
                                            <p className="text-sm font-semibold text-primary">${reservation.total_c || "0"}</p>
                                        </div>
                                    </div>}
                                </div>)}
                            </div>
                        </div> : <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Reservation Details</h4>
                            <p className="text-sm text-gray-500">No reservations found for this guest</p>
                        </div>}
                        {/* Actions */}
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                            <Button
                                className="w-full"
                                size="sm"
                                onClick={() => handleEditGuest(selectedGuest)}>
                                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />Edit Guest
                                                  </Button>
                            <Button className="w-full" variant="outline" size="sm">
                                <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />New Reservation
                                                  </Button>
                        </div>
                    </div></CardContent>
            </Card> : <Card>
                <CardContent className="p-8 text-center">
                    <ApperIcon name="Users" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Select a guest to view details</p>
                </CardContent>
            </Card>}
        </div>
    </div>
    {isEditorOpen && editingGuest && <GuestProfileEditor guest={editingGuest} onSave={handleSaveGuest} onClose={handleCloseEditor} />}
</div>
  );
};

export default Guests;