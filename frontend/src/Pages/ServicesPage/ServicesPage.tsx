import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useQuery } from "react-query";

import { fetchServices } from "../../api/GetFetches";
import Booking from "../../features/Booking/Booking";
import { ServiceTypes } from "../../types/Types";
import convertTime from "../../utils/convertTime";
import "./ServicesPage.css";

export default function ServicesPage() {
  const { data, error, isLoading } = useQuery(["services"], fetchServices);

  const [selectedServices, setSelectedServices] = useState({
    id: 0,
    name: "",
    duration: "",
    price: 0,
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (error) {
    console.error(error);
    return;
  }
  if (!data || isLoading) return;

  return (
    <>
      <div
        className={`services-page ${isBookingOpen ? "services-page--darkened" : ""}`}
      >
        <div className="services-page__child">
          <h1 className="services-page__header1">Services</h1>
          {data.map((service: ServiceTypes) => {
            return (
              <article key={service.id} className="services-page__service">
                <div className="services-page__service-container">
                  <div>
                    <h2 className="services-page__header2">
                      {service.name.slice(0, 1).toUpperCase() +
                        service.name.slice(1)}
                    </h2>
                  </div>
                  <div className="services-page__right-side">
                    <div>
                      <p className="services-page__price">{`${service.price.toFixed(2)} PLN`}</p>
                      <p className="services-page__time">
                        {convertTime(service.duration)}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setSelectedServices(service);
                          setIsBookingOpen((prev) => !prev);
                        }}
                        className="services-page__select-button"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="services-page__hr" />
              </article>
            );
          })}
        </div>
      </div>
      {isBookingOpen ? (
        <>
          <div
            className="services-page__overlay"
            onClick={() => setIsBookingOpen(false)}
          ></div>
          <div className="services-page__booking-window-container">
            <div className="services-page__close-button-container">
              <button
                className="services-page__close-button"
                onClick={() => setIsBookingOpen(false)}
              >
                <IoClose />
              </button>
            </div>
            <div className="services-page__booking-window">
              <Booking
                selectedServices={selectedServices}
                serviceDuration={selectedServices.duration}
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
