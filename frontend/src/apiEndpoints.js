const BASE_URL = "http://localhost:3000/api";

const endpoints = {
  cars: `${BASE_URL}/cars`,
  searchCars: (query) => `${BASE_URL}/cars/search/${query}`,
  filterCars: `${BASE_URL}/cars/filter`,
  deleteCar: (id) => `${BASE_URL}/cars/${id}`,
  getCarsById: (id) => `${BASE_URL}/cars/${id}`,
};

export default endpoints;
