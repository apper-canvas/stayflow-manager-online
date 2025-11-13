import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import reservationService from "@/services/api/reservationService";
import guestService from "@/services/api/guestService";
import roomService from "@/services/api/roomService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import SearchableSelect from "@/components/atoms/SearchableSelect";
import Input from "@/components/atoms/Input";

const EditReservationModal = ({ reservation, isOpen, onClose, onUpdate }) => {
const [formData, setFormData] = useState({
    Name: '',
    guestId_c: '',
    roomId_c: '',
    checkInDate_c: '',
    checkOutDate_c: '',
    adults_c: 1,
    children_c: 0,
    totalAmount_c: 0,
    specialRequests_c: '',
    status_c: 'pending',
    paymentStatus_c: 'Unpaid'
  });
  
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      const [guestsData, roomsData] = await Promise.all([
        guestService.getAll(),
        roomService.getAll()
      ]);
      
      setGuests(guestsData || []);
      setRooms(roomsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load guests and rooms data');
    }
  };

// Helper function to format date for HTML date input
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      // Return YYYY-MM-DD format for HTML date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };

useEffect(() => {
    if (reservation && isOpen) {
      loadData();
      
      setFormData({
        Name: reservation.Name || `Reservation ${reservation.Id}`,
        guestId_c: reservation.guestId_c?.Id || reservation.guestId_c || '',
        roomId_c: reservation.roomId_c?.Id || reservation.roomId_c || '',
        checkInDate_c: formatDateForInput(reservation.checkInDate_c || reservation.checkInDate),
        checkOutDate_c: formatDateForInput(reservation.checkOutDate_c || reservation.checkOutDate),
        adults_c: reservation.adults_c || reservation.adults || 1,
        children_c: reservation.children_c || reservation.children || 0,
        totalAmount_c: reservation.totalAmount_c || reservation.totalAmount || 0,
        specialRequests_c: reservation.specialRequests_c || reservation.specialRequests || '',
        status_c: reservation.status_c || reservation.status || 'pending',
        paymentStatus_c: reservation.paymentStatus_c || reservation.paymentStatus || 'Unpaid'
      });
    }
  }, [reservation, isOpen]);
const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
if (!formData.guestId_c) {
      newErrors.guestId_c = 'Please select a guest';
    }
    
    if (!formData.roomId_c) {
      newErrors.roomId_c = 'Please select a room';
    }
    
if (!formData.checkInDate_c) {
      newErrors.checkInDate_c = 'Check-in date is required';
    }
    
    if (!formData.checkOutDate_c) {
      newErrors.checkOutDate_c = 'Check-out date is required';
    }
    
if (formData.checkInDate_c && formData.checkOutDate_c) {
      if (new Date(formData.checkInDate_c) >= new Date(formData.checkOutDate_c)) {
        newErrors.checkOutDate_c = 'Check-out date must be after check-in date';
      }
    }
    
if (formData.adults_c < 1) {
      newErrors.adults_c = 'At least 1 adult is required';
    }
    
    if (formData.totalAmount_c < 0) {
      newErrors.totalAmount_c = 'Total amount cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
const updatedReservation = await reservationService.update(reservation.Id, {
        Name: formData.Name,
        guestId_c: parseInt(formData.guestId_c),
        roomId_c: parseInt(formData.roomId_c),
        checkInDate_c: formData.checkInDate_c,
        checkOutDate_c: formData.checkOutDate_c,
        adults_c: parseInt(formData.adults_c),
        children_c: parseInt(formData.children_c),
        totalAmount_c: parseFloat(formData.totalAmount_c),
        specialRequests_c: formData.specialRequests_c,
        status_c: formData.status_c,
        paymentStatus_c: formData.paymentStatus_c
      });
if (updatedReservation) {
        toast.success('Reservation updated successfully');
        // Pass the updated reservation to trigger refresh
        onUpdate(updatedReservation);
        onClose();
      } else {
        toast.error('Update appeared successful but no data returned');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
setFormData({
      guestId_c: '',
      roomId_c: '',
      checkInDate_c: '',
      checkOutDate_c: '',
      adults_c: 1,
      children_c: 0,
      totalAmount_c: 0,
      specialRequests_c: '',
      status_c: 'pending',
      paymentStatus_c: 'Unpaid'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Reservation</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
<form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Guest" error={errors.guestId_c} required>
              <SearchableSelect
                placeholder="Select a guest..."
                value={formData.guestId_c}
                onChange={(e) => handleInputChange('guestId_c', e.target.value)}
                options={guests.map(guest => ({
                  value: guest.Id,
                  label: `${guest.firstName_c || guest.Name} ${guest.lastName_c || ''} - ${guest.email_c || guest.email}`,
                  guest: guest
                }))}
                searchFunction={(options, searchTerm) => {
                  const searchLower = searchTerm.toLowerCase();
                  return options.filter(option => {
                    const guest = option.guest;
                    return (
                      (guest.firstName_c || guest.Name || '')?.toLowerCase().includes(searchLower) ||
                      (guest.lastName_c || '')?.toLowerCase().includes(searchLower) ||
                      (guest.email_c || guest.email || '')?.toLowerCase().includes(searchLower)
                    );
                  });
                }}
                className={errors.guestId_c ? "border-red-500" : ""}
              />
            </FormField>
            
<FormField label="Status" required>
              <Select
                value={formData.status_c}
                onChange={(e) => handleInputChange('status_c', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checkedin">Checked In</option>
                <option value="checkedout">Checked Out</option>
                <option value="cancelled">Cancelled</option>
                <option value="noshow">No Show</option>
              </Select>
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Room" error={errors.roomId_c} required>
              <SearchableSelect
                placeholder="Select a room..."
                value={formData.roomId_c}
                onChange={(e) => handleInputChange('roomId_c', e.target.value)}
                options={rooms.map(room => ({
                  value: room.Id,
                  label: `Room ${room.number_c || room.number} - ${room.type_c || room.type} ($${room.baseRate_c || room.pricePerNight}/night)`,
                  room: room
                }))}
                searchFunction={(options, searchTerm) => {
                  const searchLower = searchTerm.toLowerCase();
                  return options.filter(option => {
                    const room = option.room;
                    return (
                      (room.number_c || room.number || '')?.toString().toLowerCase().includes(searchLower) ||
                      (room.type_c || room.type || '')?.toLowerCase().includes(searchLower) ||
                      (room.baseRate_c || room.pricePerNight || '')?.toString().includes(searchTerm)
                    );
                  });
                }}
                className={errors.roomId_c ? "border-red-500" : ""}
              />
            </FormField>
            
            <FormField label="Payment Status" required>
              <Select
                value={formData.paymentStatus_c}
                onChange={(e) => handleInputChange('paymentStatus_c', e.target.value)}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </Select>
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Check-in Date" error={errors.checkInDate_c} required>
              <Input
                type="date"
                value={formData.checkInDate_c}
                onChange={(e) => handleInputChange('checkInDate_c', e.target.value)}
                className={errors.checkInDate_c ? 'border-red-500' : ''}
              />
            </FormField>
<FormField label="Check-out Date" error={errors.checkOutDate_c} required>
              <Input
                type="date"
                value={formData.checkOutDate_c}
                onChange={(e) => handleInputChange('checkOutDate_c', e.target.value)}
                className={errors.checkOutDate_c ? 'border-red-500' : ''}
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<FormField label="Adults" error={errors.adults_c} required>
              <Input
                type="number"
                min="1"
                value={formData.adults_c}
                onChange={(e) => handleInputChange('adults_c', parseInt(e.target.value) || 1)}
                className={errors.adults_c ? 'border-red-500' : ''}
              />
            </FormField>
            
<FormField label="Children">
              <Input
                type="number"
                min="0"
                value={formData.children_c}
                onChange={(e) => handleInputChange('children_c', parseInt(e.target.value) || 0)}
              />
            </FormField>
            
<FormField label="Total Amount" error={errors.totalAmount_c}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalAmount_c}
                onChange={(e) => handleInputChange('totalAmount_c', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.totalAmount_c ? 'border-red-500' : ''}
              />
            </FormField>
          </div>
          
          <FormField label="Special Requests">
<textarea
              value={formData.specialRequests_c}
              onChange={(e) => handleInputChange('specialRequests_c', e.target.value)}
              placeholder="Any special requests or notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-150 resize-none"
            />
          </FormField>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  Update Reservation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;