import express from "express";
import {
    deleteCar,
    filterCars,
    getAllCars,
    getCarsById,
    searchCars,
} from "../controllers/car_controllers.js";

const router = express.Router();

router.get("/cars", getAllCars); // Retrieve all cars
router.get("/cars/:id", getCarsById); // Retrieve car by ID
router.get("/cars/search/:query", searchCars); // Search for cars based on a query
router.post("/cars/filter", filterCars); // Filter cars based on specific criteria
router.delete("/cars/:id", deleteCar); // Delete a car by ID

export default router;
