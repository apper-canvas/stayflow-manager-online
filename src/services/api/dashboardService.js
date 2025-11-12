import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const getRoomStats = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('rooms_c', {
      fields: [
        {"field": {"Name": "status_c"}}
      ]
    });

    if (!response.success) {
      console.error("Error fetching room stats:", response.message);
      return {
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        occupancyRate: 0
      };
    }

    const rooms = response.data || [];
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(room => room.status_c === "available").length;
    const occupiedRooms = rooms.filter(room => room.status_c === "occupied").length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      occupancyRate
    };
  } catch (error) {
    console.error("Error fetching room stats:", error?.response?.data?.message || error);
    return {
      totalRooms: 0,
      availableRooms: 0,
      occupiedRooms: 0,
      occupancyRate: 0
    };
  }
};

export const getReservationStats = async () => {
  try {
    const apperClient = getApperClient();
    const today = new Date().toISOString().split("T")[0];
    
    const response = await apperClient.fetchRecords('reservations_c', {
      fields: [
        {"field": {"Name": "checkInDate_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "totalAmount_c"}}
      ],
      where: [{
        "FieldName": "checkInDate_c",
        "Operator": "EqualTo",
        "Values": [today]
      }]
    });

    if (!response.success) {
      console.error("Error fetching reservation stats:", response.message);
      return {
        checkInsToday: 0,
        todayRevenue: 0
      };
    }

    const reservations = response.data || [];
    const checkInsToday = reservations.filter(r => r.status_c === "confirmed").length;
    
    // Calculate today's revenue
    const todayRevenue = reservations.reduce((sum, r) => {
      return sum + (parseFloat(r.totalAmount_c) || 0);
    }, 0);
    
    return {
      checkInsToday,
      todayRevenue
    };
  } catch (error) {
    console.error("Error fetching reservation stats:", error?.response?.data?.message || error);
    return {
      checkInsToday: 0,
      todayRevenue: 0
    };
  }
};