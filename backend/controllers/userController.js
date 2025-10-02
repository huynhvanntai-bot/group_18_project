// controllers/userController.js

let users = [
  { id: 1, name: "Tai", email: "tai@example.com" },
  { id: 2, name: "Vinh", email: "Vinh@example.com" },
  { id: 3, name: "Huy", email: "Huy@example.com" }
];

// GET /users
const getUsers = (req, res) => {
  res.json(users);
};

// POST /users
const createUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };
