import { useState, useEffect } from "react";
import API from "../services/api";

const ApplyPassport = () => {
  const [passportOffices, setPassportOffices] = useState([]);

  const [formState, setFormState] = useState({
    applicationType: "NORMAL",
    officeId: "",
    appointmentDate: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [documents, setDocuments] = useState({
    AADHAR: null,
    BIRTH_CERTIFICATE: null,
    ADDRESS_PROOF: null,
    PHOTO: null,
    OTHER: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch passport offices
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await API.get("/admin");
        setPassportOffices(res.data.offices);
      } catch (err) {
        console.error("Error fetching offices:", err);
      }
    };

    fetchOffices();
  }, []);

  // ✅ Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Handle file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setDocuments((prev) => ({
      ...prev,
      [name]: files[0]
    }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("applicationType", formState.applicationType);
      formData.append("officeId", formState.officeId);
      formData.append("appointmentDate", formState.appointmentDate);

      const applicantDetails = {
        fatherName: formState.fatherName,
        motherName: formState.motherName,
        dob: formState.dob,
        gender: formState.gender,
        address: {
          street: formState.street,
          city: formState.city,
          state: formState.state,
          pincode: formState.pincode
        }
      };

      formData.append("applicantDetails", JSON.stringify(applicantDetails));

      Object.values(documents).forEach((file) => {
        if (file) {
          formData.append("documents", file);
        }
      });

      const res = await API.post("/passport/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("✅ Application submitted successfully!");
      console.log(res.data);

    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Apply for Passport</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Application Type */}
        <label>Application Type</label>
        <select
          name="applicationType"
          value={formState.applicationType}
          onChange={handleChange}
          required
        >
          <option value="NORMAL">Normal</option>
          <option value="TATKAAL">Tatkaal</option>
        </select>

        {/* Passport Office */}
        <label>Select Passport Office</label>
        <select
          name="officeId"
          value={formState.officeId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Office --</option>
          {passportOffices.map((office) => (
            <option key={office._id} value={office._id}>
              {office.officeName} - {office.city}
            </option>
          ))}
        </select>

        {/* Appointment Date */}
        <label>Appointment Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={formState.appointmentDate}
          onChange={handleChange}
          required
        />

        <h3>Applicant Details</h3>

        <label>Father Name</label>
        <input
          type="text"
          name="fatherName"
          value={formState.fatherName}
          onChange={handleChange}
          required
        />

        <label>Mother Name</label>
        <input
          type="text"
          name="motherName"
          value={formState.motherName}
          onChange={handleChange}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formState.dob}
          onChange={handleChange}
          required
        />

        <label>Gender</label>
        <select
          name="gender"
          value={formState.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <h3>Address</h3>

        <label>Street</label>
        <input
          type="text"
          name="street"
          value={formState.street}
          onChange={handleChange}
          required
        />

        <label>City</label>
        <input
          type="text"
          name="city"
          value={formState.city}
          onChange={handleChange}
          required
        />

        <label>State</label>
        <input
          type="text"
          name="state"
          value={formState.state}
          onChange={handleChange}
          required
        />

        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formState.pincode}
          onChange={handleChange}
          required
        />

        <h3>Upload Documents</h3>

        {Object.keys(documents).map((docType) => (
          <div key={docType}>
            <label>{docType}</label>
            <input
              type="file"
              name={docType}
              required
              onChange={handleFileChange}
            />
          </div>
        ))}

        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Apply"}
        </button>
      </form>
    </div>
  );
};

export default ApplyPassport;
