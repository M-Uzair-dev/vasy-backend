import BaseUser from './BaseUser.js';
import mongoose from 'mongoose';
const adminSchema = new mongoose.Schema({});
const Admin = BaseUser.discriminator('Admin', adminSchema);

export default Admin;
