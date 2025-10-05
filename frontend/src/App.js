import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [reload, setReload] = useState(false);

  // Hàm reload để gọi lại danh sách user sau khi thêm/sửa/xóa
  const handleUserChange = () => setReload(!reload);

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Danh sách User (MongoDB)</h2>

      {/* Form thêm user */}
      <AddUser onUserAdded={handleUserChange} />

      {/* Danh sách user */}
      <UserList reload={reload} />
    </div>
  );
}

export default App;
