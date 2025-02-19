import Rule from "../../models/Rules.js";

export const createRule = async (req, res) => {
  try {
    const { name, image, status } = req.body;
    const rule = new Rule({ name, image, status });
    await rule.save();
    res.status(201).json({ message: "Rule created successfully", rule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating rule", error: error.message });
  }
};

export const getRules = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const rule = await Rule.findById(id);
      if (!rule) return res.status(404).json({ message: "Rule not found" });
      return res.json({ message: "Rule retrieved successfully", rule });
    }
    const rules = await Rule.find({ deleted: false });
    res.json({ message: "Rules retrieved successfully", rules });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving rules", error: error.message });
  }
};

export const updateRule = async (req, res) => {
  try {
    const { id } = req.query;
    const rule = await Rule.findByIdAndUpdate(id, req.body, { new: true });
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.json({ message: "Rule updated successfully", rule });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating rule", error: error.message });
  }
};

export const deleteRule = async (req, res) => {
  try {
    const { id } = req.query;
    const rule = await Rule.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.status(204).json({ message: "Rule deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting rule", error: error.message });
  }
};
export const getDeleted = async (req, res) => {
  try {
    const rules = await Rule.find({ deleted: true });
    res.json({ message: "Deleted rules retrieved successfully", rules });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error deleting rule", error: error.message });
  }
};

export const restoreRule = async (req, res) => {
  try {
    const { id } = req.query;
    const rule = await Rule.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true }
    );
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.status(200).json({ message: "Rule restored successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error restoring rule", error: error.message });
  }
};

export const deleteRulePermanently = async (req, res) => {
  try {
    const { id } = req.query;
    const rule = await Rule.findByIdAndDelete(id);
    if (!rule) return res.status(404).json({ message: "Rule not found" });
    res.status(200).json({ message: "Rule deleted permanently" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting rule permanently",
      error: error.message,
    });
  }
};
