import BaseUser from './BaseUser.js';
import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://images.pexels.com/photos/18853726/pexels-photo-18853726/free-photo-of-illuminated-lanterns-with-japanese-signs-outside-of-a-building-at-night.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    estimatedDeliveryTime: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                // Matches format like "1h 2m", "2h", or "30m"
                return /^(\d+h\s?)?(\d+m\s?)?$/.test(v);
            },
            message: props => `${props.value} is not a valid delivery time format! Use 'Xh Ym', 'Xh', or 'Ym'.`
        }
    },
    deliveryCost: {
        type: Number,
        required: true
    }
});


const Restaurant = BaseUser.discriminator('Restaurant', restaurantSchema);
export default Restaurant;
