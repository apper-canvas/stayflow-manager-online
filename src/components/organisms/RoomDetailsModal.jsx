import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Toggle from '@/components/atoms/Toggle';
import Radio from '@/components/atoms/Radio';
import FileUploader from '@/components/atoms/FileUploader';
import Select from '@/components/atoms/Select';
import roomService from '@/services/api/roomService';

const RoomDetailsModal = ({ room, isOpen, onClose, onRoomUpdated, allRooms = [] }) => {
const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedConnectedRooms, setSelectedConnectedRooms] = useState([]);
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (room && isOpen) {
      setFormData({
        roomDescription: room.roomDescription_c || '',
        smokingStatus: room.smokingStatus_c || 'Non-Smoking',
        petFriendly: room.petFriendly_c || false,
        accessible: room.accessible_c || false,
        connectedRoomsAvailable: room.connectedRooms_c || false,
        specialFeatures: room.specialFeatures_c || '',
        housekeepingStatus: room.housekeeping_status_c || 'Clean',
        lastCleaned: room.lastCleaned_c || new Date().toISOString(),
        assignedHousekeeper: room.assignedHousekeeper_c || '',
        maintenanceStatus: room.maintenanceStatus_c || 'No Issues',
        maintenanceNotes: room.maintenanceNotes_c || '',
        lastMaintenanceDate: room.lastMaintenanceDate_c || '',
      });
      setUploadedFiles(room.roomImages_c ? room.roomImages_c.split(',').filter(Boolean) : []);
      setSelectedConnectedRooms([]);
      setErrors({});
    }
  }, [room, isOpen]);

const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleHousekeepingStatusChange = (value) => {
    const currentTime = new Date().toISOString();
    setFormData(prev => ({
      ...prev,
      housekeepingStatus: value,
      lastCleaned: currentTime
    }));
  };

  const handleFileAdd = (newFiles) => {
    const fileNames = newFiles.map(f => f.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
  };

  const handleFileRemove = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roomDescription?.trim()) {
      newErrors.roomDescription = 'Room description is required';
    }
    
    if (formData.roomDescription && formData.roomDescription.length > 1000) {
      newErrors.roomDescription = 'Description cannot exceed 1000 characters';
    }

    if (formData.specialFeatures && formData.specialFeatures.length > 500) {
      newErrors.specialFeatures = 'Special features cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        roomDescription_c: formData.roomDescription,
        smokingStatus_c: formData.smokingStatus,
        petFriendly_c: formData.petFriendly,
        accessible_c: formData.accessible,
        connectedRooms_c: formData.connectedRoomsAvailable,
        specialFeatures_c: formData.specialFeatures,
        roomImages_c: uploadedFiles.join(','),
        housekeeping_status_c: formData.housekeepingStatus,
        lastCleaned_c: formData.lastCleaned,
        assignedHousekeeper_c: formData.assignedHousekeeper,
        maintenanceStatus_c: formData.maintenanceStatus,
        maintenanceNotes_c: formData.maintenanceNotes,
        lastMaintenanceDate_c: formData.lastMaintenanceDate,
      };

      const result = await roomService.update(room.Id, updateData);

      if (result) {
        toast.success('Room details updated successfully');
        onRoomUpdated?.(result);
        onClose();
      }
    } catch (err) {
      console.error('Error updating room:', err);
      toast.error(err.message || 'Failed to update room details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !formData) return null;

const availableRoomsForConnection = allRooms.filter(r => r.Id !== room.Id);
  const smokingOptions = [
    { value: 'Smoking', label: 'Smoking' },
    { value: 'Non-Smoking', label: 'Non-Smoking' }
  ];
  const housekeepingStatusOptions = [
    { value: 'Clean', label: 'Clean' },
    { value: 'Dirty', label: 'Dirty' },
    { value: 'Inspected', label: 'Inspected' },
    { value: 'In Progress', label: 'In Progress' }
  ];
  const maintenanceStatusOptions = [
    { value: 'No Issues', label: 'No Issues' },
    { value: 'Under Repair', label: 'Under Repair' }
  ];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Room {room.number || room.number_c} Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">Type: {room.type || room.type_c}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Description */}
          <div>
            <Textarea
              label="Room Description"
              value={formData.roomDescription}
              onChange={(e) => handleInputChange('roomDescription', e.target.value)}
              rows={4}
              maxLength={1000}
              showCount={true}
              placeholder="Enter marketing description for this room..."
              error={errors.roomDescription}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide an engaging description highlighting room features and amenities
            </p>
          </div>

          {/* Room Images */}
          <div>
            <FileUploader
              label="Room Images"
              onChange={handleFileAdd}
              onRemove={handleFileRemove}
              files={uploadedFiles.map((name, idx) => ({ name, type: 'image' }))}
              accept="image/*"
              multiple={true}
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload up to 10 images. Supported formats: JPG, PNG, WebP
            </p>
          </div>

          {/* Smoking Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Smoking Status
            </label>
            <Radio
              name="smokingStatus"
              value={formData.smokingStatus}
              onChange={(value) => handleInputChange('smokingStatus', value)}
              options={smokingOptions}
              direction="horizontal"
            />
          </div>

          {/* Pet Friendly Toggle */}
          <Toggle
            checked={formData.petFriendly}
            onChange={(value) => handleInputChange('petFriendly', value)}
            label="Pet Friendly"
            description="Allow pets in this room"
          />

          {/* Accessible Toggle */}
          <Toggle
            checked={formData.accessible}
            onChange={(value) => handleInputChange('accessible', value)}
            label="Wheelchair Accessible"
            description="Room has wheelchair accessibility features"
          />

          {/* Connected Rooms */}
          <div className="space-y-3">
            <Toggle
              checked={formData.connectedRoomsAvailable}
              onChange={(value) => handleInputChange('connectedRoomsAvailable', value)}
              label="Connected Rooms Available"
              description="This room can connect to adjacent rooms"
            />

            {formData.connectedRoomsAvailable && availableRoomsForConnection.length > 0 && (
              <div className="ml-9 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Connected Rooms
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableRoomsForConnection.map((availableRoom) => (
                    <label key={availableRoom.Id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedConnectedRooms.includes(availableRoom.Id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConnectedRooms(prev => [...prev, availableRoom.Id]);
                          } else {
                            setSelectedConnectedRooms(prev => prev.filter(id => id !== availableRoom.Id));
                          }
                        }}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Room {availableRoom.number} ({availableRoom.type})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Special Features */}
          <div>
            <Textarea
              label="Special Features"
              value={formData.specialFeatures}
              onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
              rows={3}
              maxLength={500}
              showCount={true}
              placeholder="e.g., Panoramic windows, Soundproof, Hot tub, Balcony..."
              error={errors.specialFeatures}
            />
</div>

          {/* Room Info Display */}
{/* Room Info Display */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room Type:</span>
              <span className="font-medium text-gray-900">{room.type || room.type_c}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Floor:</span>
              <span className="font-medium text-gray-900">{room.floor || room.floor_c}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Occupancy:</span>
              <span className="font-medium text-gray-900">{room.maxOccupancy || room.maxOccupancy_c} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Rate:</span>
              <span className="font-medium text-gray-900">${room.baseRate || room.baseRate_c}/night</span>
            </div>
          </div>

          {/* Housekeeping Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Housekeeping</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Housekeeping Status
                </label>
                <Select
                  value={formData?.housekeepingStatus || 'Clean'}
                  onChange={(e) => handleHousekeepingStatusChange(e.target.value)}
                  className="w-full"
                >
                  {housekeepingStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Cleaned Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData?.lastCleaned ? new Date(formData.lastCleaned).toISOString().slice(0, 16) : ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-updated when housekeeping status changes</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Housekeeper
                </label>
                <Select
                  value={formData?.assignedHousekeeper || ''}
                  onChange={(e) => handleInputChange('assignedHousekeeper', e.target.value)}
                  className="w-full"
                >
                  <option value="">Select housekeeper</option>
                  {/* Housekeeper options will be populated from staff list */}
                  <option value="1">John Smith</option>
                  <option value="2">Maria Garcia</option>
                  <option value="3">Ahmed Hassan</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Maintenance Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Maintenance Status
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${formData?.maintenanceStatus === 'Under Repair' ? 'text-error' : 'text-success'}`}>
                    {formData?.maintenanceStatus || 'No Issues'}
                  </span>
                  <Toggle
                    checked={formData?.maintenanceStatus === 'Under Repair'}
                    onChange={(checked) => handleInputChange('maintenanceStatus', checked ? 'Under Repair' : 'No Issues')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Notes
                </label>
                <Textarea
                  value={formData?.maintenanceNotes || ''}
                  onChange={(e) => handleInputChange('maintenanceNotes', e.target.value)}
                  placeholder="Enter maintenance notes or issues..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Maintenance Date
                </label>
                <Input
                  type="datetime-local"
                  value={formData?.lastMaintenanceDate ? new Date(formData.lastMaintenanceDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', new Date(e.target.value).toISOString())}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
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
                  <ApperIcon name="Loader" className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomDetailsModal;