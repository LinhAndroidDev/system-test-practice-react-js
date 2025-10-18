class UploadService {
  constructor() {
    this.baseUrl = "http://localhost:8080/api/upload";
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Upload single image
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Get image URL
  getImageUrl(filename) {
    return `${this.baseUrl}/image/${filename}`;
  }

  // Validate image file
  validateImage(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!file) {
      return { valid: false, error: 'Không có file được chọn' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF)' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Kích thước file không được vượt quá 5MB' };
    }

    return { valid: true };
  }
}

export default UploadService;

