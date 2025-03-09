import { useCallback } from 'react';

export default function useGenerateDates() {
  const generateDates = useCallback((referenceDate = new Date(), days = 45) => {
    const dates = [];

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    dates.push(formatDate(referenceDate));

    const endDate = new Date(referenceDate);
    endDate.setDate(referenceDate.getDate() + days);

    const currentDate = new Date(referenceDate);
    currentDate.setDate(currentDate.getDate() + 1);
    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);

  return generateDates;
}
