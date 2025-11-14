import React, { useState, useEffect } from 'react';
import Input from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const RoomForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    floor: '',
    maxOccupancy: '',
    baseRate: '',
    status: 'available'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number || '',
        type: initialData.type || '',
        floor: initialData.floor?.toString() || '',
        maxOccupancy: initialData.maxOccupancy?.toString() || '',
        baseRate: initialData.baseRate?.toString() || initialData.pricePerNight?.toString() || '',
        status: initialData.status || 'available'
      });
    }
  }, [initialData]);

  const roomTypes = [
    { value: 'standard', label: 'Standard Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'presidential', label: 'Presidential Suite' },
    { value: 'family', label: 'Family Room' },
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'twin', label: 'Twin Room' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out-of-order', label: 'Out of Order' }
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'number':
        if (!value.trim()) {
          newErrors.number = 'Room number is required';
        } else if (!/^[A-Za-z0-9-]+$/.test(value)) {
          newErrors.number = 'Room number can only contain letters, numbers, and hyphens';
        } else {
          delete newErrors.number;
        }
        break;

      case 'type':
        if (!value) {
          newErrors.type = 'Room type is required';
        } else {
          delete newErrors.type;
        }
        break;

      case 'floor':
        if (!value) {
          newErrors.floor = 'Floor is required';
        } else if (!/^\d+$/.test(value) || parseInt(value) < 1) {
          newErrors.floor = 'Floor must be a positive number';
        } else {
          delete newErrors.floor;
        }
        break;

      case 'maxOccupancy':
        if (!value) {
          newErrors.maxOccupancy = 'Max occupancy is required';
        } else if (!/^\d+$/.test(value) || parseInt(value) < 1 || parseInt(value) > 20) {
          newErrors.maxOccupancy = 'Max occupancy must be between 1 and 20';
        } else {
          delete newErrors.maxOccupancy;
        }
        break;

      case 'baseRate':
        if (!value) {
          newErrors.baseRate = 'Base rate is required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0) {
          newErrors.baseRate = 'Base rate must be a valid positive amount';
        } else {
          delete newErrors.baseRate;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const isValid = Object.keys(formData).every(field => 
      validateField(field, formData[field])
    );

    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Number */}
        <div className="space-y-2">
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Room Number *
          </label>
          <Input
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 101, A-201"
            className={cn(
              "input-field",
              errors.number && touched.number && "border-error focus:ring-error/20"
            )}
          />
          {errors.number && touched.number && (
            <p className="text-sm text-error">{errors.number}</p>
          )}
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Room Type *
          </label>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              "input-field",
              errors.type && touched.type && "border-error focus:ring-error/20"
            )}
          >
            <option value="">Select room type</option>
            {roomTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          {errors.type && touched.type && (
            <p className="text-sm text-error">{errors.type}</p>
          )}
        </div>

        {/* Floor */}
        <div className="space-y-2">
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
            Floor *
          </label>
          <Input
            id="floor"
            name="floor"
            type="number"
            min="1"
            value={formData.floor}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 1, 2, 3"
            className={cn(
              "input-field",
              errors.floor && touched.floor && "border-error focus:ring-error/20"
            )}
          />
          {errors.floor && touched.floor && (
            <p className="text-sm text-error">{errors.floor}</p>
          )}
        </div>

        {/* Max Occupancy */}
        <div className="space-y-2">
          <label htmlFor="maxOccupancy" className="block text-sm font-medium text-gray-700">
            Max Occupancy *
          </label>
          <Input
            id="maxOccupancy"
            name="maxOccupancy"
            type="number"
            min="1"
            max="20"
            value={formData.maxOccupancy}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 2, 4"
            className={cn(
              "input-field",
              errors.maxOccupancy && touched.maxOccupancy && "border-error focus:ring-error/20"
            )}
          />
          {errors.maxOccupancy && touched.maxOccupancy && (
            <p className="text-sm text-error">{errors.maxOccupancy}</p>
          )}
        </div>

        {/* Base Rate */}
        <div className="space-y-2">
          <label htmlFor="baseRate" className="block text-sm font-medium text-gray-700">
            Base Rate (per night) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <Input
              id="baseRate"
              name="baseRate"
              type="text"
              value={formData.baseRate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              className={cn(
                "input-field pl-8",
                errors.baseRate && touched.baseRate && "border-error focus:ring-error/20"
              )}
            />
          </div>
          {errors.baseRate && touched.baseRate && (
            <p className="text-sm text-error">{errors.baseRate}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="btn-primary"
          disabled={loading || Object.keys(errors).length > 0}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              {initialData ? 'Update Room' : 'Create Room'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;