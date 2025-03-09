import { ServiceTypes } from "../../../types/Types";
import convertTime from "../../../utils/convertTime";

interface ServiceDetailsProps {
  selectedEmployee: {
    firstName: string;
    lastName?: string;
  } | null;
  selectedServices: ServiceTypes;
  setIsEmployeeSelect: (isSelect: boolean) => void;
}

export default function ServiceDetails({
  selectedServices,
  selectedEmployee,
  setIsEmployeeSelect,
}: ServiceDetailsProps) {
  return (
    <>
      <div className="booking__service">
        <p className="booking__service-name">
          {selectedServices.name[0].toUpperCase() +
            selectedServices.name.slice(1)}
        </p>
        <div className="booking__service-details">
          <p className="booking__service-price">
            {selectedServices.price.toFixed(2)} PLN
          </p>
          <p className="booking__service-duration">
            {convertTime(selectedServices.duration)}
          </p>
        </div>
      </div>
      <div className="booking__employee">
        <p>
          <span style={{ color: "gray" }}>Employee: </span>
          {selectedEmployee?.firstName} {selectedEmployee?.lastName}
        </p>
        <button
          onClick={() => setIsEmployeeSelect(true)}
          className="booking__change-btn"
        >
          Change
        </button>
      </div>
    </>
  );
}
