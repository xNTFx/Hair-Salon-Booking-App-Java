import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { fetchEmployees, refreshToken } from "../../api/GetFetches";
import {
  createReservationWithoutAuth,
  createReservationWithAuth,
} from "../../api/PostFetches";
import useGenerateDates from "../../hooks/useGenerateDates";
import LoadingPageComponent from "../LoadingComponents/LoadingPageComponent";
import "./Booking.css";
import { UserContext } from "../../context/UserContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { AvailableHoursTypes, EmployeesType, CreateReservationTypes } from "../../types/Types";
import EmployeeSelection from "./components/EmployeeSelection";
import DateAndTimeSelection from "./components/DateAndTimeSelection";
import ServiceDetails from "./components/ServiceDetails";
import BookingActions from "./components/BookingActions";

export interface BookingProps {
  selectedServices: {
    id: number;
    name: string;
    duration: string;
    price: number;
  };
  serviceDuration: string;
}

export default function Booking({ selectedServices, serviceDuration }: BookingProps) {
  const { user } = useContext(UserContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { data, error, isFetching } = useQuery(["employees"], fetchEmployees);
  const mutation = useMutation(
    async (reservationData: CreateReservationTypes) => {
      if (user?.id !== "0" && user?.id) {
        try {
          const refreshResponse = await refreshToken();
          return createReservationWithAuth(
            reservationData,
            refreshResponse.data.accessToken
          );
        } catch (error) {
          console.error(error);
        }
      }

      return createReservationWithoutAuth(reservationData);
    }
  );

  const handleCreateReservation = async (reservationData: CreateReservationTypes) => {
    mutation.mutate(reservationData, {
      onSuccess: () => {
        navigate("/");
        showNotification("Reservation successfully made!", {
          backgroundColor: "green",
          textColor: "white",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error creating reservation", error);
        showNotification("Error when creating a reservation!", {
          backgroundColor: "red",
          textColor: "white",
          duration: 3000,
        });
      },
    });
  };

  const generateDates = useGenerateDates();
  const listOfDates = generateDates();

  const [selectedDate, setSelectedDate] = useState(listOfDates[0]);
  const [selectedTime, setSelectedTime] = useState<AvailableHoursTypes | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeesType | null>({
    employeeId: 0,
    firstName: "Anyone",
    lastName: undefined,
  });
  const [employeeIdForBooking, setEmployeeIdForBooking] = useState(selectedEmployee?.employeeId);
  const [isEmployeeSelect, setIsEmployeeSelect] = useState(false);

  if (error) {
    console.error(error);
    return;
  }
  if (isFetching) {
    return <LoadingPageComponent />;
  }
  if (!data) {
    return;
  }

  return isEmployeeSelect ? (
    <EmployeeSelection
      employeesData={data}
      setIsEmployeeSelect={setIsEmployeeSelect}
      setSelectedEmployee={setSelectedEmployee}
      setSelectedTime={setSelectedTime}
    />
  ) : (
    <div className="booking">
      <DateAndTimeSelection
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedEmployee={selectedEmployee}
        setEmployeeIdForBooking={setEmployeeIdForBooking}
        serviceDuration={serviceDuration}
      />
      <hr />
      <ServiceDetails
        selectedServices={selectedServices}
        selectedEmployee={selectedEmployee}
        setIsEmployeeSelect={setIsEmployeeSelect}
      />
      <hr />
      <BookingActions
        selectedDate={selectedDate}
        selectedServices={selectedServices}
        selectedTime={selectedTime}
        serviceDuration={serviceDuration}
        employeeIdForBooking={employeeIdForBooking}
        handleCreateReservation={handleCreateReservation}
      />
    </div>
  );
}
