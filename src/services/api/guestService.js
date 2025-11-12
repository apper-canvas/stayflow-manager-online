import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

const guestService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('guests_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "idType_c"}},
          {"field": {"Name": "idNumber_c"}},
          {"field": {"Name": "vipStatus_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "stayNotes_c"}},
          {"field": {"Name": "stayHistory_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching guests:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(guest => ({
        ...guest,
        firstName: guest.firstName_c || '',
        lastName: guest.lastName_c || '',
        email: guest.email_c || '',
        phone: guest.phone_c || '',
        idType: guest.idType_c || '',
        idNumber: guest.idNumber_c || '',
        vipStatus: guest.vipStatus_c || false,
        address: guest.address_c ? (typeof guest.address_c === 'string' ? JSON.parse(guest.address_c) : guest.address_c) : {},
        preferences: guest.preferences_c ? (typeof guest.preferences_c === 'string' ? guest.preferences_c.split(',') : guest.preferences_c) : [],
        allergies: guest.allergies_c ? (typeof guest.allergies_c === 'string' ? guest.allergies_c.split('\n') : guest.allergies_c) : [],
        stayNotes: guest.stayNotes_c || '',
        stayHistory: guest.stayHistory_c ? (typeof guest.stayHistory_c === 'string' ? JSON.parse(guest.stayHistory_c) : guest.stayHistory_c) : []
      }));
    } catch (error) {
      console.error("Error fetching guests:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('guests_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "idType_c"}},
          {"field": {"Name": "idNumber_c"}},
          {"field": {"Name": "vipStatus_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "stayNotes_c"}},
          {"field": {"Name": "stayHistory_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const guest = response.data;
      return {
        ...guest,
        firstName: guest.firstName_c || '',
        lastName: guest.lastName_c || '',
        email: guest.email_c || '',
        phone: guest.phone_c || '',
        idType: guest.idType_c || '',
        idNumber: guest.idNumber_c || '',
        vipStatus: guest.vipStatus_c || false,
        address: guest.address_c ? (typeof guest.address_c === 'string' ? JSON.parse(guest.address_c) : guest.address_c) : {},
        preferences: guest.preferences_c ? (typeof guest.preferences_c === 'string' ? guest.preferences_c.split(',') : guest.preferences_c) : [],
        allergies: guest.allergies_c ? (typeof guest.allergies_c === 'string' ? guest.allergies_c.split('\n') : guest.allergies_c) : [],
        stayNotes: guest.stayNotes_c || '',
        stayHistory: guest.stayHistory_c ? (typeof guest.stayHistory_c === 'string' ? JSON.parse(guest.stayHistory_c) : guest.stayHistory_c) : []
      };
    } catch (error) {
      console.error(`Error fetching guest ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(guestData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields and transform to database format
      const updateableData = {
        Name: `${guestData.firstName || ''} ${guestData.lastName || ''}`.trim() || `Guest-${Date.now()}`,
        firstName_c: guestData.firstName || '',
        lastName_c: guestData.lastName || '',
        email_c: guestData.email || '',
        phone_c: guestData.phone || '',
        idType_c: guestData.idType || '',
        idNumber_c: guestData.idNumber || '',
        vipStatus_c: Boolean(guestData.vipStatus),
        address_c: guestData.address ? JSON.stringify(guestData.address) : '',
        preferences_c: Array.isArray(guestData.preferences) ? guestData.preferences.join(',') : '',
        allergies_c: Array.isArray(guestData.allergies) ? guestData.allergies.join('\n') : (guestData.allergies || ''),
        stayNotes_c: guestData.stayNotes || '',
        stayHistory_c: JSON.stringify(guestData.stayHistory || [])
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const response = await apperClient.createRecord('guests_c', {
        records: [updateableData]
      });

      if (!response.success) {
        console.error("Error creating guest:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} guests: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating guest:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updatedData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields and transform to database format
      const updateableFields = {
        Id: id,
        firstName_c: updatedData.firstName,
        lastName_c: updatedData.lastName,
        email_c: updatedData.email,
        phone_c: updatedData.phone,
        idType_c: updatedData.idType,
        idNumber_c: updatedData.idNumber,
        vipStatus_c: updatedData.vipStatus !== undefined ? Boolean(updatedData.vipStatus) : undefined,
        address_c: updatedData.address ? JSON.stringify(updatedData.address) : undefined,
        preferences_c: updatedData.preferences ? (Array.isArray(updatedData.preferences) ? updatedData.preferences.join(',') : updatedData.preferences) : undefined,
        allergies_c: updatedData.allergies ? (Array.isArray(updatedData.allergies) ? updatedData.allergies.join('\n') : updatedData.allergies) : undefined,
        stayNotes_c: updatedData.stayNotes,
        stayHistory_c: updatedData.stayHistory ? JSON.stringify(updatedData.stayHistory) : undefined
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === null || updateableFields[key] === undefined || updateableFields[key] === '') {
          delete updateableFields[key];
        }
      });

      const response = await apperClient.updateRecord('guests_c', {
        records: [updateableFields]
      });

      if (!response.success) {
        console.error("Error updating guest:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} guests: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating guest:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('guests_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error("Error deleting guest:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} guests: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting guest:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default guestService;