import BaseUser from './BaseUser.js';
import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({

});

const Agent = BaseUser.discriminator('Agent', agentSchema);
export default Agent;
