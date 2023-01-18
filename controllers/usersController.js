const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Order = require("../models/Order");

// @desc Get all users
// @routes GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 0 } = req.query;
  const users = await User.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select("-password")
    .lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new user
// @routes POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Confirm data
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for dublicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, password: hashedPwd };

  // create and store new User

  const user = await User.create(userObject);

  if (user) {
    // Created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @routes PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const {
    id,
    username,
    roles,
    password,
    firstname,
    lastname,
    telephone,
    city,
    address,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (username) {
    // Check for duplicate

    const duplicate = await User.findOne({ username })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    // Allow upates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate username" });
    }
    user.username = username;
  }
  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }
  user.roles = roles;
  user.firstname = firstname;
  user.lastname = lastname;
  user.telephone = telephone;
  user.city = city;
  user.address = address;

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} Updated` });
});

// @desc Delete a user
// @routes Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const order = await Order.findOne({ user: id }).lean().exec();
  if (order?.length) {
    return res.status(400).json({ message: "User has Orders" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
