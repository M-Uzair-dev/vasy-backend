import BaseUser from "./BaseUser.js";
import mongoose from "mongoose";
const superAdminSchema = new mongoose.Schema({});
const SuperAdmin = BaseUser.discriminator("SuperAdmin", superAdminSchema);

export default SuperAdmin;
