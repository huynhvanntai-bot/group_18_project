import React, { useEffect, useState } from "react";
import AddUser from "./components/AddUser.jsx";     // 👈 import DEFAULT, có .jsx cho chắc
import UserList from "./components/UserList.jsx";   // 👈 import DEFAULT, có .jsx cho chắc

function App() {
  // tạm dùng mock state để chắc chắn render được
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com" },
    { id: 2, name: "Trần Thị B",  email: "b@gmail.com" },
  ]);
  const [editing, setEditing] = useState(null);

  // debug: in ra kiểu dữ liệu component (phải là 'function')
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("typeof AddUser:", typeof AddUser, "typeof UserList:", typeof UserList);
  }, []);

  const handleSubmit = (payload, id) => {
    if (id) {
      setUsers((prev) => prev.map(u => (u.id === id ? { ...u, ...payload } : u)));
      setEditing(null);
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...payload }]);
    }
  };

  const handleEdit   = (u)  => setEditing(u);
  const handleDelete = (id) => setUsers((prev) => prev.filter(u => (u.id ?? u._id) !== id));

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý User (Mock)</h1>
      <AddUser onSubmit={handleSubmit} editing={editing} />
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;
// code của huy
<h1>Xin chào tôi là Huy</h1>;
<p style={{ display: "none" }}>Code modified by Huy for PR test</p>