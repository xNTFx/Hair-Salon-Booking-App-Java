import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import type { Swiper as SwiperTypes } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { fetchAvaiableHours } from "../../api/GetFetches";
import LoadingPageComponent from "../LoadingComponents/LoadingPageComponent";
import "./TimePicker.css";
import { AvailableHoursTypes } from "../../types/Types";

interface SwiperInterface {
  isBeginning: boolean;
  isEnd: boolean;
  activeIndex: number;
}

type SwiperRef = {
  swiper: SwiperTypes;
};

interface TimePickerProps {
  selectedDate: string | null;
  selectedTime: AvailableHoursTypes | null;
  setSelectedTime: React.Dispatch<
    React.SetStateAction<AvailableHoursTypes | null>
  >;
  employeeId: number | undefined;
  setEmployeeIdForBooking: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  serviceDuration: string;
}

export default function TimePicker({
  selectedDate,
  selectedTime,
  setSelectedTime,
  employeeId,
  setEmployeeIdForBooking,
  serviceDuration,
}: TimePickerProps) {
  const { data, error, isFetching } = useQuery(
    ["availableHours", selectedDate, employeeId, serviceDuration],
    () => fetchAvaiableHours(selectedDate, employeeId, serviceDuration),
    {
      enabled: !!selectedDate,
      keepPreviousData: true,
    }
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [atBeginning, setAtBeginning] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const swiperRef = useRef<SwiperRef | null>(null);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleSlideChange = (swiper: SwiperInterface) => {
    setAtBeginning(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  };

  function renderTime(item: AvailableHoursTypes) {
    return (
      <div
        className={`time-component__button ${
          selectedTime?.startTime === item.startTime
            ? "time-component__time--selected"
            : ""
        }`}
        key={item.id}
      >
        <div className="time-element">
          <div className="time-element__time">
            <h2 className="time-element__heading time-element__heading--h1">
              {item.startTime[0] === "0"
                ? item.startTime.slice(1).split(":").slice(0, 2).join(":")
                : item.startTime.split(":").slice(0, 2).join(":")}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return null;
  }
  if (!data) {
    return null;
  }

  return (
    <div className="timepicker">
      {isFetching ? <LoadingPageComponent /> : null}
      {data.length === 0 ? (
        <div>
          <b>No available time slots for bookingInvalid credentials</b>
        </div>
      ) : (
        <div className="timepicker__container">
          <button
            className={`timepicker__container-button ${atBeginning ? "timepicker__container-button--disabled" : ""}`}
            disabled={atBeginning}
            onClick={() => {
              if (swiperRef.current && !atBeginning) {
                swiperRef.current.swiper.slidePrev();
              }
            }}
          >
            {"<"}
          </button>
          <Swiper
            ref={swiperRef}
            onSlideChange={(swiper) => handleSlideChange(swiper)}
            spaceBetween={10}
            slidesPerView={Math.min(
              data.length,
              windowWidth > 768 ? 5 : windowWidth > 480 ? 3 : 2
            )}
            slidesPerGroup={Math.min(
              data.length,
              windowWidth > 768 ? 5 : windowWidth > 480 ? 3 : 2
            )}
          >
            {data.map((time: AvailableHoursTypes, index: number) => (
              <SwiperSlide
                key={index}
                onClick={() => {
                  setSelectedTime(time);
                  setEmployeeIdForBooking(time.employeeId);
                }}
                style={{ cursor: "pointer" }}
              >
                {renderTime(time)}
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className={`timepicker__container-button ${atEnd ? "timepicker__container-button--disabled" : ""}`}
            disabled={atEnd}
            onClick={() => {
              if (swiperRef.current && !atEnd) {
                swiperRef.current.swiper.slideNext();
              }
            }}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
