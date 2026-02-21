import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    axios
      .get(`https://monarch-app.ddns.net/api/admin/userView/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsername(res.data.username);
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setIsStaff(res.data.is_staff);
        setIsActive(res.data.is_active);
        setIsSuperuser(res.data.is_superuser);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.patch(
        `https://monarch-app.ddns.net/api/admin/userEdit/${id}/`,
        {
          username,
          first_name: firstName,
          last_name: lastName,
          is_staff: isStaff,
          is_active: isActive,
          is_superuser: isSuperuser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to update user.");
    }
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit User</h2>

        <div style={styles.formGroup}>
          <label>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label>First Name</label>
          <input
            style={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Last Name</label>
          <input
            style={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div style={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={isStaff}
              onChange={() => setIsStaff(!isStaff)}
            />
            Is Staff
          </label>

          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            Is Active
          </label>

          <label>
            <input
              type="checkbox"
              checked={isSuperuser}
              onChange={() => setIsSuperuser(!isSuperuser)}
            />
            Is Superuser
          </label>
        </div>

        <button style={styles.button} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
  },
  card: {
    width: "400px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
