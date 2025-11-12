import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "taskType_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "estimatedDuration_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "roomId_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('tasks_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "taskType_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "estimatedDuration_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "roomId_c"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableData = {
        Name: taskData.title || taskData.Name || `Task-${Date.now()}`,
        roomNumber_c: taskData.roomNumber,
        taskType_c: taskData.title || taskData.taskType,
        description_c: taskData.description,
        priority_c: taskData.priority || 'medium',
        status_c: taskData.status || 'pending',
        assignedTo_c: taskData.assignedTo || '',
        estimatedDuration_c: taskData.estimatedDuration ? parseInt(taskData.estimatedDuration) : null,
        notes_c: taskData.notes || '',
        completedAt_c: taskData.completedAt || null,
        roomId_c: taskData.roomId ? parseInt(taskData.roomId) : null
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === null || updateableData[key] === undefined || updateableData[key] === '') {
          delete updateableData[key];
        }
      });

      const response = await apperClient.createRecord('tasks_c', {
        records: [updateableData]
      });

      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, updatedData) {
    try {
      const apperClient = getApperClient();
      
      // Filter only updateable fields
      const updateableFields = {
        Id: id,
        roomNumber_c: updatedData.roomNumber,
        taskType_c: updatedData.title || updatedData.taskType,
        description_c: updatedData.description,
        priority_c: updatedData.priority,
        status_c: updatedData.status,
        assignedTo_c: updatedData.assignedTo,
        estimatedDuration_c: updatedData.estimatedDuration ? parseInt(updatedData.estimatedDuration) : undefined,
        notes_c: updatedData.notes,
        completedAt_c: updatedData.completedAt,
        roomId_c: updatedData.roomId ? parseInt(updatedData.roomId) : undefined
      };

      // Remove fields with null, undefined, or empty string values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === null || updateableFields[key] === undefined || updateableFields[key] === '') {
          delete updateableFields[key];
        }
      });

      const response = await apperClient.updateRecord('tasks_c', {
        records: [updateableFields]
      });

      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('tasks_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByRoomId(roomId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "taskType_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "estimatedDuration_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "roomId_c"}}
        ],
        where: [{
          "FieldName": "roomId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(roomId)]
        }]
      });

      if (!response.success) {
        console.error("Error fetching tasks by room:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by room:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "roomNumber_c"}},
          {"field": {"Name": "taskType_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "assignedTo_c"}},
          {"field": {"Name": "estimatedDuration_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "completedAt_c"}},
          {"field": {"Name": "roomId_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }]
      });

      if (!response.success) {
        console.error("Error fetching tasks by status:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export { taskService };
export default taskService;