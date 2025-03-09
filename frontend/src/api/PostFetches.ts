import axios from "axios";
import { AxiosError } from "axios";
import { CreateReservationTypes } from "../types/Types";
import { FieldValues } from "react-hook-form";
import { apiURL } from "./apiURL";

const createReservationWithoutAuth = async (
  reservationData: CreateReservationTypes
) => {
  try {
    const response = await axios.post(
      `${apiURL}/reservations/createWithoutAuth`,
      reservationData,
      {}
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const createReservationWithAuth = async (
  reservationData: CreateReservationTypes,
  accessToken: string
) => {
  try {
    const response = await axios.post(
      `${apiURL}/reservations/createWithAuth`,
      reservationData,
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
      "Error creating reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const cancelReservation = async (
  reservationId: number | null,
  refreshResponse: string | null
) => {
  try {
    const response = await axios.put(
      `${apiURL}/reservations/cancel/${reservationId}`,
      {},
      {
        headers: {
          Authorization: refreshResponse ? `Bearer ${refreshResponse}` : "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error cancelling reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const loginAction = async (data: FieldValues) => {
  const response = await axios.post(
    `${apiURL}/auth/login`,
    {
      username: data.email.trim(),
      password: data.password.trim(),
    },
    {
      withCredentials: true,
    }
  );
  return response;
};

const registerAction = async (data: FieldValues) => {
  const response = await axios.post(
    `${apiURL}/auth/register`,
    {
      username: data.email.trim(),
      password: data.password.trim(),
    },
    {
      withCredentials: true,
    }
  );
  return response;
};

const logoutFunction = async () => {
  await axios.post(
    `${apiURL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
};

export {
  createReservationWithoutAuth,
  createReservationWithAuth,
  cancelReservation,
  loginAction,
  registerAction,
  logoutFunction,
};
