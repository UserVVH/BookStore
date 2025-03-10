import { useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [hover, setHover] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Oops! Trang bạn tìm kiếm không tồn tại.</p>
      <Link
        to="/"
        style={{
          ...styles.homeLink,
          backgroundColor: hover ? "#40a9ff" : "#1890ff",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#e6f7ff",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  title: {
    fontSize: "8rem",
    fontWeight: "bold",
    color: "#69c0ff",
    margin: 0,
  },
  message: {
    fontSize: "1.5rem",
    color: "#595959",
    margin: "20px 0",
  },
  homeLink: {
    fontSize: "1.2rem",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
  },
};

export default NotFound;
