import { Dispatch, SetStateAction } from "react";
import { AvailableHoursTypes, EmployeesType } from "../../../types/Types";
import DayPicker from "../../DayPicker/DayPicker";
import TimePicker from "../../TimePicker/TimePicker";

interface DateAndTimeSelectionProps {
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  selectedTime: AvailableHoursTypes | null;
  setSelectedTime: Dispatch<SetStateAction<AvailableHoursTypes | null>>;
  selectedEmployee: EmployeesType | null;
  setEmployeeIdForBooking: Dispatch<SetStateAction<number | undefined>>;
  serviceDuration: string;
}

export default function DateAndTimeSelection({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedEmployee,
  setEmployeeIdForBooking,
  serviceDuration,
}: DateAndTimeSelectionProps) {
  return (
    <>
      <DayPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
      />
      <hr />
      <TimePicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        employeeId={selectedEmployee?.employeeId}
        setEmployeeIdForBooking={setEmployeeIdForBooking}
        serviceDuration={serviceDuration}
      />
    </>
  );
}
