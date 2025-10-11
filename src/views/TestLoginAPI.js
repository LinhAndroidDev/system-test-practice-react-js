import React, { useState } from "react";

const TestLoginAPI = () => {
  const [formData, setFormData] = useState({
    email: "linh@gmail.com",
    password: "1234567",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("🚀 Sending login request:", formData);

      const res = await fetch("http://localhost:8080/api/auth/login", {
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
        
        // Save to localStorage like AuthService does
        if (data.data && data.data.auth) {
          const { userId, username, role, auth } = data.data;
          localStorage.setItem("authToken", auth.accessToken);
          localStorage.setItem("userData", JSON.stringify({
            id: userId,
            name: username,
            email: formData.email,
            role: role,
          }));
          console.log("✅ Token saved to localStorage!");
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    console.log("🗑️ Cleared localStorage");
    alert("Đã xóa token khỏi localStorage");
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
          🧪 Test Login API
        </h1>

        <form onSubmit={handleSubmit}>
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

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
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
              }}
            >
              {loading ? "⏳ Đang đăng nhập..." : "🔐 Đăng nhập"}
            </button>

            <button
              type="button"
              onClick={handleClearStorage}
              style={{
                padding: "12px 20px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🗑️ Xóa Token
            </button>
          </div>
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
            
            <div style={{ marginTop: "15px", borderTop: "1px solid #c3e6cb", paddingTop: "15px" }}>
              <h4 style={{ marginTop: 0 }}>📋 Parsed Data:</h4>
              <div style={{ lineHeight: "1.8" }}>
                <strong>👤 User ID:</strong> {response.data?.userId}
                <br />
                <strong>📛 Username:</strong> {response.data?.username}
                <br />
                <strong>📧 Email:</strong> {formData.email}
                <br />
                <strong>🎭 Role:</strong> {response.data?.role === 0 ? "User" : "Admin"} ({response.data?.role})
                <br />
                <strong>🔑 Access Token:</strong>{" "}
                <code style={{ 
                  background: "#f8f9fa", 
                  padding: "2px 6px", 
                  borderRadius: "3px",
                  fontSize: "11px",
                  wordBreak: "break-all"
                }}>
                  {response.data?.auth?.accessToken?.substring(0, 50)}...
                </code>
                <br />
                <strong>💬 Message:</strong> {response.message}
                <br />
                <strong>📊 Status:</strong> {response.status}
              </div>
            </div>

            <div style={{ 
              marginTop: "15px", 
              padding: "10px", 
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "5px",
              fontSize: "14px"
            }}>
              <strong>💾 LocalStorage:</strong>
              <br />
              ✅ Token đã được lưu vào <code>authToken</code>
              <br />
              ✅ User data đã được lưu vào <code>userData</code>
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

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "5px",
          }}
        >
          <h4 style={{ marginTop: 0 }}>📌 Current LocalStorage:</h4>
          <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
            <strong>authToken:</strong>{" "}
            {localStorage.getItem("authToken") ? (
              <code style={{ fontSize: "11px", wordBreak: "break-all" }}>
                {localStorage.getItem("authToken").substring(0, 50)}...
              </code>
            ) : (
              <em style={{ color: "#999" }}>null</em>
            )}
            <br />
            <strong>userData:</strong>{" "}
            {localStorage.getItem("userData") ? (
              <pre style={{ 
                display: "inline-block", 
                margin: "5px 0 0 0",
                padding: "5px",
                background: "white",
                fontSize: "11px"
              }}>
                {localStorage.getItem("userData")}
              </pre>
            ) : (
              <em style={{ color: "#999" }}>null</em>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLoginAPI;

