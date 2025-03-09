import { IoMdArrowRoundBack } from 'react-icons/io';
import { RxAvatar } from 'react-icons/rx';

import { AvailableHoursTypes, EmployeesType } from '../../types/Types';
import './EmployeePicker.css';

interface EmployeePickerProps {
  employeesData: EmployeesType[];
  setIsEmployeeSelect: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEmployee: React.Dispatch<
    React.SetStateAction<EmployeesType | null>
  >;
  setSelectedTime: React.Dispatch<React.SetStateAction<AvailableHoursTypes | null>>;
}

export default function EmployeePicker({
  employeesData,
  setIsEmployeeSelect,
  setSelectedEmployee,
  setSelectedTime,
}: EmployeePickerProps) {
  return (
    <div>
      <div className="employee-picker__header">
        <button onClick={() => setIsEmployeeSelect(false)}>
          <IoMdArrowRoundBack />
        </button>
        <h2>Select an employee</h2>
      </div>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setSelectedEmployee(null);
          setIsEmployeeSelect(false);
        }}
      ></div>
      {employeesData.map((employee: EmployeesType) => {
        return (
          <div
            key={employee.employeeId}
            onClick={() => {
              setSelectedEmployee(employee);
              setIsEmployeeSelect(false);
              setSelectedTime(null);
            }}
            className="employee-picker__item"
          >
            <div className="employee-picker__credentials">
              <span>
                <RxAvatar style={{ fontSize: '2rem' }} />
              </span>
              <p>
                {employee.firstName} {employee.lastName}
              </p>
            </div>
            <hr className="employee-picker__hr" />
          </div>
        );
      })}
    </div>
  );
}
