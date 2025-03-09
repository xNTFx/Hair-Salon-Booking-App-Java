import Swal from "sweetalert2";
import convertTime from "../../utils/convertTime";
import "./ReservationsActive.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchActiveReservations, refreshToken } from "../../api/GetFetches";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import LoadingPageComponent from "../../features/LoadingComponents/LoadingPageComponent";
import formatTime from "../../utils/formatTime";
import { Link } from "react-router-dom";
import { cancelReservation } from "../../api/PostFetches";
import { useNotification } from "../../context/NotificationContext";

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
}

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
}

interface Reservation {
  id: number;
  userId: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  service: Service;
  employee: Employee;
}

export default function ReservationsActive() {
  const { user } = useContext(UserContext);
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const refreshResponse = await refreshToken();

        setAccessToken(refreshResponse.data.accessToken);
      }
    };

    fetchToken();
  }, [user]);

  const {
    data: activeReservationsData,
    error: activeReservationsError,
    isFetching: activeReservationsIsFetching,
  } = useQuery(
    ["reservations-active", accessToken],
    () => fetchActiveReservations(accessToken),
    {
      enabled: !!accessToken,
      refetchOnWindowFocus: false,
    }
  );

  const handleClick = (reservationId: number | null) => {
    Swal.fire({
      title: "Are you sure you want to cancel your reservation?",
      icon: "warning",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelReservation(reservationId);
      }
    });
  };

  const mutation = useMutation(async (reservationId: number | null) => {
    const refreshResponse = await refreshToken();

    return cancelReservation(reservationId, refreshResponse.data.accessToken);
  });

  const handleCancelReservation = async (reservationId: number | null) => {
    if (reservationId === null) {
      console.error("ReservationId is null");
      return;
    }
    mutation.mutate(reservationId, {
      onSuccess: () => {
        queryClient.invalidateQueries("reservations-active");

        showNotification("Reservation cancelled successfully", {
          backgroundColor: "green",
          textColor: "white",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error creating reservation", error);
        showNotification("Error cancelling reservation", {
          backgroundColor: "red",
          textColor: "white",
          duration: 3000,
        });
      },
    });
  };

  if (!activeReservationsData) {
    return <LoadingPageComponent />;
  }

  if (activeReservationsError) {
    console.error(activeReservationsError);
    return;
  }

  return (
    <>
      {activeReservationsIsFetching ? <LoadingPageComponent /> : null}
      <div className="reservations-active">
        <div className="reservations-active__container">
          <div className="reservations-history__btn-container">
            <Link
              to="/reservations/active"
              className={
                "reservations-history__btn-selected reservations-history__btn"
              }
            >
              Active Reservations
            </Link>
            <Link
              to="/reservations/history"
              className={
                "reservations-history__btn reservations-history__btn-hover"
              }
            >
              Reservation History
            </Link>
          </div>
          <div>
            <h1 className="reservations-active__header">Active Reservations</h1>
            {activeReservationsData.length === 0 ? (
              <div>No active reservations</div>
            ) : null}
            {activeReservationsData.map((reservationActive: Reservation) => {
              return (
                <div key={reservationActive.id}>
                  <div className="reservation">
                    <div className="reservation__details">
                      <h2 className="reservation__date">
                        {reservationActive.reservationDate +
                          " " +
                          formatTime(reservationActive.startTime)}
                      </h2>
                      <div className="reservation__name">
                        <p className="reservation__name-part">
                          {reservationActive.service.name
                            .slice(0, 1)
                            .toUpperCase() +
                            reservationActive.service.name.slice(1)}
                        </p>
                        <p className="reservation__separator">-</p>
                        <p className="reservation__full-name">
                          {reservationActive.employee.firstName +
                            " " +
                            reservationActive.employee.lastName}
                        </p>
                      </div>
                      <p className="reservation__duration">
                        {convertTime(reservationActive.service.duration)}
                      </p>
                      <p className="reservation__price">
                        <b>{reservationActive.service.price} PLN</b>
                      </p>
                    </div>
                    <button
                      onClick={() => handleClick(reservationActive.id)}
                      className="reservation__remove-button"
                    >
                      Cancel
                    </button>
                  </div>
                  <hr className="reservation__separator-line" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
