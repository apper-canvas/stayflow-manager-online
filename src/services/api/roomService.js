import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const roomService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('rooms_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "maxOccupancy_c"}},
          {"field": {"Name": "baseRate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lastCleaned_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching rooms:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(room => ({
        ...room,
        number: room.number_c,
        type: room.type_c,
        floor: room.floor_c,
        maxOccupancy: room.maxOccupancy_c,
        pricePerNight: room.baseRate_c, // Map baseRate to pricePerNight for UI compatibility
        baseRate: room.baseRate_c,
        status: room.status_c,
        lastCleaned: room.lastCleaned_c
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('rooms_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "floor_c"}},
          {"field": {"Name": "maxOccupancy_c"}},
          {"field": {"Name": "baseRate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lastCleaned_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const room = response.data;
      return {
        ...room,
        number: room.number_c,
        type: room.type_c,
        floor: room.floor_c,
        maxOccupancy: room.maxOccupancy_c,
        pricePerNight: room.baseRate_c, // Map baseRate to pricePerNight for UI compatibility
        baseRate: room.baseRate_c,
        status: room.status_c,
        lastCleaned: room.lastCleaned_c
      };
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(roomData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableData = {
        Name: roomData.number ? `Room ${roomData.number}` : `Room-${Date.now()}`,
        number_c: roomData.number || '',
        type_c: roomData.type || '',
        floor_c: roomData.floor ? parseInt(roomData.floor) : null,
        maxOccupancy_c: roomData.maxOccupancy ? parseInt(roomData.maxOccupancy) : null,
        baseRate_c: roomData.baseRate ? parseFloat(roomData.baseRate) : (roomData.pricePerNight ? parseFloat(roomData.pricePerNight) : null),
        status_c: roomData.status || 'available',
        lastCleaned_c: roomData.lastCleaned || new Date().toISOString()
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const response = await apperClient.createRecord('rooms_c', {
        records: [updateableData]
      });

      if (!response.success) {
        console.error("Error creating room:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} rooms: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating room:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updatedData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableFields = {
        Id: id,
        number_c: updatedData.number,
        type_c: updatedData.type,
        floor_c: updatedData.floor ? parseInt(updatedData.floor) : undefined,
        maxOccupancy_c: updatedData.maxOccupancy ? parseInt(updatedData.maxOccupancy) : undefined,
        baseRate_c: updatedData.baseRate ? parseFloat(updatedData.baseRate) : (updatedData.pricePerNight ? parseFloat(updatedData.pricePerNight) : undefined),
        status_c: updatedData.status,
        lastCleaned_c: updatedData.lastCleaned
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === null || updateableFields[key] === undefined || updateableFields[key] === '') {
          delete updateableFields[key];
        }
      });

      const response = await apperClient.updateRecord('rooms_c', {
        records: [updateableFields]
      });

      if (!response.success) {
        console.error("Error updating room:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} rooms: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating room:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('rooms_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error("Error deleting room:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} rooms: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting room:", error?.response?.data?.message || error);
      return false;
    }
  }
};
export default roomService;