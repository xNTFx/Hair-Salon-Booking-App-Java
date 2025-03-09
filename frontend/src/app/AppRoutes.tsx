import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../features/Navbar/Navbar";
import NotFoundPage from "../Pages/NotFoundPage/NotFoundPage";

const HomePage = lazy(() => import("../Pages/HomePage/HomePage"));
const Login = lazy(() => import("../Pages/Login/Login"));
const Register = lazy(() => import("../Pages/Register/Register"));
const ReservationsActive = lazy(
  () => import("../Pages/ReservationsActive/ReservationsActive")
);
const ServicesPage = lazy(() => import("../Pages/ServicesPage/ServicesPage"));
const ReservationsHistory = lazy(
  () => import("../Pages/ReservationsHistory/ReservationsHistory")
);

function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="*" element={<NotFoundPage />} />
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reservations">
            <Route path="active" element={<ReservationsActive />} />
            <Route path="history" element={<ReservationsHistory />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
