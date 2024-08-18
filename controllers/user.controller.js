const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Listing = require("../models/Listing.model");

exports.createUser = async (req, res) => {
  try {
    res.json({ message: "hello world" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, avatar } = req.body;

    // Ensure the user is updating their own account
    if (id !== req.user.id) {
      // Assuming req.user.id contains the authenticated user's ID
      return res
        .status(401)
        .json({ message: "You can only update your own account" });
    }

    // Hash the new password if provided
    let updatedPassword;
    if (password) {
      updatedPassword = bcrypt.hashSync(password, 10);
    }

    // Find the user and update the provided fields
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          email,
          password: updatedPassword,
          avatar,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  // Ensure the user is deleting their own account
  if (id !== req.user.id) {
    return res
      .status(401)
      .json({ message: "You can only delete your own account" });
  }

  try {
    // Delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getListings = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      const listings = await Listing.find({ userRefs: req.params.id });
      return res.status(200).json(listings);
    } else {
      return res
        .status(401)
        .json({ message: "You can only view your own listings" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password:pass,...rest}=user._doc
    return res.status(200).json(rest);
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};
