import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    aadharNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert("User already exists");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        name="name"
        placeholder="Name"
        required
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        onChange={handleChange}
      />

      <input
        name="aadharNumber"
        placeholder="Aadhar Number"
        required
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        onChange={handleChange}
      />

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
