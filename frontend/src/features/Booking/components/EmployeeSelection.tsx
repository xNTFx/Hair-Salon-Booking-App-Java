import { Dispatch, SetStateAction } from "react";
import { EmployeesType } from "../../../types/Types";
import EmployeePicker from "../../EmployeePicker/EmployeePicker";

interface EmployeeSelectionProps {
  employeesData: EmployeesType[];
  setIsEmployeeSelect: Dispatch<SetStateAction<boolean>>;
  setSelectedEmployee: Dispatch<SetStateAction<EmployeesType | null>>;
  setSelectedTime: (time: any) => void;
}

export default function EmployeeSelection({
  employeesData,
  setIsEmployeeSelect,
  setSelectedEmployee,
  setSelectedTime,
}: EmployeeSelectionProps) {
  return (
    <div className="employee-picker">
      <EmployeePicker
        employeesData={employeesData}
        setIsEmployeeSelect={setIsEmployeeSelect}
        setSelectedEmployee={setSelectedEmployee}
        setSelectedTime={setSelectedTime}
      />
    </div>
  );
}
