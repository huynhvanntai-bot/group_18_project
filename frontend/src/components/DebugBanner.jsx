import React from 'react';
import { useSelector } from 'react-redux';

export default function DebugBanner() {
  const auth = useSelector(state => state?.auth || {});
  return (
    <div style={{position: 'fixed', right: 8, bottom: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 10px', borderRadius: 6, zIndex: 9999, fontSize: 12}}>
      <div>Env: local</div>
      <div>Logged: {auth?.user ? auth.user.ten || auth.user.username || auth.user.email : 'no'}</div>
      <div>Role: {auth?.user?.role || '-'}</div>
    </div>
  );
}
