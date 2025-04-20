import Category from "../../models/Category.js";
import Dish from "../../models/Dish.js";
export const createCategory = async (req, res) => {
  try {
    let { name, restaurantId } = req.body;
    const category = new Category({ name, restaurantId });
    await category.save();
    const dishes = req.body.dishes.map((dish) => {
      return new Dish({ ...dish, categoryId: category._id });
    });
    await Dish.insertMany(dishes);
    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
};
export const getCategories = async (req, res) => {
  try {
    const { restaurantId, id } = req.query;

    if (id) {
      const category = await Category.findById(id).populate(
        "restaurantId",
        "name email"
      );
      const dishes = await Dish.find({ categoryId: id });
      const categoryWithDishes = {
        ...category.toObject(),
        dishes: dishes,
      };
      if (!category)
        return res.status(404).json({ message: "Category not found" });
      return res.status(200).json({
        message: "Category fetched successfully",
        category: categoryWithDishes,
      });
    }

    if (restaurantId) {
      let categories = await Category.find({ restaurantId }).populate(
        "restaurantId",
        "name email"
      );

      // Use Promise.all with map to get all dishes for each category
      const categoriesWithDishes = await Promise.all(
        categories.map(async (category) => {
          const dishes = await Dish.find({ categoryId: category._id });
          return {
            ...category.toObject(),
            dishes: dishes,
          };
        })
      );

      return res.status(200).json({
        message: "Categories fetched successfully",
        categories: categoriesWithDishes,
      });
    }

    const allCategories = await Category.find().populate(
      "restaurantId",
      "name email"
    );
    return res.status(200).json({
      message: "All categories fetched successfully",
      categories: allCategories,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.query.id,
      { name: req.body.name },
      {
        new: true,
      }
    );

    const dishesThatAreNotInRequest = await Dish.find({
      categoryId: req.query.id,
      _id: { $nin: req.body.dishes.map((dish) => dish._id) },
    });

    await Promise.all(
      req.body.dishes.map(async (dish) => {
        if (dish._id) {
          await Dish.findByIdAndUpdate(dish._id, dish, {
            new: true,
          });
        } else {
          await Dish.create({ ...dish, categoryId: req.query.id });
        }
      })
    );

    await Promise.all(
      dishesThatAreNotInRequest.map(async (dish) => {
        await Dish.findByIdAndDelete(dish._id);
      })
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });
    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.query.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    return res.status(204).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
