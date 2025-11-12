import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const reservationService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('reservations_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "guestName_c"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "roomType_c"}},
          {"field": {"Name": "checkInDate_c"}},
          {"field": {"Name": "checkOutDate_c"}},
          {"field": {"Name": "adults_c"}},
          {"field": {"Name": "children_c"}},
          {"field": {"Name": "totalAmount_c"}},
          {"field": {"Name": "specialRequests_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "guestId_c"}},
          {"field": {"Name": "roomId_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching reservations:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('reservations_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "guestName_c"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "roomType_c"}},
          {"field": {"Name": "checkInDate_c"}},
          {"field": {"Name": "checkOutDate_c"}},
          {"field": {"Name": "adults_c"}},
          {"field": {"Name": "children_c"}},
          {"field": {"Name": "totalAmount_c"}},
          {"field": {"Name": "specialRequests_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "guestId_c"}},
          {"field": {"Name": "roomId_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(reservationData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableData = {
        Name: reservationData.Name || `Reservation-${Date.now()}`,
        guestName_c: reservationData.guestName,
        roomNumber_c: reservationData.roomNumber,
        roomType_c: reservationData.roomType,
        checkInDate_c: reservationData.checkInDate,
        checkOutDate_c: reservationData.checkOutDate,
        adults_c: parseInt(reservationData.adults) || 1,
        children_c: parseInt(reservationData.children) || 0,
        totalAmount_c: parseFloat(reservationData.totalAmount) || 0,
        specialRequests_c: reservationData.specialRequests || '',
        status_c: reservationData.status || 'pending',
        guestId_c: reservationData.guestId ? parseInt(reservationData.guestId) : null,
        roomId_c: reservationData.roomId ? parseInt(reservationData.roomId) : null
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const response = await apperClient.createRecord('reservations_c', {
        records: [updateableData]
      });

      if (!response.success) {
        console.error("Error creating reservation:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} reservations: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating reservation:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updatedData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableFields = {
        Id: id,
        guestName_c: updatedData.guestName,
        roomNumber_c: updatedData.roomNumber,
        roomType_c: updatedData.roomType,
        checkInDate_c: updatedData.checkInDate,
        checkOutDate_c: updatedData.checkOutDate,
        adults_c: updatedData.adults ? parseInt(updatedData.adults) : undefined,
        children_c: updatedData.children ? parseInt(updatedData.children) : undefined,
        totalAmount_c: updatedData.totalAmount ? parseFloat(updatedData.totalAmount) : undefined,
        specialRequests_c: updatedData.specialRequests,
        status_c: updatedData.status,
        guestId_c: updatedData.guestId ? parseInt(updatedData.guestId) : undefined,
        roomId_c: updatedData.roomId ? parseInt(updatedData.roomId) : undefined
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === null || updateableFields[key] === undefined || updateableFields[key] === '') {
          delete updateableFields[key];
        }
      });

      const response = await apperClient.updateRecord('reservations_c', {
        records: [updateableFields]
      });

      if (!response.success) {
        console.error("Error updating reservation:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} reservations: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating reservation:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('reservations_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error("Error deleting reservation:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} reservations: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting reservation:", error?.response?.data?.message || error);
      return false;
    }
  }
};
export default reservationService;