import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import roomService from "@/services/api/roomService";
import RoomCard from "@/components/molecules/RoomCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import RoomDetailsModal from "@/components/organisms/RoomDetailsModal";

const RoomsGrid = ({ selectedFloor, statusFilter }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadRooms();
  }, []);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const room = rooms.find(r => r.Id === roomId);
      if (!room) return;

      const updatedData = { status: newStatus };
      const result = await roomService.update(roomId, updatedData);
      
      if (result) {
        setRooms(rooms.map(r => r.Id === roomId ? { ...r, ...result } : r));
        toast.success(`Room ${room.number} status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update room status");
    }
};

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

const handleRoomUpdated = (updatedRoom) => {
    setRooms(rooms.map(r => r.Id === updatedRoom.Id ? updatedRoom : r));
    setShowDetails(false);
  };

if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadRooms} />;

  let filteredRooms = rooms;
  if (selectedFloor !== "all") {
    filteredRooms = filteredRooms.filter(room => {
      const floor = parseInt(room.floor || room.floor_c);
      return floor === parseInt(selectedFloor);
    });
  }
  if (statusFilter !== "all") {
    filteredRooms = filteredRooms.filter(room => {
      const status = room.status || room.status_c;
      return status === statusFilter;
    });
  }

  if (filteredRooms.length === 0) {
    return (
      <Empty
        title="No rooms found"
        description="No rooms match the current filters."
        icon="Bed"
      />
    );
  }
return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.Id} className="group">
            <RoomCard
              room={room}
              onClick={() => handleRoomClick(room)}
              onStatusChange={handleStatusChange}
            />
          </div>
        ))}
      </div>
      <RoomDetailsModal
        room={selectedRoom}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onRoomUpdated={handleRoomUpdated}
        allRooms={rooms}
      />
    </>
</>
  );
};

export default RoomsGrid;