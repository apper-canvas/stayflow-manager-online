import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

const housekeepingService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('housekeeping_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "roomId_c"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "taskType_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "scheduledFor_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching housekeeping tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(task => ({
        ...task,
        roomId: task.roomId_c,
        roomNumber: task.roomNumber_c,
        taskType: task.taskType_c,
        status: task.status_c,
        priority: task.priority_c,
        assignedTo: task.assignedTo_c,
        scheduledFor: task.scheduledFor_c,
        completedAt: task.completedAt_c,
        notes: task.notes_c
      }));
    } catch (error) {
      console.error("Error fetching housekeeping tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('housekeeping_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "roomId_c"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "taskType_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "scheduledFor_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const task = response.data;
      return {
        ...task,
        roomId: task.roomId_c,
        roomNumber: task.roomNumber_c,
        taskType: task.taskType_c,
        status: task.status_c,
        priority: task.priority_c,
        assignedTo: task.assignedTo_c,
        scheduledFor: task.scheduledFor_c,
        completedAt: task.completedAt_c,
        notes: task.notes_c
      };
    } catch (error) {
      console.error(`Error fetching housekeeping task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableData = {
        Name: taskData.taskType || taskData.Name || `Task-${Date.now()}`,
        roomId_c: taskData.roomId ? parseInt(taskData.roomId) : null,
        roomNumber_c: taskData.roomNumber || '',
        taskType_c: taskData.taskType || '',
        status_c: taskData.status || 'todo',
        priority_c: taskData.priority || 'medium',
        assignedTo_c: taskData.assignedTo || '',
        scheduledFor_c: taskData.scheduledFor || new Date().toISOString(),
        completedAt_c: taskData.completedAt || null,
        notes_c: taskData.notes || ''
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const response = await apperClient.createRecord('housekeeping_c', {
        records: [updateableData]
      });

      if (!response.success) {
        console.error("Error creating housekeeping task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} housekeeping tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating housekeeping task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updatedData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableFields = {
        Id: id,
        roomId_c: updatedData.roomId ? parseInt(updatedData.roomId) : undefined,
        roomNumber_c: updatedData.roomNumber,
        taskType_c: updatedData.taskType,
        status_c: updatedData.status,
        priority_c: updatedData.priority,
        assignedTo_c: updatedData.assignedTo,
        scheduledFor_c: updatedData.scheduledFor,
        completedAt_c: updatedData.completedAt,
        notes_c: updatedData.notes
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === null || updateableFields[key] === undefined || updateableFields[key] === '') {
          delete updateableFields[key];
        }
      });

      const response = await apperClient.updateRecord('housekeeping_c', {
        records: [updateableFields]
      });

      if (!response.success) {
        console.error("Error updating housekeeping task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} housekeeping tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating housekeeping task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('housekeeping_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error("Error deleting housekeeping task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} housekeeping tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting housekeeping task:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default housekeepingService;