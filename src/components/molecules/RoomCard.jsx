import { Card, CardContent } from "@/components/atoms/Card";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";

const RoomCard = ({ room, onClick, onStatusChange }) => {
  const statusColors = {
    available: "border-l-success bg-success/5",
    occupied: "border-l-info bg-info/5",
    cleaning: "border-l-warning bg-warning/5", 
    maintenance: "border-l-error bg-error/5"
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
                <h3 className="text-lg font-bold text-gray-900">Room {room.number}
                </h3>
                <p className="text-sm text-gray-500">{room.type}</p>
            </div>
            <StatusBadge status={room.status} />
        </div>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
                <ApperIcon name="Users" className="h-4 w-4" />
                <span>Max {room.maxOccupancy}guests</span>
            </div>
            <div className="flex items-center gap-2">
                <ApperIcon name="DollarSign" className="h-4 w-4" />
                <span>${room.baseRate}/night</span>
                <div className="flex items-center gap-2">
                    <ApperIcon name="DollarSign" className="h-4 w-4" />
                    <span>${room.baseRate}/night</span>
                </div>
            </div>
            {/* Special Features Indicators */}
            <div className="flex flex-wrap gap-2 mb-4">
                {room.petFriendly && <span
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    <ApperIcon name="PawPrint" className="h-3 w-3" />Pet Friendly
                                </span>}
                {room.accessible && <span
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    <ApperIcon name="Accessibility" className="h-3 w-3" />Accessible
                                </span>}
                {room.connectedRooms && <span
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    <ApperIcon name="Layers" className="h-3 w-3" />Connected
                                </span>}
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                        e.stopPropagation();
                        onStatusChange?.(room.Id, "available");
                    }}
                    className="flex-1">
                    <ApperIcon name="CheckCircle" className="h-3 w-3 mr-1" />Available
                              </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                        e.stopPropagation();
                        onStatusChange?.(room.Id, "cleaning");
                    }}
                    className="flex-1">
                    <ApperIcon name="Sparkles" className="h-3 w-3 mr-1" />Clean
                              </Button>
            </div>
        </div></CardContent>
</Card>
  );
};

export default RoomCard;