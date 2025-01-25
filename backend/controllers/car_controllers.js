import { ElectricCar } from "../models/car_model.js";

export const getAllCars = async (req, res) => {
  try {
    const cars = await ElectricCar.find(); // Fetch all cars from the database
    if (!cars.length) {
      return res.status(404).json({ message: "No car models found." }); // Handle empty result
    }
    res
      .status(200)
      .json({ message: "Successfully retrieved car models.", cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCarsById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await ElectricCar.findById(id).exec(); // Fetch car by ID
    if (!car) {
      return res.status(404).json({ message: "Car not found." }); // Handle car not found
    }
    res.status(200).json({ message: "Successfully retrieved car.", car });
  } catch (error) {
    console.error("Error fetching car:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const searchCars = async (req, res) => {
  try {
    const { query } = req.params;

    // Create case-insensitive regex for text search if query is not numeric
    const searchRegex = isNaN(query) ? new RegExp(`^${query}`, "i") : null;

    const searchCriteria = [];

    // If searchRegex is created, apply to relevant fields
    if (searchRegex) {
      searchCriteria.push(
        { Brand: { $regex: searchRegex } },
        { Model: { $regex: searchRegex } },
        { PowerTrain: { $regex: searchRegex } },
        { PlugType: { $regex: searchRegex } },
        { BodyStyle: { $regex: searchRegex } },
        { Segment: { $regex: searchRegex } },
        { RapidCharge: { $regex: searchRegex } },
        { Date: { $regex: searchRegex } }
      );
    }

    // If query is numeric, search for numeric values in relevant fields
    if (!isNaN(query)) {
      const numericQuery = parseFloat(query);
      searchCriteria.push(
        { Seats: numericQuery },
        { PriceEuro: numericQuery },
        { AccelSec: numericQuery },
        { TopSpeed_KmH: numericQuery },
        { Range_Km: numericQuery },
        { Efficiency_WhKm: numericQuery },
        { FastCharge_KmH: numericQuery }
      );
    }

    // Perform the search query with dynamic criteria
    const cars = await ElectricCar.find({
      $or: searchCriteria,
    });

    // Respond with the search results
    if (cars.length === 0) {
      return res.status(404).json({ message: "No matching cars found." }); // Handle empty search results
    }

    res.status(200).json({
      message: "Models found.",
      cars,
    });
  } catch (error) {
    console.error("Error while searching:", error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const filterCars = async (req, res) => {
  try {
    const { column, filterType, value } = req.body;

    // Allowed columns for filtering
    const allowedColumns = [
      "Brand",
      "Model",
      "PowerTrain",
      "PlugType",
      "BodyStyle",
      "Segment",
      "RapidCharge",
      "Date",
      "Seats",
      "PriceEuro",
      "AccelSec",
      "TopSpeed_KmH",
      "Range_Km",
      "Efficiency_WhKm",
      "FastCharge_KmH",
    ];

    // Validate the column
    if (!allowedColumns.includes(column)) {
      return res.status(400).json({ message: "Invalid column for filtering." });
    }

    // Numeric columns
    const numericColumns = [
      "Seats",
      "PriceEuro",
      "AccelSec",
      "TopSpeed_KmH",
      "Range_Km",
      "Efficiency_WhKm",
      "FastCharge_KmH",
    ];

    let filterQuery = {};
    const regexOptions = "i"; // Case-insensitive option

    // Handle filtering for numeric and non-numeric fields
    if (numericColumns.includes(column)) {
      const numericValue = parseFloat(value);

      // Validate numeric value
      if (isNaN(numericValue)) {
        return res.status(400).json({
          message: "Invalid value for numeric column.",
        });
      }

      // Apply filter logic for numeric fields
      switch (filterType) {
        case "equals":
          filterQuery[column] = numericValue;
          break;
        case "starts with":
        case "ends with":
        case "contains":
          return res.status(400).json({
            message: `Filter type '${filterType}' is not supported for numeric columns.`,
          });
        case "is empty":
          filterQuery[column] = { $exists: true, $eq: null };
          break;
        default:
          return res.status(400).json({ message: "Invalid filter type." });
      }
    } else {
      // Apply filter logic for string fields
      switch (filterType) {
        case "contains":
          filterQuery[column] = { $regex: new RegExp(value, regexOptions) };
          break;
        case "equals":
          filterQuery[column] = value;
          break;
        case "starts with":
          filterQuery[column] = {
            $regex: new RegExp(`^${value}`, regexOptions),
          };
          break;
        case "ends with":
          filterQuery[column] = {
            $regex: new RegExp(`${value}$`, regexOptions),
          };
          break;
        case "is empty":
          filterQuery[column] = { $exists: true, $eq: "" };
          break;
        default:
          return res.status(400).json({ message: "Invalid filter type." });
      }
    }

    // Fetch the filtered results from the database
    const filteredCars = await ElectricCar.find(filterQuery);

    // Handle case where no results are found
    if (filteredCars.length === 0) {
      return res
        .status(200)
        .json({ message: "No cars match the filter criteria.", cars: [] });
    }

    // Respond with the filtered data
    res.status(200).json({
      message: "Filtered results retrieved successfully.",
      cars: filteredCars,
    });
  } catch (error) {
    console.error("Error while filtering:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await ElectricCar.findByIdAndDelete(id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found." });
    }
    res.status(200).json({ message: "Car deleted successfully." });
  } catch (error) {
    console.error("Error deleting car:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
