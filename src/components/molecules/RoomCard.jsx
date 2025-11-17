import { Card, CardContent } from "@/components/atoms/Card";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";

const RoomCard = ({ room, onClick, onStatusChange }) => {
  const statusColors = {
    available: "border-success",
    occupied: "border-info",
    cleaning: "border-warning",
    maintenance: "border-error"
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleBook = (e) => {
    e.stopPropagation();
    // Book action - can be extended with navigation or modal
    console.info("Book room:", room.number);
  };

  const handleBlock = (e) => {
    e.stopPropagation();
    onStatusChange?.(room.Id, "maintenance");
  };

  return (
    <Card
    className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
        statusColors[room.status]
    )}
    onClick={onClick}>
<CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
            <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Room {room.number || room.number_c}
                </h3>
                <p className="text-sm text-gray-500">{room.type || room.type_c}</p>
            </div>
            <StatusBadge status={room.status || room.status_c} />
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
                <ApperIcon name="Building" className="h-4 w-4" />
                <span>Floor {room.floor || room.floor_c}</span>
            </div>
            <div className="flex items-center gap-2">
                <ApperIcon name="Users" className="h-4 w-4" />
                <span>Max {room.maxOccupancy || room.maxOccupancy_c} guests</span>
            </div>
            <div className="flex items-center gap-2">
                <ApperIcon name="DollarSign" className="h-4 w-4" />
                <span>${room.baseRate || room.baseRate_c}/night</span>
            </div>
        </div>

        {/* Special Features Indicators - Show on Hover */}
        <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {(room.petFriendly || room.petFriendly_c) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                <ApperIcon name="PawPrint" className="h-3 w-3" />
                Pet Friendly
              </span>
            )}
            {(room.accessible || room.accessible_c) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                <ApperIcon name="Accessibility" className="h-3 w-3" />
                Accessible
              </span>
            )}
            {(room.connectedRooms || room.connectedRooms_c) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                <ApperIcon name="Layers" className="h-3 w-3" />
                Connected
              </span>
            )}
        </div>
{/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
            <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="flex items-center justify-center gap-1"
                title="Edit room details"
            >
                <ApperIcon name="Edit2" className="h-3 w-3" />
                Edit
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                className="flex items-center justify-center gap-1"
                title="View full details"
            >
                <ApperIcon name="Eye" className="h-3 w-3" />
                Details
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={handleBook}
                className="flex items-center justify-center gap-1"
                title="Book this room"
            >
                <ApperIcon name="Calendar" className="h-3 w-3" />
                Book
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={handleBlock}
                className="flex items-center justify-center gap-1 text-warning hover:bg-warning/10"
                title="Block room for maintenance"
            >
                <ApperIcon name="Lock" className="h-3 w-3" />
                Block
            </Button>
        </div>
    </CardContent>
</Card>
  );
};

export default RoomCard;