import React, { useEffect, useState } from 'react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // placeholder: frontend SV2 will implement API call
    setLogs([]);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Logs (placeholder)</h2>
      <p>This page will list user activity logs. Frontend implementation pending.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Time</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Action</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>User</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 16 }}>No logs yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
