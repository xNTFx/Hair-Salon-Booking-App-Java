const fetchServices = async () => {
  const response = await fetch(`${apiURL}/services`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchEmployees = async () => {
  const response = await fetch(`${apiURL}/employees`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
const fetchAvaiableHours = async (
  date: string | null,
  employeeId: number | undefined,
  serviceDuration: string
) => {
  if (employeeId === undefined) return;
  const response = await fetch(
    `${apiURL}/available_hours/employee/${employeeId}/reservation_date/${date}/duration/${serviceDuration}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

import axios, { AxiosError } from "axios";
import { apiURL } from "./apiURL";

const fetchActiveReservations = async (accessToken: string | null) => {
  try {
    const response = await axios.get(
      `${apiURL}/reservations/active`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active reservations:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const fetchHistoryReservations = async (accessToken: string | null) => {
  try {
    const response = await axios.get(
      `${apiURL}/reservations/history`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active reservations:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const refreshToken = async () => {
  const refreshResponse = await axios.get(
    `${apiURL}/auth/refresh`,
    {
      withCredentials: true,
    }
  );
  return refreshResponse;
};

const getUserDetails = async (accessToken: string) => {
  const response = await axios.get(`${apiURL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
  return response;
};

export {
  fetchServices,
  fetchEmployees,
  fetchAvaiableHours,
  fetchActiveReservations,
  fetchHistoryReservations,
  refreshToken,
  getUserDetails,
};
