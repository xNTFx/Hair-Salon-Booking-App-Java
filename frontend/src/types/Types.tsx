interface User {
  id: string;
  username: string;
  role: string;
}

interface ServiceTypes {
  id: number;
  name: string;
  duration: string;
  price: number;
}

interface EmployeesType {
  employeeId: number;
  firstName: string;
  lastName: string | undefined;
}

interface CreateReservationTypes {
  reservationDate: string;
  serviceId?: number;
  employeeId?: number | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  service?: { id: number };
  employee?: { employeeId: number | undefined };
}

interface AvailableHoursTypes {
  id: number;
  employeeId: number;
  startTime: string;
  endTime: string;
}

export type {
  User,
  ServiceTypes,
  EmployeesType,
  CreateReservationTypes,
  AvailableHoursTypes,
};
