import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import reservationService from '@/services/api/reservationService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';

const PaymentStatusModal = ({ reservation, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    paymentStatus: '',
    totalAmount: '',
    paymentNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reservation && isOpen) {
      setFormData({
        paymentStatus: reservation.paymentStatus_c || 'Unpaid',
        totalAmount: reservation.totalAmount_c?.toString() || '0',
        paymentNotes: reservation.specialRequests_c || ''
      });
      setErrors({});
    }
  }, [reservation, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.paymentStatus) {
      newErrors.paymentStatus = 'Payment status is required';
    }
    
    if (!formData.totalAmount || parseFloat(formData.totalAmount) < 0) {
      newErrors.totalAmount = 'Valid total amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    
    try {
      const updateData = {
        paymentStatus: formData.paymentStatus,
        totalAmount: parseFloat(formData.totalAmount),
        specialRequests: formData.paymentNotes
      };

      const result = await reservationService.update(reservation.Id, updateData);
      
      if (result) {
        const updatedReservation = {
          ...reservation,
          paymentStatus_c: formData.paymentStatus,
          totalAmount_c: parseFloat(formData.totalAmount),
          specialRequests_c: formData.paymentNotes
        };
        onUpdate(updatedReservation);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Reservation Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Reservation Details</h3>
              <p className="text-sm text-gray-600">
                Guest: {reservation?.guestId_c?.Name || reservation?.guestName_c || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Room: {reservation?.roomId_c?.Name || reservation?.roomNumber_c || 'N/A'}
              </p>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status *
              </label>
              <Select
                value={formData.paymentStatus}
                onChange={(e) => handleChange('paymentStatus', e.target.value)}
                className={`w-full ${errors.paymentStatus ? 'border-red-500' : ''}`}
                disabled={loading}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </Select>
              {errors.paymentStatus && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentStatus}</p>
              )}
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalAmount}
                  onChange={(e) => handleChange('totalAmount', e.target.value)}
                  className={`pl-8 ${errors.totalAmount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
              {errors.totalAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
              )}
            </div>

            {/* Payment Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Notes
              </label>
              <textarea
                value={formData.paymentNotes}
                onChange={(e) => handleChange('paymentNotes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-150 min-h-[80px] resize-none"
                placeholder="Add any payment notes or special instructions..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Updating...
                </div>
              ) : (
                'Update Payment'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentStatusModal;