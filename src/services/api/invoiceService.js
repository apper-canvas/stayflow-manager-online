import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const invoiceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('invoices_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "guestName_c"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "issuedAt_c"}},
          {"field": {"Name": "paymentStatus_c"}},
          {"field": {"Name": "paymentMethod_c"}},
          {"field": {"Name": "roomCharges_c"}},
          {"field": {"Name": "serviceCharges_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "totalAmount_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "guestId_c"}},
          {"field": {"Name": "reservationId_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching invoices:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('invoices_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "guestName_c"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "issuedAt_c"}},
          {"field": {"Name": "paymentStatus_c"}},
          {"field": {"Name": "paymentMethod_c"}},
          {"field": {"Name": "roomCharges_c"}},
          {"field": {"Name": "serviceCharges_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "totalAmount_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "guestId_c"}},
          {"field": {"Name": "reservationId_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(invoiceData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableData = {
        Name: invoiceData.Name || `Invoice-${Date.now()}`,
        guestName_c: invoiceData.guestName,
        roomNumber_c: invoiceData.roomNumber,
        issuedAt_c: invoiceData.issuedAt || new Date().toISOString(),
        paymentStatus_c: invoiceData.paymentStatus || 'unpaid',
        paymentMethod_c: invoiceData.paymentMethod || '',
        roomCharges_c: parseFloat(invoiceData.roomCharges) || 0,
        serviceCharges_c: JSON.stringify(invoiceData.serviceCharges || []),
        tax_c: parseFloat(invoiceData.tax) || 0,
        totalAmount_c: parseFloat(invoiceData.totalAmount) || 0,
        notes_c: invoiceData.notes || '',
        guestId_c: invoiceData.guestId ? parseInt(invoiceData.guestId) : null,
        reservationId_c: invoiceData.reservationId ? parseInt(invoiceData.reservationId) : null
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const response = await apperClient.createRecord('invoices_c', {
        records: [updateableData]
      });

      if (!response.success) {
        console.error("Error creating invoice:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} invoices: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating invoice:", error?.response?.data?.message || error);
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
        issuedAt_c: updatedData.issuedAt,
        paymentStatus_c: updatedData.paymentStatus,
        paymentMethod_c: updatedData.paymentMethod,
        roomCharges_c: updatedData.roomCharges ? parseFloat(updatedData.roomCharges) : undefined,
        serviceCharges_c: updatedData.serviceCharges ? JSON.stringify(updatedData.serviceCharges) : undefined,
        tax_c: updatedData.tax ? parseFloat(updatedData.tax) : undefined,
        totalAmount_c: updatedData.totalAmount ? parseFloat(updatedData.totalAmount) : undefined,
        notes_c: updatedData.notes,
        guestId_c: updatedData.guestId ? parseInt(updatedData.guestId) : undefined,
        reservationId_c: updatedData.reservationId ? parseInt(updatedData.reservationId) : undefined
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === null || updateableFields[key] === undefined || updateableFields[key] === '') {
          delete updateableFields[key];
        }
      });

      const response = await apperClient.updateRecord('invoices_c', {
        records: [updateableFields]
      });

      if (!response.success) {
        console.error("Error updating invoice:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} invoices: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating invoice:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('invoices_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error("Error deleting invoice:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} invoices: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting invoice:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default invoiceService;

export default invoiceService;