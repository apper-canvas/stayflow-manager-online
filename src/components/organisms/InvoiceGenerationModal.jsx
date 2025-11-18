import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { Card } from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import invoiceService from "@/services/api/invoiceService";

const InvoiceGenerationModal = ({ reservation, isOpen, onClose, onInvoiceGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Auto-filled invoice data
  const [invoiceData, setInvoiceData] = useState({
    // Invoice Header
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    
    // Guest Information (from reservation)
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    guestIdProof: '',
    
    // Reservation Details
    reservationId: '',
    roomNumber: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfNights: 0,
    numberOfGuests: 0,
    
    // Itemized Charges
    roomCharges: 0,
    roomRate: 0,
    additionalServices: [],
    subtotal: 0,
    taxPercentage: 10, // GST/VAT percentage
    taxAmount: 0,
    serviceChargePercentage: 0,
    serviceChargeAmount: 0,
    discountAmount: 0,
    discountReason: '',
    grandTotal: 0,
    
    // Additional fields
    specialNotes: '',
    paymentStatus: 'Unpaid'
  });

  // Auto-fill invoice data when reservation changes
  useEffect(() => {
    if (!reservation || !isOpen) return;

    const checkIn = new Date(reservation.checkInDate_c);
    const checkOut = new Date(reservation.checkOutDate_c);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Generate invoice number
    const invoiceNumber = `INV-${format(new Date(), 'yyyy-MM-dd')}-${String(Date.now()).slice(-4)}`;
    
    // Extract room rate
    const roomRate = (reservation.totalAmount_c || 0) / Math.max(nights, 1);
    
    // Parse additional services from reservation
    const additionalServices = [];
    if (reservation.services && Array.isArray(reservation.services)) {
      reservation.services.forEach(service => {
        if (service.serviceName && service.quantity && service.pricePerUnit) {
          additionalServices.push({
            id: service.id || Date.now() + Math.random(),
            description: service.serviceName,
            quantity: service.quantity,
            rate: service.pricePerUnit,
            amount: service.total || (service.quantity * service.pricePerUnit)
          });
        }
      });
    }

    // Add sample services for demonstration if none exist
    if (additionalServices.length === 0) {
      additionalServices.push(
        {
          id: 1,
          description: 'Minibar',
          quantity: 1,
          rate: 25.00,
          amount: 25.00
        },
        {
          id: 2,
          description: 'Laundry Service',
          quantity: 2,
          rate: 15.00,
          amount: 30.00
        }
      );
    }
    
    const taxPercentage = parseFloat(reservation.tax_percentage_c) || 10;
    const serviceChargePercentage = parseFloat(reservation.service_charge_percentage_c) || 0;
    const discountAmount = parseFloat(reservation.discount_value_c) || 0;
    
    setInvoiceData({
      // Invoice Header
      invoiceNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      
      // Guest Information
      guestName: reservation.guestId_c?.Name || reservation.guestName_c || 'Unknown Guest',
      guestEmail: 'guest@example.com', // Would come from guest data
      guestPhone: '+1 (555) 123-4567', // Would come from guest data
      guestAddress: '123 Main St, City, State 12345', // Would come from guest data
      guestIdProof: 'DL123456789', // Would come from guest data
      
      // Reservation Details
      reservationId: reservation.reservation_id_c || reservation.Id,
      roomNumber: reservation.roomId_c?.Name || reservation.roomNumber_c || 'Unknown',
      roomType: reservation.roomId_c?.type_c || reservation.roomType_c || 'Standard',
      checkInDate: reservation.checkInDate_c,
      checkOutDate: reservation.checkOutDate_c,
      numberOfNights: nights,
      numberOfGuests: (reservation.adults_c || 0) + (reservation.children_c || 0),
      
      // Charges
      roomCharges: reservation.totalAmount_c || 0,
      roomRate: roomRate,
      additionalServices,
      subtotal: 0,
      taxPercentage,
      taxAmount: 0,
      serviceChargePercentage,
      serviceChargeAmount: 0,
      discountAmount,
      discountReason: reservation.discount_reason_c || '',
      grandTotal: 0,
      
      specialNotes: reservation.specialRequests_c || '',
      paymentStatus: reservation.paymentStatus_c || 'Unpaid'
    });
  }, [reservation, isOpen]);

  // Calculate totals whenever charges change
  useEffect(() => {
    const servicesTotal = invoiceData.additionalServices.reduce((sum, service) => sum + service.amount, 0);
    const subtotal = invoiceData.roomCharges + servicesTotal;
    const taxAmount = subtotal * (invoiceData.taxPercentage / 100);
    const serviceChargeAmount = subtotal * (invoiceData.serviceChargePercentage / 100);
    const grandTotal = subtotal + taxAmount + serviceChargeAmount - invoiceData.discountAmount;

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      serviceChargeAmount,
      grandTotal: Math.max(0, grandTotal)
    }));
  }, [
    invoiceData.roomCharges,
    invoiceData.additionalServices,
    invoiceData.taxPercentage,
    invoiceData.serviceChargePercentage,
    invoiceData.discountAmount
  ]);

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (serviceId, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.map(service => {
        if (service.id === serviceId) {
          const updated = { ...service, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.rate) || 0);
          }
          return updated;
        }
        return service;
      })
    }));
  };

  const handleAddService = () => {
    const newService = {
      id: Date.now(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      additionalServices: [...prev.additionalServices, newService]
    }));
  };

  const handleRemoveService = (serviceId) => {
    setInvoiceData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.filter(s => s.id !== serviceId)
    }));
  };

  const handleConfirm = () => {
    setShowConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    try {
      setLoading(true);
      
      // Generate invoice using the service
      const invoiceResult = await invoiceService.generateInvoice({
        ...invoiceData,
        reservationId: reservation.Id,
        guestId: reservation.guestId_c?.Id || reservation.guestId_c,
        roomId: reservation.roomId_c?.Id || reservation.roomId_c
      });

      if (invoiceResult) {
        toast.success("Invoice generated successfully and reservation checked out!");
        setShowConfirmation(false);
        onClose();
        onInvoiceGenerated(invoiceResult);
      }
    } catch (error) {
      toast.error("Failed to generate invoice");
      console.error("Invoice generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full p-3">
              <ApperIcon name="Receipt" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Generate Invoice</h2>
              <p className="text-sm text-gray-600">
                Checkout for {invoiceData.guestName} - Room {invoiceData.roomNumber}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hotel Header Info */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-blue-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">StayFlow Hotel</h1>
              <p className="text-gray-600">123 Hospitality Avenue, City, State 12345</p>
              <p className="text-gray-600">Phone: (555) 123-4567 | Email: info@stayflowhotel.com</p>
            </div>
          </Card>

          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Invoice Number">
              <Input
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className="font-mono"
              />
            </FormField>
            <FormField label="Invoice Date">
              <Input
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
              />
            </FormField>
            <FormField label="Due Date">
              <Input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </FormField>
          </div>

          {/* Guest Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Guest Name">
                <Input
                  value={invoiceData.guestName}
                  onChange={(e) => handleInputChange('guestName', e.target.value)}
                />
              </FormField>
              <FormField label="Email">
                <Input
                  type="email"
                  value={invoiceData.guestEmail}
                  onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                />
              </FormField>
              <FormField label="Phone">
                <Input
                  value={invoiceData.guestPhone}
                  onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                />
              </FormField>
              <FormField label="ID Proof">
                <Input
                  value={invoiceData.guestIdProof}
                  onChange={(e) => handleInputChange('guestIdProof', e.target.value)}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Address">
                  <Textarea
                    value={invoiceData.guestAddress}
                    onChange={(e) => handleInputChange('guestAddress', e.target.value)}
                    rows={2}
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* Reservation Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Reservation ID">
                <Input
                  value={invoiceData.reservationId}
                  readOnly
                  className="bg-gray-50"
                />
              </FormField>
              <FormField label="Room Number">
                <Input
                  value={invoiceData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                />
              </FormField>
              <FormField label="Room Type">
                <Input
                  value={invoiceData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                />
              </FormField>
              <FormField label="Check-in Date">
                <Input
                  type="date"
                  value={invoiceData.checkInDate}
                  onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                />
              </FormField>
              <FormField label="Check-out Date">
                <Input
                  type="date"
                  value={invoiceData.checkOutDate}
                  onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                />
              </FormField>
              <FormField label="Number of Nights">
                <Input
                  type="number"
                  value={invoiceData.numberOfNights}
                  readOnly
                  className="bg-gray-50"
                />
              </FormField>
            </div>
          </Card>

          {/* Itemized Charges Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Itemized Charges</h3>
            
            {/* Room Charges */}
            <div className="border rounded-lg overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Room {invoiceData.roomNumber} ({invoiceData.roomType})
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">
                      <Input
                        type="number"
                        value={invoiceData.numberOfNights}
                        onChange={(e) => {
                          const nights = parseInt(e.target.value) || 0;
                          handleInputChange('numberOfNights', nights);
                          handleInputChange('roomCharges', nights * invoiceData.roomRate);
                        }}
                        className="w-20 text-center"
                        min="1"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      <Input
                        type="number"
                        value={invoiceData.roomRate}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          handleInputChange('roomRate', rate);
                          handleInputChange('roomCharges', invoiceData.numberOfNights * rate);
                        }}
                        className="w-28 text-right"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      ${invoiceData.roomCharges.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Additional Services */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-medium text-gray-900">Additional Services</h4>
                <Button
                  type="button"
                  onClick={handleAddService}
                  className="flex items-center gap-2 text-sm"
                  variant="outline"
                >
                  <ApperIcon name="Plus" size={16} />
                  Add Service
                </Button>
              </div>
              
              {invoiceData.additionalServices.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {invoiceData.additionalServices.map((service) => (
                        <tr key={service.id}>
                          <td className="px-4 py-3">
                            <Select
                              value={service.description}
                              onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                              className="w-full"
                            >
                              <option value="">Select Service</option>
                              <option value="Minibar">Minibar</option>
                              <option value="Laundry Service">Laundry Service</option>
                              <option value="Room Service">Room Service</option>
                              <option value="Spa Services">Spa Services</option>
                              <option value="Parking">Parking</option>
                              <option value="Extra Amenities">Extra Amenities</option>
                              <option value="Other">Other</option>
                            </Select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Input
                              type="number"
                              value={service.quantity}
                              onChange={(e) => handleServiceChange(service.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Input
                              type="number"
                              value={service.rate}
                              onChange={(e) => handleServiceChange(service.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-28 text-right"
                              step="0.01"
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            ${service.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              type="button"
                              onClick={() => handleRemoveService(service.id)}
                              variant="ghost"
                              className="text-red-600 hover:text-red-800"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Tax and Charges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormField label="Tax Percentage (GST/VAT)">
                <Input
                  type="number"
                  value={invoiceData.taxPercentage}
                  onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </FormField>
              <FormField label="Service Charge %">
                <Input
                  type="number"
                  value={invoiceData.serviceChargePercentage}
                  onChange={(e) => handleInputChange('serviceChargePercentage', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </FormField>
              <FormField label="Discount Amount">
                <Input
                  type="number"
                  value={invoiceData.discountAmount}
                  onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
              </FormField>
            </div>

            {invoiceData.discountAmount > 0 && (
              <FormField label="Discount Reason" className="mb-4">
                <Input
                  value={invoiceData.discountReason}
                  onChange={(e) => handleInputChange('discountReason', e.target.value)}
                  placeholder="Enter reason for discount"
                />
              </FormField>
            )}

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({invoiceData.taxPercentage}%):</span>
                  <span className="font-medium">${invoiceData.taxAmount.toFixed(2)}</span>
                </div>
                {invoiceData.serviceChargePercentage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge ({invoiceData.serviceChargePercentage}%):</span>
                    <span className="font-medium">${invoiceData.serviceChargeAmount.toFixed(2)}</span>
                  </div>
                )}
                {invoiceData.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span className="font-medium">-${invoiceData.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total:</span>
                    <span>${invoiceData.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Special Notes */}
          <FormField label="Special Notes">
            <Textarea
              value={invoiceData.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              rows={3}
              placeholder="Add any special notes or instructions..."
            />
          </FormField>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Receipt" size={18} />
            Confirm & Generate Invoice
          </Button>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full p-3 mx-auto w-12 h-12 mb-4">
                  <ApperIcon name="AlertTriangle" className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Invoice Generation</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to generate invoice and mark as checked out?
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFinalConfirm}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceGenerationModal;