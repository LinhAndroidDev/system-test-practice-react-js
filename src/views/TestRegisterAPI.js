import React, { useState } from "react";

const TestRegisterAPI = () => {
  const [formData, setFormData] = useState({
    name: "Phan Văn Hùng",
    email: "hungpv@gmail.com",
    password: "1234567",
    role: 0,
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("🚀 Sending request:", formData);

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("📥 Response:", data);

      if (res.ok && data.status === 200) {
        setResponse(data);
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333" }}>
          🧪 Test Register API
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Tên:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Password:
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Role (0=user, 1=admin):
            </label>
            <input
              type="number"
              name="role"
              value={formData.role}
              onChange={handleChange}
              min="0"
              max="1"
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ddd",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading
                ? "#ccc"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
            }}
          >
            {loading ? "⏳ Đang gửi..." : "📤 Gửi Request"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              borderRadius: "5px",
            }}
          >
            <h3>❌ Error:</h3>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{error}</pre>
          </div>
        )}

        {response && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#d4edda",
              color: "#155724",
              border: "1px solid #c3e6cb",
              borderRadius: "5px",
            }}
          >
            <h3>✅ Success Response:</h3>
            <pre
              style={{
                background: "#f8f9fa",
                padding: "10px",
                borderRadius: "5px",
                overflow: "auto",
                fontSize: "12px",
                margin: "10px 0 0 0",
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
            <div style={{ marginTop: "10px" }}>
              <strong>User ID:</strong> {response.data?.userId}
              <br />
              <strong>Message:</strong> {response.message}
              <br />
              <strong>Status:</strong> {response.status}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#e7f3ff",
            border: "1px solid #b3d9ff",
            borderRadius: "5px",
          }}
        >
          <h4 style={{ marginTop: 0 }}>📋 Request Body:</h4>
          <pre
            style={{
              background: "#f8f9fa",
              padding: "10px",
              borderRadius: "5px",
              overflow: "auto",
              fontSize: "12px",
              margin: 0,
            }}
          >
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestRegisterAPI;

