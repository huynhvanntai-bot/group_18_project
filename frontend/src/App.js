import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" }
  ]);

  const addUser = (name) => {
    const newUser = { id: Date.now(), name };
    setUsers([...users, newUser]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý User</h1>
      <AddUser onAddUser={addUser} />
      <UserList users={users} />
    </div>
  );
}

export default App;