import mongoose from "mongoose";
import BaseUser from "./BaseUser.js";

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  image: { type: String },
  mobileNumber: { type: String, required: true },
});

const Client = BaseUser.discriminator("Client", clientSchema);
export default Client;
