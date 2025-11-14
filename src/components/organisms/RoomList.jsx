import React, { useState, useMemo } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ErrorView from '@/components/ui/ErrorView';
import { cn } from '@/utils/cn';

const RoomList = ({ rooms, loading, error, onEdit, onDelete, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'out-of-order', label: 'Out of Order' }
  ];

  const typeOptions = useMemo(() => {
    const types = [...new Set(rooms.map(room => room.type).filter(Boolean))];
    return [
      { value: '', label: 'All Types' },
      ...types.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))
    ];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = !searchTerm || 
        room.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.Name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || room.status === statusFilter;
      const matchesType = !typeFilter || room.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, searchTerm, statusFilter, typeFilter]);

  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRooms, currentPage]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'info';
      case 'cleaning': return 'warning';
      case 'maintenance': return 'error';
      case 'out-of-order': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading message="Loading rooms..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorView 
          message={error}
          onRetry={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by room number, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full sm:w-auto"
        >
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Button
          variant="ghost"
          onClick={onRefresh}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Results Summary */}
      {searchTerm || statusFilter || typeFilter ? (
        <div className="text-sm text-gray-600">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </div>
      ) : null}

      {/* Room Table */}
      {filteredRooms.length === 0 ? (
        <Empty 
          title="No rooms found"
          description={
            searchTerm || statusFilter || typeFilter
              ? "Try adjusting your search criteria"
              : "No rooms have been created yet"
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Room</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Floor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Occupancy</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Cleaned</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRooms.map((room) => (
                  <tr key={room.Id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {room.number || `Room ${room.Id}`}
                        </div>
                        <div className="text-sm text-gray-500">{room.Name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-gray-900">
                        {room.type || 'Not specified'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {room.floor || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {room.maxOccupancy || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {formatCurrency(room.baseRate || room.pricePerNight)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadgeVariant(room.status)}>
                        {room.status ? room.status.charAt(0).toUpperCase() + room.status.slice(1) : 'Unknown'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatDate(room.lastCleaned)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(room)}
                          className="p-2"
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(room.Id)}
                          className="p-2 text-error hover:text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRooms.length)} of {filteredRooms.length} rooms
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 p-0",
                        currentPage === page && "bg-primary text-white"
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ApperIcon name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomList;