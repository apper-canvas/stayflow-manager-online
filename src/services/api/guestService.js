import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

// Delay function for mock service simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Safe JSON parsing utility function
const safeJsonParse = (value, fallback) => {
  if (!value) return fallback;
  
  if (typeof value === 'object') return value;
  
  if (typeof value === 'string') {
    try {
      // Check if it's a valid JSON string
      const trimmed = value.trim();
      if (!trimmed) return fallback;
      
      // Must start with { or [ for valid JSON objects/arrays
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return fallback;
      }
      
      return JSON.parse(trimmed);
    } catch (error) {
      console.warn('Invalid JSON data, using fallback:', error.message);
      return fallback;
    }
}
  
  return fallback;
};
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
          {"field": {"Name": "stayHistory_c"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_type_c"}},
{"field": {"Name": "designation_job_title_c"}}
        ]
      });

      if (!response.success) {

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
        address: safeJsonParse(guest.address_c, {}),
        preferences: guest.preferences_c?.split(',') || [],
        allergies: guest.allergies_c ? guest.allergies_c.split('\n').filter(a => a.trim()) : [],
        stayNotes: guest.stayNotes_c || '',
        stayHistory: safeJsonParse(guest.stayHistory_c, []),
        guestId: guest.guest_id_c || '',
        guestType: guest.guest_type_c || '',
        companyName: guest.company_name_c || '',
        gstNumberTaxId: guest.gst_number_tax_id_c || '',
        designationJobTitle: guest.designation_job_title_c || ''
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
          {"field": {"Name": "stayHistory_c"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_type_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "gst_number_tax_id_c"}},
          {"field": {"Name": "designation_job_title_c"}}
        ]
      });
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
          {"field": {"Name": "stayHistory_c"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_type_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "gst_number_tax_id_c"}},
          {"field": {"Name": "designation_job_title_c"}}
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
          {"field": {"Name": "stayHistory_c"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_type_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "gst_number_tax_id_c"}},
          {"field": {"Name": "designation_job_title_c"}}

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
        address: safeJsonParse(guest.address_c, {}),
        preferences: guest.preferences_c?.split(',') || [],
        allergies: guest.allergies_c ? guest.allergies_c.split('\n').filter(a => a.trim()) : [],
        stayNotes: guest.stayNotes_c || '',
        stayHistory: safeJsonParse(guest.stayHistory_c, []),
        guestId: guest.guest_id_c || '',
        guestType: guest.guest_type_c || '',
        companyName: guest.company_name_c || '',
        gstNumberTaxId: guest.gst_number_tax_id_c || '',
        designationJobTitle: guest.designation_job_title_c || ''
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
        vipStatus_c: guestData.vipStatus || false,
        guest_type_c: guestData.guestType || '',
        company_name_c: guestData.companyName || '',
        gst_number_tax_id_c: guestData.gstNumberTaxId || '',
        designation_job_title_c: guestData.designationJobTitle || ''
      };

      // Handle preferences as comma-separated string
      if (guestData.preferences && Array.isArray(guestData.preferences) && guestData.preferences.length > 0) {
        updateableData.preferences_c = guestData.preferences.join(',');
      }

      // Handle allergies as newline-separated string
      if (guestData.allergies && Array.isArray(guestData.allergies) && guestData.allergies.length > 0) {
        updateableData.allergies_c = guestData.allergies.join('\n');
      }

      // Handle optional fields
      if (guestData.address && typeof guestData.address === 'object') {
        updateableData.address_c = JSON.stringify(guestData.address);
      }

      if (guestData.stayNotes) {
        updateableData.stayNotes_c = guestData.stayNotes;
      }

      if (guestData.stayHistory && Array.isArray(guestData.stayHistory)) {
        updateableData.stayHistory_c = JSON.stringify(guestData.stayHistory);
      }

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
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
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
        vipStatus_c: updatedData.vipStatus,
        guest_type_c: updatedData.guestType,
        company_name_c: updatedData.companyName,
        gst_number_tax_id_c: updatedData.gstNumberTaxId,
        designation_job_title_c: updatedData.designationJobTitle
      };

      // Handle preferences as comma-separated string
      if (updatedData.preferences && Array.isArray(updatedData.preferences) && updatedData.preferences.length > 0) {
        updateableFields.preferences_c = updatedData.preferences.join(',');
      }

      // Handle allergies as newline-separated string
      if (updatedData.allergies && Array.isArray(updatedData.allergies) && updatedData.allergies.length > 0) {
        updateableFields.allergies_c = updatedData.allergies.join('\n');
      }

      // Handle optional fields
      if (updatedData.address && typeof updatedData.address === 'object') {
        updateableFields.address_c = JSON.stringify(updatedData.address);
      }

      if (updatedData.stayNotes) {
        updateableFields.stayNotes_c = updatedData.stayNotes;
      }

      if (updatedData.stayHistory && Array.isArray(updatedData.stayHistory)) {
        updateableFields.stayHistory_c = JSON.stringify(updatedData.stayHistory);
      }

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
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
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