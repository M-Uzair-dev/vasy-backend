import Cart from "../../models/Cart.js";


export const addToCart = async (req, res) => {
    try {
        const { userId, restaurantId, items } = req.body;
        let cart = await Cart.findOne({ userId, restaurantId });

        if (!cart) {
            cart = new Cart({ userId, restaurantId, items, totalPrice: calculateTotalPrice(items) });
        } else {
            cart.items.push(...items);
            cart.totalPrice = calculateTotalPrice(cart.items);
        }

        await cart.save();
        res.status(200).json({
            message: 'Items added to cart successfully!',
            cart
        });
    } catch (error) {
        res.status(500).json({ error: 'Error adding items to cart' });
    }
};

export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.query;
        const cart = await Cart.findOne({ userId: userId }).populate('items.dishes.dishId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cart' });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { userId, dishId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.map(category => ({
            ...category,
            dishes: category.dishes.filter(dish => dish.dishId.toString() !== dishId)
        }));

        cart.totalPrice = calculateTotalPrice(cart.items);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error removing item from cart' });
    }
};

const calculateTotalPrice = (items) => {
    let totalPrice = 0;
    items.forEach(category => {
        category.dishes.forEach(dish => {
            totalPrice += dish.price * dish.quantity;
        });
    });
    return totalPrice;
};
