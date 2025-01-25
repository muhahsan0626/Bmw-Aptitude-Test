import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "./apiEndpoints";
import { CustomButton } from "./CustomButton";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function Hero() {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [filterColumn, setFilterColumn] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data
    const fetchCarData = async () => {
      try {
        const response = await axios.get(endpoints.cars);
        const { cars } = response.data;

        // Set row data
        setRowData(cars);

        if (cars.length > 0) {
          const dynamicColDefs = Object.keys(cars[0])
            .filter((key) => key !== "_id") // Exclude the `_id` field
            .map((key) => ({ field: key, headerName: key.replace(/_/g, " ") }));

          // Add "Actions" column
          dynamicColDefs.unshift({
            headerName: "Actions",
            field: "actions",
            cellRenderer: (params) => (
              <Box display="flex" gap={1} mt={0.5}>
                <CustomButton
                  label="View"
                  onClick={() => handleView(params.data._id)}
                  variant="contained"
                  color="primary"
                  style={{ width: "30px", height: "30px" }}
                />

                <CustomButton
                  label="Delete"
                  onClick={() => handleDelete(params.data)}
                  variant="contained"
                  color="secondary"
                  style={{ width: "30px", height: "30px" }}
                />
              </Box>
            ),
            sortable: false,
            filter: false,
            width: 200,
          });
          setColDefs(dynamicColDefs);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, []);

  const handleView = (carId) => {
    navigate(`/car/${carId}`);
  };

  const handleDelete = async (rowData) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this row?\n${JSON.stringify(
        rowData,
        null,
        2
      )}`
    );
    if (confirmDelete) {
      try {
        await axios.delete(endpoints.deleteCar(rowData._id));
        setRowData((prevData) =>
          prevData.filter((car) => car._id !== rowData._id)
        );
        alert("Row deleted successfully!");
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("An error occurred while deleting the car.");
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(endpoints.searchCars(query));
      const { cars } = response.data;

      setRowData(cars);
      setNoResultsMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setRowData([]);
        setNoResultsMessage("No cars match the search query.");
      } else {
        console.error("Error searching cars:", error);
      }
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.post(endpoints.filterCars, {
        column: filterColumn,
        filterType,
        value: filterValue,
      });
      const { cars } = response.data;

      setRowData(cars);
      setNoResultsMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setRowData([]);
        setNoResultsMessage("No cars match the filter criteria.");
      } else {
        console.error("Error filtering cars:", error);
      }
    }
  };

  return (
    <Box p={2}>
     <Typography variant="h4">BMW Aptitude Test</Typography>
     <Typography variant="h6">Muhammad Ahsan</Typography>
      <Box display="flex" gap={2} alignItems="center" mt={2}>
      <TextField
        label="Search Cars"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search by model, brand, top speed, etc."
      />
        <FormControl style={{ minWidth: 150 }}>
          <InputLabel id="filter-column-label">Column</InputLabel>
          <Select
            labelId="filter-column-label"
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
          >
            {colDefs.map((col) => (
              <MenuItem key={col.field} value={col.field}>
                {col.headerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 150 }}>
          <InputLabel id="filter-type-label">Filter Type</InputLabel>
          <Select
            labelId="filter-type-label"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="contains">Contains</MenuItem>
            <MenuItem value="equals">Equals</MenuItem>
            <MenuItem value="starts with">Starts With</MenuItem>
            <MenuItem value="ends with">Ends With</MenuItem>
            <MenuItem value="is empty">Is Empty</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Value"
          variant="outlined"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          disabled={filterType === "is empty"}
        />
        <CustomButton
          label="Apply Filter"
          onClick={handleFilter}
          variant="contained"
        />
      </Box>

      {noResultsMessage && (
        <Typography color="error" mt={2}>
          {noResultsMessage}
        </Typography>
      )}

      <Box  mt={2} height={500}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </Box>
    </Box>
  );
}

export default Hero;
