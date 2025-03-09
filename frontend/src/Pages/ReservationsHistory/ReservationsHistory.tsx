import convertTime from "../../utils/convertTime";
import "./ReservationsHistory.css";
import { useQuery } from "react-query";
import { fetchHistoryReservations, refreshToken } from "../../api/GetFetches";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import LoadingPageComponent from "../../features/LoadingComponents/LoadingPageComponent";
import formatTime from "../../utils/formatTime";
import { Link } from "react-router-dom";

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

export default function ReservationsHistory() {
  const { user } = useContext(UserContext);

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
    data: historyReservationsData,
    error: historyReservationsError,
    isFetching: historyReservationsIsFetching,
  } = useQuery(
    ["reservations-history", accessToken],
    () => fetchHistoryReservations(accessToken),
    {
      enabled: !!accessToken,
      refetchOnWindowFocus: false,
    }
  );

  if (!historyReservationsData) {
    return <LoadingPageComponent />;
  }

  if (historyReservationsError) {
    console.error(historyReservationsError);
    return;
  }

  return (
    <>
      {historyReservationsIsFetching ? <LoadingPageComponent /> : null}
      <div className="reservations-history">
        <div className="reservations-history__container">
          <div className="reservations-history__btn-container">
            <Link
              to="/reservations/active"
              className={
                "reservations-history__btn reservations-history__btn-hover"
              }
            >
              Active Reservations
            </Link>
            <Link
              to="/reservations/history"
              className={
                "reservations-history__btn-selected reservations-history__btn"
              }
            >
              Reservation History
            </Link>
          </div>
          <div>
            <h1 className="reservations-history__header">
              Reservation History
            </h1>
            {historyReservationsData.length === 0 ? (
              <div>No reservation history</div>
            ) : null}
            {historyReservationsData.map((reservationHistory: Reservation) => {
              return (
                <div key={reservationHistory.id}>
                  <div className="reservation">
                    <div className="reservation__details">
                      <h2 className="reservation__date">
                        {reservationHistory.reservationDate +
                          " " +
                          formatTime(reservationHistory.startTime)}
                      </h2>
                      <div className="reservation__name">
                        <p className="reservation__name-part">
                          {reservationHistory.service.name
                            .slice(0, 1)
                            .toUpperCase() +
                            reservationHistory.service.name.slice(1)}
                        </p>
                        <p className="reservation__separator">-</p>
                        <p className="reservation__full-name">
                          {reservationHistory.employee.firstName +
                            " " +
                            reservationHistory.employee.lastName}
                        </p>
                      </div>
                      <p className="reservation__duration">
                        {convertTime(reservationHistory.service.duration)}
                      </p>
                      <p className="reservation__price">
                        <b>{reservationHistory.service.price} PLN</b>
                      </p>
                    </div>
                    <div
                      style={
                        reservationHistory.status === "CANCELLED"
                          ? { color: "red" }
                          : { color: "green" }
                      }
                      className="reservation__status"
                    >
                      <p>{reservationHistory.status}</p>
                    </div>
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
