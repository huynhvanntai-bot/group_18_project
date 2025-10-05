
function UserList({ users }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Danh sách người dùng</h3>
      {users.length === 0 ? (
        <p>Không có dữ liệu người dùng.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th>Tên</th>
              <th>Email</th>
              <th>MSSV</th>
              <th>Lớp</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.ten}</td>
                <td>{u.email}</td>
                <td>{u.mssv}</td>
                <td>{u.lop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
