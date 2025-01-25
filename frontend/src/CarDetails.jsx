import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomButton } from "./CustomButton";
import endpoints from "./apiEndpoints";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carDetails, setCarDetails] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data } = await axios.get(endpoints.getCarsById(id));
        setCarDetails(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (!carDetails) {
    return (
      <Box p={2}>
        <Typography>Loading details...</Typography>
      </Box>
    );
  }

  const carInfo = carDetails?.car || {};
  const details = [
    { label: "Brand", value: carInfo.Brand },
    { label: "Model", value: carInfo.Model },
    { label: "AccelSec", value: `$${carInfo.AccelSec}` },
    { label: "TopSpeed_KmH", value: carInfo.TopSpeed_KmH },
    { label: "Range_Km", value: carInfo.Range_Km },
    { label: "Efficiency_WhKm", value: carInfo.Efficiency_WhKm },
    { label: "FastCharge_KmH", value: `$${carInfo.FastCharge_KmH}` },
    { label: "RapidCharge", value: carInfo.RapidCharge },
    { label: "PowerTrain", value: carInfo.PowerTrain },
    { label: "PlugType", value: carInfo.PlugType },
    { label: "BodyStyle", value: `$${carInfo.BodyStyle}` },
    { label: "Segment", value: carInfo.Segment },
    { label: "Seats", value: carInfo.Seats },
    { label: "PriceEuro", value: carInfo.PriceEuro },
    { label: "Date", value: carInfo.Segment },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4">Car Details</Typography>
      {details.map(({ label, value }) => (
        <Typography key={label} variant="h6">
          {label}: {value}
        </Typography>
      ))}
      <CustomButton
        label="Back to Data Grid"
        onClick={() => navigate("/")}
        variant="contained"
        color="primary"
      />
    </Box>
  );
};

export default CarDetails;
