import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseUser',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [
        {
            categoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RestaurantCategory',
                required: true
            },
            dishes: [
                {
                    dishId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Dish',
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1
                    },
                    price: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    ],
    totalPrice: {
        type: Number,
    }
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
