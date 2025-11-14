import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import reservationService from "@/services/api/reservationService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import EditReservationModal from "@/components/organisms/EditReservationModal";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const ReservationTable = ({ statusFilter, searchQuery, refreshTrigger }) => {
const [reservations, setReservations] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
const [updatingPayment, setUpdatingPayment] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (err) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [refreshTrigger]);

const handleStatusChange = async (reservation, newStatus) => {
    try {
const result = await reservationService.update(reservation.Id, { status_c: newStatus });
      if (result) {
        setReservations(reservations.map(r => r.Id === reservation.Id ? { ...r, status_c: newStatus } : r));
        toast.success(`Reservation status updated to ${newStatus}`);
      }
    } catch (err) {
toast.error("Failed to update reservation status");
    }
  };

const handlePaymentStatusChange = async (reservation, newStatus) => {
    try {
      setUpdatingPayment(reservation.Id);
      const updatedReservation = await reservationService.update(reservation.Id, {
        paymentStatus_c: newStatus
      });
      setReservations(reservations.map(r => 
        r.Id === reservation.Id ? { ...r, paymentStatus_c: newStatus } : r
      ));
      toast.success("Payment status updated successfully");
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingPayment(null);
    }
  };


  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedReservation(null);
  };

const handleReservationUpdate = async (updatedReservation) => {
    // Force a complete refresh to ensure we have the latest data from server
    await loadReservations();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadReservations} />;

  // Filter reservations
  let filteredReservations = reservations;
  if (statusFilter !== "all") {
filteredReservations = filteredReservations.filter(r => (r.status_c || r.status) === statusFilter);
  }
  if (searchQuery) {
filteredReservations = filteredReservations.filter(r => 
      (r.guestId_c?.Name || r.guestName_c || r.guestName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.roomId_c?.Name || r.roomNumber_c || r.roomNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filteredReservations.length === 0) {
    return (
      <Empty
        title="No reservations found"
        description="No reservations match the current filters."
        icon="Calendar"
      />
    );
  }

return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" onClick={(e) => e.stopPropagation()}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReservations.map((reservation) => (
              <tr key={reservation.Id} className="hover:bg-gray-50 transition-colors duration-150">
<td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-2 mr-3">
                      <ApperIcon name="User" className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.guestId_c?.Name || reservation.guestName_c || reservation.guestName || 'Unknown Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.adults_c || reservation.adults || 0} adults, {reservation.children_c || reservation.children || 0} children
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <ApperIcon name="Home" className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
<div className="text-sm font-medium text-gray-900">
                        Room {reservation.roomId_c?.Name || reservation.roomNumber_c || reservation.roomNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.roomId_c?.type_c || reservation.roomType_c || reservation.roomType || 'Standard'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(reservation?.checkInDate_c || reservation?.checkIn) && !isNaN(new Date(reservation.checkInDate_c || reservation.checkIn).getTime()) 
                    ? format(new Date(reservation.checkInDate_c || reservation.checkIn), "MMM dd, yyyy")
                    : "N/A"}
                </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(reservation?.checkOutDate_c || reservation?.checkOut) && !isNaN(new Date(reservation.checkOutDate_c || reservation.checkOut).getTime()) 
                    ? format(new Date(reservation.checkOutDate_c || reservation.checkOut), "MMM dd, yyyy")
                    : "N/A"}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    ${(reservation.totalAmount_c || 0).toFixed(2)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
<div className="w-32">
                    <Select
                      value={reservation.paymentStatus_c || 'Unpaid'}
                      onChange={(e) => handlePaymentStatusChange(reservation, e.target.value)}
                      disabled={updatingPayment === reservation.Id}
                      className="text-sm"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </Select>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <Select
                    value={reservation.status_c || reservation.status || 'pending'}
                    onChange={(e) => handleStatusChange(reservation, e.target.value)}
                    className="min-w-[140px] text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checkedin">Checked In</option>
                    <option value="checkedout">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="noshow">No Show</option>
                  </Select>
                </td>
                
<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEdit(reservation)}
                    >
                      <ApperIcon name="Edit" className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
))}
          </tbody>
        </table>
      </div>
      
      <EditReservationModal
        reservation={selectedReservation}
        isOpen={editModalOpen}
onClose={handleEditModalClose}
        onUpdate={handleReservationUpdate}
      />

    </div>
  );
};

export default ReservationTable;