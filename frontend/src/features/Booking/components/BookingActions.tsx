import { CreateReservationTypes } from "../../../types/Types";
import addTime from "../../../utils/addTime";

interface BookingActionsProps {
  selectedDate: string;
  selectedServices: { id: number };
  selectedTime: { startTime: string } | null;
  serviceDuration: string;
  employeeIdForBooking: number | undefined;
  handleCreateReservation: (reservationData: CreateReservationTypes) => void;
}

export default function BookingActions({
  selectedDate,
  selectedServices,
  selectedTime,
  serviceDuration,
  employeeIdForBooking,
  handleCreateReservation,
}: BookingActionsProps) {
  return (
    <div className="booking__btn-container">
      <button
        onClick={async () => {
          try {
            const reservationData: CreateReservationTypes = {
              reservationDate: selectedDate,
              service: { id: selectedServices.id },
              employee: { employeeId: employeeIdForBooking },
              startTime: selectedTime?.startTime,
              endTime: addTime(selectedTime?.startTime, serviceDuration),
            };

            await handleCreateReservation(reservationData);
          } catch (error) {
            console.error("Error retrieving ID token: ", error);
          }
        }}
        className="booking__btn"
        style={!selectedTime ? { opacity: "0.1" } : undefined}
        disabled={!selectedTime}
      >
        Book
      </button>
    </div>
  );
}
