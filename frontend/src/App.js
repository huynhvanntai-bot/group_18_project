import React from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  return (
    <div>
      <h1>Quản lý User</h1>
      <AddUser />
      <UserList />
    </div>
  );
}

export default App;