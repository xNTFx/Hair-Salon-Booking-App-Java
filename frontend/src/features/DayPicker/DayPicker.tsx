import { useCallback, useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperTypes } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import useGenerateDates from '../../hooks/useGenerateDates';
import './DayPicker.css';
import { AvailableHoursTypes } from '../../types/Types';

interface SwiperInterface {
  isBeginning: boolean;
  isEnd: boolean;
  activeIndex: number;
}

type SwiperRef = {
  swiper: SwiperTypes;
};

interface DayPickerProps {
  selectedDate: string | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTime: React.Dispatch<React.SetStateAction<AvailableHoursTypes | null>>;
}

export default function DayPicker({
  selectedDate,
  setSelectedDate,
  setSelectedTime,
}: DayPickerProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [displayedMonths, setDisplayedMonths] = useState<string | null>(null);
  const [atBeginning, setAtBeginning] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const swiperRef = useRef<SwiperRef | null>(null);

  const generateDates = useGenerateDates();

  const listOfDates = generateDates();

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const updateDisplayedMonths = useCallback(
    (activeIndex: number) => {
      const firstVisibleDate = new Date(listOfDates[activeIndex]);
      const lastVisibleIndex = activeIndex + (windowWidth <= 768 ? 2 : 4);
      const lastVisibleDate = new Date(
        listOfDates[Math.min(lastVisibleIndex, listOfDates.length - 1)],
      );

      let monthStr = firstVisibleDate.toLocaleString('en-US', {
        month: 'long',
      });
      if (firstVisibleDate.getMonth() !== lastVisibleDate.getMonth()) {
        monthStr +=
          ' - ' + lastVisibleDate.toLocaleString('en-US', { month: 'long' });
      }
      setDisplayedMonths(monthStr);
    },
    [listOfDates, windowWidth],
  );

  if (!displayedMonths) {
    updateDisplayedMonths(0);
  }

  const handleSlideChange = (swiper: SwiperInterface) => {
    setAtBeginning(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
    updateDisplayedMonths(swiper.activeIndex);
  };

  function renderDate(item: string) {
    const date = new Date(item);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    return (
      <div
        onClick={() => {
          setSelectedDate(item);
          if (selectedDate !== item) {
            setSelectedTime(null);
          }
        }}
        className={`date-component__button ${
          selectedDate === item ? 'date-component__date--selected' : ''
        }`}
        key={item}
      >
        <div className="date-element">
          <div className="date-element__date">
            <h1 className="date-element__heading date-element__heading--h1">
              {dayOfWeek}
            </h1>
            <h2 className="date-element__heading date-element__heading--h2">
              {dayOfMonth}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="daypicker">
      <div className="daypicker__month">{displayedMonths}</div>
      <div className="daypicker__container">
        <button
          className={`daypicker__container-button ${atBeginning ? 'daypicker__container-button--disabled' : ''}`}
          disabled={atBeginning}
          onClick={() => {
            if (swiperRef.current && !atBeginning) {
              swiperRef.current.swiper.slidePrev();
            }
          }}
        >
          {'<'}
        </button>
        <Swiper
          ref={swiperRef}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
          spaceBetween={10}
          slidesPerView={windowWidth > 768 ? 5 : windowWidth > 480 ? 3 : 2}
          slidesPerGroup={windowWidth > 768 ? 5 : windowWidth > 480 ? 3 : 2}
        >
          {listOfDates.map((date) => (
            <SwiperSlide
              key={date}
              style={{ cursor: 'pointer' }}
            >
              {renderDate(date)}
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className={`daypicker__container-button ${atEnd ? 'daypicker__container-button--disabled' : ''}`}
          disabled={atEnd}
          onClick={() => {
            if (swiperRef.current && !atEnd) {
              swiperRef.current.swiper.slideNext();
            }
          }}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}
