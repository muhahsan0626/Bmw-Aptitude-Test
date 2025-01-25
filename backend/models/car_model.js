import mongoose from "mongoose";

const electricCarSchema = new mongoose.Schema({
  Brand: { type: String },
  Model: { type: String },
  AccelSec: { type: Number },
  TopSpeed_KmH: { type: Number },
  Range_Km: { type: Number },
  Efficiency_WhKm: { type: Number },
  FastCharge_KmH: { type: Number },
  RapidCharge: { type: String },
  PowerTrain: { type: String },
  PlugType: { type: String },
  BodyStyle: { type: String },
  Segment: { type: String },
  Seats: { type: Number },
  PriceEuro: { type: Number },
  Date: { type: String },
});

export const ElectricCar = mongoose.model("ElectricCar", electricCarSchema);
