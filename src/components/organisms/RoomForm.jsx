import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const RoomForm = ({ initialData, onSubmit, onCancel, loading }) => {
const [formData, setFormData] = useState({
    roomId: '',
    number: '',
    type: '',
    floor: '',
    roomSize: '',
    viewType: '',
    bedConfiguration: '',
    maxOccupancyAdults: '',
    maxOccupancyChildren: '',
    baseRate: '',
    status: 'available',
    weekendRate: '',
    holidayRate: '',
    extraPersonCharge: '',
    childRate: '',
    earlyCheckInFee: '',
    lateCheckoutFee: '',
    currentActiveRate: '',
    seasonalRates: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

useEffect(() => {
if (initialData) {
      setFormData({
        roomId: initialData.roomId || '',
        number: initialData.number || '',
        type: initialData.type || '',
        floor: initialData.floor?.toString() || '',
        roomSize: initialData.roomSize?.toString() || '',
        viewType: initialData.viewType || '',
        bedConfiguration: initialData.bedConfiguration || '',
        maxOccupancyAdults: initialData.maxOccupancyAdults?.toString() || '',
        maxOccupancyChildren: initialData.maxOccupancyChildren?.toString() || '',
        baseRate: initialData.baseRate?.toString() || initialData.pricePerNight?.toString() || '',
        status: initialData.status || 'available',
        weekendRate: initialData.weekendRate?.toString() || '',
        holidayRate: initialData.holidayRate?.toString() || '',
        extraPersonCharge: initialData.extraPersonCharge?.toString() || '',
        childRate: initialData.childRate?.toString() || '',
        earlyCheckInFee: initialData.earlyCheckInFee?.toString() || '',
        lateCheckoutFee: initialData.lateCheckoutFee?.toString() || '',
        currentActiveRate: '',
        seasonalRates: initialData.seasonalRates || []
      });
    }
  }, [initialData]);

const roomTypes = [
    { value: 'Single', label: 'Single Room' },
    { value: 'Double', label: 'Double Room' },
    { value: 'Deluxe', label: 'Deluxe Room' },
    { value: 'Suite', label: 'Suite' },
    { value: 'Presidential', label: 'Presidential Suite' },
    { value: 'Family', label: 'Family Room' },
    { value: 'Family Suite', label: 'Family Suite' },
    { value: 'Presidential Suite', label: 'Presidential Suite' },
    { value: 'Executive Suite', label: 'Executive Suite' },
    { value: 'Deluxe Queen', label: 'Deluxe Queen' },
    { value: 'Standard Double', label: 'Standard Double' }
  ];

  const viewTypeOptions = [
    { value: 'City View', label: 'City View' },
    { value: 'Ocean View', label: 'Ocean View' },
    { value: 'Garden View', label: 'Garden View' },
    { value: 'Mountain View', label: 'Mountain View' },
    { value: 'Pool View', label: 'Pool View' },
    { value: 'No View', label: 'No View' }
  ];

  const bedConfigurationOptions = [
    { value: '1 King Bed', label: '1 King Bed' },
    { value: '2 Queen Beds', label: '2 Queen Beds' },
    { value: '1 Queen Bed', label: '1 Queen Bed' },
    { value: 'Twin Beds', label: 'Twin Beds' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out of service', label: 'Out of Service' },
    { value: 'blocked', label: 'Blocked' }
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

      case 'roomSize':
        if (value && (!/^\d+$/.test(value) || parseInt(value) < 1)) {
          newErrors.roomSize = 'Room size must be a positive number';
        } else {
          delete newErrors.roomSize;
        }
        break;

      case 'viewType':
        if (value) {
          delete newErrors.viewType;
        } else {
          delete newErrors.viewType;
        }
        break;

      case 'bedConfiguration':
        if (value) {
          delete newErrors.bedConfiguration;
        } else {
          delete newErrors.bedConfiguration;
        }
        break;

      case 'maxOccupancyAdults':
        if (!value) {
          newErrors.maxOccupancyAdults = 'Max occupancy (adults) is required';
        } else if (!/^\d+$/.test(value) || parseInt(value) < 1 || parseInt(value) > 20) {
          newErrors.maxOccupancyAdults = 'Max occupancy must be between 1 and 20';
        } else {
          delete newErrors.maxOccupancyAdults;
        }
        break;

      case 'maxOccupancyChildren':
        if (value && (!/^\d+$/.test(value) || parseInt(value) < 0 || parseInt(value) > 10)) {
          newErrors.maxOccupancyChildren = 'Max occupancy (children) must be between 0 and 10';
        } else {
          delete newErrors.maxOccupancyChildren;
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

      case 'weekendRate':
        if (value && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0)) {
          newErrors.weekendRate = 'Weekend rate must be a valid positive amount';
        } else {
          delete newErrors.weekendRate;
        }
        break;

      case 'holidayRate':
        if (value && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0)) {
          newErrors.holidayRate = 'Holiday rate must be a valid positive amount';
        } else {
          delete newErrors.holidayRate;
        }
        break;

      case 'extraPersonCharge':
        if (value && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) < 0)) {
          newErrors.extraPersonCharge = 'Extra person charge must be a valid amount';
        } else {
          delete newErrors.extraPersonCharge;
        }
        break;

      case 'childRate':
        if (value && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) < 0)) {
          newErrors.childRate = 'Child rate must be a valid amount';
        } else {
          delete newErrors.childRate;
        }
        break;

      case 'earlyCheckInFee':
        if (value && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) < 0)) {
          newErrors.earlyCheckInFee = 'Early check-in fee must be a valid amount';
        } else {
          delete newErrors.earlyCheckInFee;
        }
        break;

      case 'lateCheckoutFee':
        if (value && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) < 0)) {
          newErrors.lateCheckoutFee = 'Late checkout fee must be a valid amount';
        } else {
          delete newErrors.lateCheckoutFee;
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

  const isWeekend = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    return day === 5 || day === 6; // Friday = 5, Saturday = 6
  };

  const isHoliday = (date) => {
    // This can be extended with actual holiday logic
    // For now, returning false - implement based on your holiday rules
    return false;
  };

  const calculateActiveRate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check weekend rate
    if (formData.weekendRate && isWeekend(today)) {
      return parseFloat(formData.weekendRate).toFixed(2);
    }

    // Check holiday rate
    if (formData.holidayRate && isHoliday(today)) {
      return parseFloat(formData.holidayRate).toFixed(2);
    }

    // Check seasonal rates
    if (formData.seasonalRates && formData.seasonalRates.length > 0) {
      for (const season of formData.seasonalRates) {
        if (season.startDate && season.endDate && season.rate) {
          const startDate = new Date(season.startDate);
          const endDate = new Date(season.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          if (today >= startDate && today <= endDate) {
            return parseFloat(season.rate).toFixed(2);
          }
        }
      }
    }

    // Default to base rate
    return formData.baseRate ? parseFloat(formData.baseRate).toFixed(2) : '0.00';
  };

  const addSeason = () => {
    const newSeason = {
      id: Date.now(),
      seasonName: '',
      startDate: '',
      endDate: '',
      rate: ''
    };
    setFormData(prev => ({
      ...prev,
      seasonalRates: [...prev.seasonalRates, newSeason]
    }));
  };

  const removeSeason = (seasonId) => {
    setFormData(prev => ({
      ...prev,
      seasonalRates: prev.seasonalRates.filter(s => s.id !== seasonId)
    }));
  };

  const handleSeasonChange = (seasonId, field, value) => {
    setFormData(prev => ({
      ...prev,
      seasonalRates: prev.seasonalRates.map(season =>
        season.id === seasonId ? { ...season, [field]: value } : season
      )
    }));
  };

  useEffect(() => {
    const activeRate = calculateActiveRate();
    setFormData(prev => ({
      ...prev,
      currentActiveRate: activeRate
    }));
  }, [formData.baseRate, formData.weekendRate, formData.holidayRate, formData.seasonalRates]);

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
      {/* Base Room Information */}
{/* Section 1: Basic Information */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room ID - Read Only */}
          <div className="space-y-2">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
              Room ID
            </label>
            <Input
              id="roomId"
              name="roomId"
              value={formData.roomId}
              disabled={true}
              placeholder="Auto-generated"
              className="input-field bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Auto-generated format: RM-XXX</p>
          </div>

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

          {/* Floor Number */}
          <div className="space-y-2">
            <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
              Floor Number *
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

          {/* Room Size */}
          <div className="space-y-2">
            <label htmlFor="roomSize" className="block text-sm font-medium text-gray-700">
              Room Size
            </label>
            <div className="flex gap-2">
              <Input
                id="roomSize"
                name="roomSize"
                type="number"
                min="1"
                value={formData.roomSize}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., 250"
                className={cn(
                  "input-field flex-1",
                  errors.roomSize && touched.roomSize && "border-error focus:ring-error/20"
                )}
              />
              <Select className="input-field w-32" disabled>
                <option>sq ft</option>
              </Select>
            </div>
            {errors.roomSize && touched.roomSize && (
              <p className="text-sm text-error">{errors.roomSize}</p>
            )}
          </div>

          {/* View Type */}
          <div className="space-y-2">
            <label htmlFor="viewType" className="block text-sm font-medium text-gray-700">
              View Type
            </label>
            <Select
              id="viewType"
              name="viewType"
              value={formData.viewType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select view type</option>
              {viewTypeOptions.map(view => (
                <option key={view.value} value={view.value}>
                  {view.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Bed Configuration */}
          <div className="space-y-2">
            <label htmlFor="bedConfiguration" className="block text-sm font-medium text-gray-700">
              Bed Configuration
            </label>
            <Select
              id="bedConfiguration"
              name="bedConfiguration"
              value={formData.bedConfiguration}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select bed configuration</option>
              {bedConfigurationOptions.map(bed => (
                <option key={bed.value} value={bed.value}>
                  {bed.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Maximum Occupancy Adults */}
          <div className="space-y-2">
            <label htmlFor="maxOccupancyAdults" className="block text-sm font-medium text-gray-700">
              Maximum Occupancy (Adults) *
            </label>
            <Input
              id="maxOccupancyAdults"
              name="maxOccupancyAdults"
              type="number"
              min="1"
              max="20"
              value={formData.maxOccupancyAdults}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 2, 4"
              className={cn(
                "input-field",
                errors.maxOccupancyAdults && touched.maxOccupancyAdults && "border-error focus:ring-error/20"
              )}
            />
            {errors.maxOccupancyAdults && touched.maxOccupancyAdults && (
              <p className="text-sm text-error">{errors.maxOccupancyAdults}</p>
            )}
          </div>

          {/* Maximum Occupancy Children */}
          <div className="space-y-2">
            <label htmlFor="maxOccupancyChildren" className="block text-sm font-medium text-gray-700">
              Maximum Occupancy (Children)
            </label>
            <Input
              id="maxOccupancyChildren"
              name="maxOccupancyChildren"
              type="number"
              min="0"
              max="10"
              value={formData.maxOccupancyChildren}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., 0, 2"
              className={cn(
                "input-field",
                errors.maxOccupancyChildren && touched.maxOccupancyChildren && "border-error focus:ring-error/20"
              )}
            />
            {errors.maxOccupancyChildren && touched.maxOccupancyChildren && (
              <p className="text-sm text-error">{errors.maxOccupancyChildren}</p>
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
              Status *
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
</div>

      {/* Pricing Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Rates</h3>

{/* Base Rate */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Rate (per night) <span className="text-error">*</span>
          </label>
          <Input
            type="number"
            name="baseRate"
            value={formData.baseRate}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={cn(errors.baseRate && 'border-error')}
          />
          {errors.baseRate && (
            <p className="text-error text-sm mt-1">{errors.baseRate}</p>
          )}
        </div>

        {/* Weekend & Holiday Rates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weekend Rate (Fri-Sat)
            </label>
            <Input
              type="number"
              name="weekendRate"
              value={formData.weekendRate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(errors.weekendRate && 'border-error')}
            />
            {errors.weekendRate && (
              <p className="text-error text-sm mt-1">{errors.weekendRate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Holiday Rate
            </label>
            <Input
              type="number"
              name="holidayRate"
              value={formData.holidayRate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(errors.holidayRate && 'border-error')}
            />
            {errors.holidayRate && (
              <p className="text-error text-sm mt-1">{errors.holidayRate}</p>
            )}
          </div>
        </div>

        {/* Extra Charges */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra Person Charge
            </label>
            <Input
              type="number"
              name="extraPersonCharge"
              value={formData.extraPersonCharge}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(errors.extraPersonCharge && 'border-error')}
            />
            {errors.extraPersonCharge && (
              <p className="text-error text-sm mt-1">{errors.extraPersonCharge}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child Rate
            </label>
            <Input
              type="number"
              name="childRate"
              value={formData.childRate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(errors.childRate && 'border-error')}
            />
            {errors.childRate && (
              <p className="text-error text-sm mt-1">{errors.childRate}</p>
            )}
          </div>
        </div>

        {/* Special Fees */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Early Check-in Fee
            </label>
            <Input
              type="number"
              name="earlyCheckInFee"
              value={formData.earlyCheckInFee}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(errors.earlyCheckInFee && 'border-error')}
            />
            {errors.earlyCheckInFee && (
              <p className="text-error text-sm mt-1">{errors.earlyCheckInFee}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Checkout Fee
            </label>
            <Input
              type="number"
              name="lateCheckoutFee"
              value={formData.lateCheckoutFee}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={cn(errors.lateCheckoutFee && 'border-error')}
            />
            {errors.lateCheckoutFee && (
              <p className="text-error text-sm mt-1">{errors.lateCheckoutFee}</p>
            )}
          </div>
        </div>

        {/* Current Active Rate */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Active Rate (Today)</p>
          <p className="text-2xl font-bold text-primary">
            ${formData.currentActiveRate}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Auto-calculated based on current date (weekend/holiday/seasonal rates)
          </p>
        </div>

        {/* Seasonal Rates */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-gray-900">Seasonal Rates</h4>
            <Button
              type="button"
              onClick={addSeason}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              Add Season
            </Button>
          </div>

          {formData.seasonalRates.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No seasonal rates added yet. Click "Add Season" to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.seasonalRates.map((season) => (
                <div
                  key={season.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Season Name
                      </label>
                      <Input
                        type="text"
                        value={season.seasonName}
                        onChange={(e) =>
                          handleSeasonChange(season.id, 'seasonName', e.target.value)
                        }
                        placeholder="e.g., Summer, Winter, Festival"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate
                      </label>
                      <Input
                        type="number"
                        value={season.rate}
                        onChange={(e) =>
                          handleSeasonChange(season.id, 'rate', e.target.value)
                        }
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={season.startDate}
                        onChange={(e) =>
                          handleSeasonChange(season.id, 'startDate', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={season.endDate}
                        onChange={(e) =>
                          handleSeasonChange(season.id, 'endDate', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => removeSeason(season.id)}
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="Trash2" size={16} />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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