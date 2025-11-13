import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import reservationService from '@/services/api/reservationService';
import guestService from '@/services/api/guestService';
import roomService from '@/services/api/roomService';

const EditReservationModal = ({ reservation, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    totalAmount: 0,
    specialRequests: '',
    status: 'pending',
    guestId: null,
    roomId: null
  });
  
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reservation && isOpen) {
      setFormData({
        guestName: reservation.guestName_c || reservation.guestName || '',
        roomNumber: reservation.roomNumber_c || reservation.roomNumber || '',
        roomType: reservation.roomType_c || reservation.roomType || '',
        checkInDate: reservation.checkInDate_c || reservation.checkInDate || '',
        checkOutDate: reservation.checkOutDate_c || reservation.checkOutDate || '',
        adults: reservation.adults_c || reservation.adults || 1,
        children: reservation.children_c || reservation.children || 0,
        totalAmount: reservation.totalAmount_c || reservation.totalAmount || 0,
        specialRequests: reservation.specialRequests_c || reservation.specialRequests || '',
        status: reservation.status_c || reservation.status || 'pending',
        guestId: reservation.guestId_c || reservation.guestId || null,
        roomId: reservation.roomId_c || reservation.roomId || null
      });
      
      loadData();
    }
  }, [reservation, isOpen]);

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
    }
  };

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
    
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }
    
    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }
    
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }
    
    if (formData.checkInDate && formData.checkOutDate) {
      if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
        newErrors.checkOutDate = 'Check-out date must be after check-in date';
      }
    }
    
    if (formData.adults < 1) {
      newErrors.adults = 'At least 1 adult is required';
    }
    
    if (formData.totalAmount < 0) {
      newErrors.totalAmount = 'Total amount cannot be negative';
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
        guestName: formData.guestName,
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        adults: formData.adults,
        children: formData.children,
        totalAmount: formData.totalAmount,
        specialRequests: formData.specialRequests,
        status: formData.status,
        guestId: formData.guestId,
        roomId: formData.roomId
      });
      
      if (updatedReservation) {
        toast.success('Reservation updated successfully');
        onUpdate(updatedReservation);
        onClose();
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
      guestName: '',
      roomNumber: '',
      roomType: '',
      checkInDate: '',
      checkOutDate: '',
      adults: 1,
      children: 0,
      totalAmount: 0,
      specialRequests: '',
      status: 'pending',
      guestId: null,
      roomId: null
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
            <FormField label="Guest Name" error={errors.guestName} required>
              <Input
                type="text"
                value={formData.guestName}
                onChange={(e) => handleInputChange('guestName', e.target.value)}
                placeholder="Enter guest name"
                className={errors.guestName ? 'border-red-500' : ''}
              />
            </FormField>
            
            <FormField label="Status" required>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
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
            <FormField label="Room Number" error={errors.roomNumber} required>
              <Input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                placeholder="Enter room number"
                className={errors.roomNumber ? 'border-red-500' : ''}
              />
            </FormField>
            
            <FormField label="Room Type">
              <Input
                type="text"
                value={formData.roomType}
                onChange={(e) => handleInputChange('roomType', e.target.value)}
                placeholder="Enter room type"
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Check-in Date" error={errors.checkInDate} required>
              <Input
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                className={errors.checkInDate ? 'border-red-500' : ''}
              />
            </FormField>
            
            <FormField label="Check-out Date" error={errors.checkOutDate} required>
              <Input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                className={errors.checkOutDate ? 'border-red-500' : ''}
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Adults" error={errors.adults} required>
              <Input
                type="number"
                min="1"
                value={formData.adults}
                onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
                className={errors.adults ? 'border-red-500' : ''}
              />
            </FormField>
            
            <FormField label="Children">
              <Input
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
              />
            </FormField>
            
            <FormField label="Total Amount" error={errors.totalAmount}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.totalAmount ? 'border-red-500' : ''}
              />
            </FormField>
          </div>
          
          <FormField label="Special Requests">
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
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