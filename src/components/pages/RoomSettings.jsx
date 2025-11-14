import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import roomService from '@/services/api/roomService';
import RoomForm from '@/components/organisms/RoomForm';
import RoomList from '@/components/organisms/RoomList';
import { Button } from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { Card } from '@/components/atoms/Card';

const RoomSettings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getAll();
      setRooms(data || []);
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError('Failed to load rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [refreshTrigger]);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await roomService.delete(roomId);
      if (success) {
        toast.success('Room deleted successfully');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Error deleting room');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (editingRoom) {
        result = await roomService.update(editingRoom.Id, formData);
        if (result) {
          toast.success('Room updated successfully');
        }
      } else {
        result = await roomService.create(formData);
        if (result) {
          toast.success('Room created successfully');
        }
      }

      if (result) {
        setShowForm(false);
        setEditingRoom(null);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(`Error ${editingRoom ? 'updating' : 'creating'} room`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                onClick={handleFormCancel}
                className="p-2"
              >
                <ApperIcon name="ArrowLeft" className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h1>
            </div>
            <p className="text-gray-600">
              {editingRoom ? 'Update room information and settings' : 'Create a new room with all necessary details'}
            </p>
          </div>

          <Card className="p-6">
            <RoomForm
              initialData={editingRoom}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              loading={false}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Settings</h1>
              <p className="text-gray-600">
                Manage room inventory, rates, and configurations
              </p>
            </div>
            <Button 
              onClick={handleAddRoom}
              className="btn-primary"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="Bed" className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success/10 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rooms.filter(r => r.status === 'available').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-info/10 rounded-lg">
                <ApperIcon name="Users" className="h-6 w-6 text-info" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rooms.filter(r => r.status === 'occupied').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning/10 rounded-lg">
                <ApperIcon name="Wrench" className="h-6 w-6 text-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rooms.filter(r => r.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Room List */}
        <Card>
          <RoomList
            rooms={rooms}
            loading={loading}
            error={error}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
          />
        </Card>
      </div>
    </div>
  );
};

export default RoomSettings;