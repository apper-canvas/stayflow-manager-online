import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ReservationTable from "@/components/organisms/ReservationTable";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Reservations = () => {
  const navigate = useNavigate();
const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh data when page becomes visible/active
useEffect(() => {
    let wasHidden = false;
    
    const handlePageFocus = () => {
      // Only refresh if the window was actually out of focus (not just internal clicks)
      if (wasHidden || !document.hasFocus()) {
        setRefreshTrigger(prev => prev + 1);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasHidden = true;
      } else if (wasHidden) {
        // Only refresh when returning from being hidden
        setRefreshTrigger(prev => prev + 1);
        wasHidden = false;
      }
    };

    window.addEventListener('focus', handlePageFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handlePageFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-1">Manage guest reservations and bookings</p>
        </div>
<Button onClick={() => {
          navigate('/reservations/new');
        }}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search guests or room numbers..."
              onSearch={setSearchQuery}
              showButton={false}
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checkedin">Checked In</option>
              <option value="checkedout">Checked Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
          <Button variant="outline">
            <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-3">
              <ApperIcon name="Calendar" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">145</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-success/10 rounded-full p-3 mr-3">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-info/10 rounded-full p-3 mr-3">
              <ApperIcon name="LogIn" className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Checked In</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-warning/10 rounded-full p-3 mr-3">
              <ApperIcon name="Clock" className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
<ReservationTable 
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default Reservations;