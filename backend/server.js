const express = require('express');
const cors = require('cors');   // import cors trước

const app = express();          // tạo app trước
app.use(cors());                // rồi mới dùng cors
app.use(express.json());        // bật middleware đọc JSON

let users = [
  { id: 1, name: "Quốc Vinh", email: "a@example.com" },
  { id: 2, name: "Huỳnh Tài", email: "b@example.com" }
];

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// POST add user
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.json(user);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
