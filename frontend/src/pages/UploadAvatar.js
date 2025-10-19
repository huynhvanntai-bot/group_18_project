// SV2: Avatar Upload Component - phamquanghuy1661
// Frontend component để upload và quản lý avatar của user

import React, { useState, useRef, useEffect } from 'react';
import './UploadAvatar.css';

const UploadAvatar = () => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Refs
  const fileInputRef = useRef(null);
  
  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  // Load current avatar on component mount
  useEffect(() => {
    loadCurrentAvatar();
  }, []);

  // Load current user's avatar
  const loadCurrentAvatar = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('Vui lòng đăng nhập để sử dụng tính năng này!');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/avatar', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentAvatar(data.data.user.avatar.url || '');
        setError('');
      } else {
        setError(data.message || 'Lỗi khi tải avatar!');
      }
    } catch (err) {
      console.error('Load avatar error:', err);
      setError('Lỗi kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ cho phép upload file ảnh (JPEG, JPG, PNG, GIF, WEBP)!');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }

    setSelectedFile(file);
    setError('');
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file ảnh để upload!');
      return;
    }

    try {
      setUploading(true);
      setMessage('');
      setError('');

      const token = getToken();
      if (!token) {
        setError('Vui lòng đăng nhập để upload avatar!');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Upload avatar thành công! ✨');
        setCurrentAvatar(data.data.user.avatar.url);
        
        // Reset form
        setSelectedFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Upload thất bại!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Lỗi kết nối server!');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete avatar
  const handleDelete = async () => {
    if (!currentAvatar) {
      setError('Không có avatar để xóa!');
      return;
    }

    const confirmDelete = window.confirm('Bạn có chắc muốn xóa avatar hiện tại?');
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      setMessage('');
      setError('');

      const token = getToken();
      if (!token) {
        setError('Vui lòng đăng nhập để xóa avatar!');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Xóa avatar thành công! 🗑️');
        setCurrentAvatar('');
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Xóa avatar thất bại!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Lỗi kết nối server!');
    } finally {
      setDeleting(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Trigger file validation
      const mockEvent = { target: { files: [file] } };
      handleFileSelect(mockEvent);
    }
  };

  if (loading) {
    return (
      <div className="upload-avatar-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-avatar-container">
      <div className="upload-avatar-card">
        <h2>🖼️ Quản lý Avatar</h2>
        
        {/* Current Avatar Section */}
        <div className="current-avatar-section">
          <h3>Avatar hiện tại:</h3>
          <div className="avatar-display">
            {currentAvatar ? (
              <div className="avatar-wrapper">
                <img 
                  src={currentAvatar} 
                  alt="Current Avatar" 
                  className="current-avatar-img"
                />
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="delete-avatar-btn"
                  title="Xóa avatar"
                >
                  {deleting ? '⏳' : '🗑️'}
                </button>
              </div>
            ) : (
              <div className="no-avatar">
                <div className="avatar-placeholder">
                  <span>👤</span>
                  <p>Chưa có avatar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <h3>Upload avatar mới:</h3>
          
          {/* Drag & Drop Area */}
          <div 
            className="file-drop-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="preview-wrapper">
                <img src={previewUrl} alt="Preview" className="preview-img" />
                <p className="file-name">{selectedFile?.name}</p>
                <p className="file-size">{(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="drop-content">
                <div className="upload-icon">📁</div>
                <p>Kéo thả file vào đây hoặc click để chọn</p>
                <small>Hỗ trợ: JPEG, JPG, PNG, GIF, WEBP (tối đa 5MB)</small>
              </div>
            )}
          </div>

          {/* File Input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
            style={{ display: 'none' }}
          />

          {/* Action Buttons */}
          <div className="action-buttons">
            {selectedFile && (
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="cancel-btn"
              >
                ❌ Hủy
              </button>
            )}
            
            <button 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="upload-btn"
            >
              {uploading ? '⏳ Đang upload...' : '⬆️ Upload Avatar'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Tips */}
        <div className="upload-tips">
          <h4>💡 Lưu ý:</h4>
          <ul>
            <li>Ảnh sẽ được tự động resize về 300x300px</li>
            <li>Định dạng được chấp nhận: JPEG, JPG, PNG, GIF, WEBP</li>
            <li>Kích thước tối đa: 5MB</li>
            <li>Avatar mới sẽ thay thế avatar cũ</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadAvatar;
