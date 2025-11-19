import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card } from "@/components/atoms/Card";
import reservationService from "@/services/api/reservationService";
import guestService from "@/services/api/guestService";
import roomService from "@/services/api/roomService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Guests from "@/components/pages/Guests";
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
    paymentStatus_c: 'Unpaid',
    reservation_id_c: '',
    number_of_nights_c: 0,
    tax_percentage_c: '5%',
    service_charge_percentage_c: 10,
    discount_type_c: 'None',
    discount_value_c: 0,
    discount_reason_c: '',
    services: []
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
        paymentStatus_c: reservation.paymentStatus_c || reservation.paymentStatus || 'Unpaid',
        reservation_id_c: reservation.reservation_id_c || '',
        number_of_nights_c: reservation.number_of_nights_c || 0,
        tax_percentage_c: reservation.tax_percentage_c || '5%',
        service_charge_percentage_c: reservation.service_charge_percentage_c || 10,
        discount_type_c: reservation.discount_type_c || 'None',
        discount_value_c: reservation.discount_value_c || 0,
        discount_reason_c: reservation.discount_reason_c || '',
        services: []
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

  const handleAddService = () => {
    const newService = {
      id: Date.now(),
      serviceName: "",
      quantity: 1,
      pricePerUnit: 0,
      total: 0
    };
    setFormData(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const handleRemoveService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const handleServiceChange = (serviceId, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => {
        if (s.id === serviceId) {
          const updated = { ...s, [field]: value };
          if (field === 'quantity' || field === 'pricePerUnit') {
            updated.total = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.pricePerUnit) || 0);
          }
          return updated;
        }
        return s;
      })
})
    }));
  };

  const validateForm = () => {

  // Calculate booking summary totals
  useEffect(() => {
    const roomTotal = formData.totalAmount_c || 0;
    
    // Calculate tax
    const taxPercentage = parseInt(formData.tax_percentage_c) || 5;
    const tax = roomTotal * (taxPercentage / 100);
    
    // Calculate service charge
    const serviceChargePercentage = parseFloat(formData.service_charge_percentage_c) || 0;
    const serviceCharge = roomTotal * (serviceChargePercentage / 100);
    
    // Calculate additional services total
    const additionalServicesTotal = formData.services.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
    
    // Calculate discount
    const discount = parseFloat(formData.discount_value_c) || 0;
    
    // Calculate final total
    const finalTotal = roomTotal + tax + serviceCharge + additionalServicesTotal - discount;
    
    // Store the final calculated total
    setFormData(prev => ({
      ...prev,
      calculatedTotal: Math.max(0, finalTotal) // Ensure total is not negative
    }));
  }, [formData.totalAmount_c, formData.tax_percentage_c, formData.service_charge_percentage_c, formData.services, formData.discount_value_c]);
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

    if (formData.service_charge_percentage_c < 0) {
      newErrors.service_charge_percentage_c = 'Service charge cannot be negative';
    }

    if (formData.discount_type_c !== 'None' && formData.discount_value_c <= 0) {
      newErrors.discount_value_c = 'Discount value must be greater than 0';
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
        paymentStatus_c: formData.paymentStatus_c,
        reservation_id_c: formData.reservation_id_c,
        number_of_nights_c: parseInt(formData.number_of_nights_c),
        tax_percentage_c: formData.tax_percentage_c,
        service_charge_percentage_c: parseFloat(formData.service_charge_percentage_c),
        discount_type_c: formData.discount_type_c,
        discount_value_c: parseFloat(formData.discount_value_c),
        discount_reason_c: formData.discount_reason_c
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
        paymentStatus_c: 'Unpaid',
        reservation_id_c: '',
        number_of_nights_c: 0,
        tax_percentage_c: '5%',
        service_charge_percentage_c: 10,
        discount_type_c: 'None',
        discount_value_c: 0,
        discount_reason_c: '',
        services: []
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

          {/* Reservation ID */}
          <FormField label="Reservation ID" error={errors.reservation_id_c}>
            <Input
              type="text"
              value={formData.reservation_id_c || ''}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated format: RES-YYYY-XXXX</p>
          </FormField>

          {/* Dates & Occupancy */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stay Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date *
                </label>
                <Input
                  type="date"
                  value={formData.checkInDate_c}
                  onChange={(e) => handleInputChange('checkInDate_c', e.target.value)}
                  className={errors.checkInDate_c ? 'border-red-500' : ''}
                />
                {errors.checkInDate_c && <p className="text-red-500 text-sm mt-1">{errors.checkInDate_c}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date *
                </label>
                <Input
                  type="date"
                  value={formData.checkOutDate_c}
                  onChange={(e) => handleInputChange('checkOutDate_c', e.target.value)}
                  className={errors.checkOutDate_c ? 'border-red-500' : ''}
                />
                {errors.checkOutDate_c && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate_c}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults *
                </label>
                <Select
                  value={formData.adults_c}
                  onChange={(e) => handleInputChange('adults_c', e.target.value)}
                  className={errors.adults_c ? 'border-red-500' : ''}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </Select>
                {errors.adults_c && <p className="text-red-500 text-sm mt-1">{errors.adults_c}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <Select
                  value={formData.children_c}
                  onChange={(e) => handleInputChange('children_c', e.target.value)}
                  className={errors.children_c ? 'border-red-500' : ''}
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </Select>
                {errors.children_c && <p className="text-red-500 text-sm mt-1">{errors.children_c}</p>}
              </div>
            </div>
          </Card>

          {/* Number of Nights */}
          <FormField label="Number of Nights" error={errors.number_of_nights_c}>
            <Input
              type="number"
              value={formData.number_of_nights_c}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Auto-calculated from check-in and check-out dates</p>
          </FormField>

          {/* Tax & Service Charges Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Tax Percentage"
              error={errors.tax_percentage_c}
            >
              {formData.tax_percentage_c === 'Custom' ? (
                <Input
                  type="number"
                  placeholder="Enter custom tax %"
                  value={formData.tax_percentage_c === 'Custom' ? '' : formData.tax_percentage_c}
                  onChange={(e) => handleInputChange('tax_percentage_c', parseFloat(e.target.value) || 0)}
                  step="0.01"
                />
              ) : (
                <Select
                  value={formData.tax_percentage_c}
                  onChange={(e) => handleInputChange('tax_percentage_c', e.target.value)}
                >
                  <option value="">Select Tax Percentage</option>
                  <option value="5%">5%</option>
                  <option value="10%">10%</option>
                  <option value="12%">12%</option>
                  <option value="18%">18%</option>
                  <option value="Custom">Custom</option>
                </Select>
              )}
            </FormField>

            <FormField
              label="Service Charge Percentage"
              error={errors.service_charge_percentage_c}
            >
              <Input
                type="number"
                placeholder="Enter service charge %"
                value={formData.service_charge_percentage_c}
                onChange={(e) => handleInputChange('service_charge_percentage_c', parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 10%</p>
            </FormField>
          </div>

          {/* Discount Section */}
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Discount Type"
                error={errors.discount_type_c}
              >
                <Select
                  value={formData.discount_type_c}
                  onChange={(e) => handleInputChange('discount_type_c', e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </Select>
              </FormField>

              {formData.discount_type_c !== 'None' && (
                <FormField
                  label="Discount Value"
                  error={errors.discount_value_c}
                >
                  <Input
                    type="number"
                    placeholder="Enter discount value"
                    value={formData.discount_value_c}
                    onChange={(e) => handleInputChange('discount_value_c', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                  />
                </FormField>
              )}

              {formData.discount_type_c !== 'None' && (
                <FormField label="Discount Reason">
                  <Input
                    type="text"
                    placeholder="Enter discount reason"
                    value={formData.discount_reason_c}
                    onChange={(e) => handleInputChange('discount_reason_c', e.target.value)}
                  />
                </FormField>
              )}
            </div>
          </Card>

          {/* Additional Services Section */}
          <Card className="p-6 bg-amber-50 border border-amber-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Additional Services</h3>
              <Button
                type="button"
                onClick={handleAddService}
                className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-amber-600"
              >
                <ApperIcon name="Plus" size={18} />
                Add Service
              </Button>
            </div>

            {formData.services.length > 0 ? (
              <div className="space-y-3">
                {formData.services.map((service, idx) => (
                  <div key={service.id} className="flex gap-3 items-end bg-white p-4 rounded-lg border border-amber-200">
                    <FormField label="Service Name" className="flex-1">
                      <Select
                        value={service.serviceName}
                        onChange={(e) => handleServiceChange(service.id, 'serviceName', e.target.value)}
                      >
                        <option value="">Select Service</option>
                        <option value="Minibar">Minibar</option>
                        <option value="Laundry">Laundry</option>
                        <option value="Room Service">Room Service</option>
                        <option value="Spa">Spa</option>
                        <option value="Parking">Parking</option>
                        <option value="Extra Bed">Extra Bed</option>
                        <option value="Airport Transfer">Airport Transfer</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormField>
                    <FormField label="Quantity" className="w-20">
                      <Input
                        type="number"
                        value={service.quantity}
                        onChange={(e) => handleServiceChange(service.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </FormField>
                    <FormField label="Price/Unit" className="w-24">
                      <Input
                        type="number"
                        value={service.pricePerUnit}
                        onChange={(e) => handleServiceChange(service.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                      />
                    </FormField>
                    <FormField label="Total" className="w-24">
                      <Input
                        type="number"
                        value={service.total}
                        readOnly
                        disabled
                        className="bg-gray-50"
                      />
                    </FormField>
                    <Button
                      type="button"
                      onClick={() => handleRemoveService(service.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      <ApperIcon name="Trash2" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No services added yet</p>
            )}
</Card>

          {/* Booking Summary */}
          {formData.totalAmount_c > 0 && (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="FileText" size={20} className="mr-2" />
                Booking Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reservation ID:</span>
                  <span className="font-medium">{formData.reservation_id_c || 'Auto-generated'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest:</span>
                  <span className="font-medium">
                    {guests.find(g => g.Id == formData.guestId_c) ? 
                      `${guests.find(g => g.Id == formData.guestId_c).firstName_c || guests.find(g => g.Id == formData.guestId_c).Name} ${guests.find(g => g.Id == formData.guestId_c).lastName_c || ''}` : 
                      'Not selected'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">
                    {rooms.find(r => r.Id == formData.roomId_c) ? 
                      `Room ${rooms.find(r => r.Id == formData.roomId_c).number_c || rooms.find(r => r.Id == formData.roomId_c).number} - ${rooms.find(r => r.Id == formData.roomId_c).type_c || rooms.find(r => r.Id == formData.roomId_c).type}` : 
                      'Not selected'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates:</span>
                  <span className="font-medium">
                    {formData.checkInDate_c} to {formData.checkOutDate_c}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium">{formData.number_of_nights_c} night{formData.number_of_nights_c !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {formData.adults_c} Adult{formData.adults_c > 1 ? 's' : ''}
                    {formData.children_c > 0 && `, ${formData.children_c} Child${formData.children_c > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">Room Charges:</span>
                      <span className="font-semibold">${(formData.totalAmount_c || 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({formData.tax_percentage_c}):</span>
                      <span className="font-medium">
                        ${((formData.totalAmount_c || 0) * (parseInt(formData.tax_percentage_c) || 5) / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Charge ({formData.service_charge_percentage_c}%):</span>
                      <span className="font-medium">
                        ${((formData.totalAmount_c || 0) * (parseFloat(formData.service_charge_percentage_c) || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                    {formData.services.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Additional Services:</span>
                        <span className="font-medium">
                          ${formData.services.reduce((sum, s) => sum + (s.total || 0), 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {formData.discount_type_c !== 'None' && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount ({formData.discount_type_c}):</span>
                        <span className="font-medium">
                          -${(formData.discount_value_c || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-blue-300 pt-3 mt-3">
                      <div className="flex justify-between text-xl font-bold text-blue-700">
                        <span>Grand Total:</span>
                        <span>${(formData.calculatedTotal || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {/* Additional Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={formData.specialRequests_c}
                onChange={(e) => handleInputChange('specialRequests_c', e.target.value)}
                placeholder="Any special requests or notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-150"
                rows="4"
              />
            </div>
          </Card>
          
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