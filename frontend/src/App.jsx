
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api/applications";

function App() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [appliedDate, setAppliedDate] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load applications");
        }

        setApplications(result.data);
      } catch (err) {
        setError("Could not load applications. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  async function addApplication(e) {
    e.preventDefault();
    setError("");

    if (new Date(appliedDate) > new Date()) {
      alert("Applied date cannot be in the future.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company,
          role,
          jobType,
          appliedDate,
          salary: salary === "" ? 0 : Number(salary),
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add application");
      }

      setApplications((previous) => [
        result.data,
        ...previous,
      ]);

      setCompany("");
      setRole("");
      setJobType("Full-time");
      setAppliedDate("");
      setSalary("");
      setNotes("");
    } catch (err) {
      setError(err.message || "Could not save the application.");
    }
  }

  return (
    <main className="app">
      <header className="header">
        <h1>JobTrack</h1>
        <p>Track your career journey, one application at a time.</p>
      </header>

      <section className="panel">
        <h2>Add Job Application</h2>

        <form onSubmit={addApplication}>
          <label>Company Name</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <label>Job Role</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <label>Job Type</label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option>Full-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>

          <label>Applied Date</label>
          <input
            type="date"
            max={new Date().toLocaleDateString("en-CA")}
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            required
          />

          <label>Expected Salary (optional)</label>
          <input
            type="number"
            min="0"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit">Add Application</button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="applications">
        <h2>Your Applications ({applications.length})</h2>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="empty">
            No applications yet. Add your first one!
          </p>
        ) : (
          applications.map((item) => (
            <article className="job-card" key={item._id}>
              <div>
                <h3>{item.companyName}</h3>
                <p>{item.role} · {item.jobType}</p>
                <p>
                  Applied: {new Date(item.appliedDate).toLocaleDateString()}
                </p>
                {item.salary > 0 && <p>Expected Salary: {item.salary}</p>}
                {item.notes && <p>Notes: {item.notes}</p>}
                <span className="status">{item.status}</span>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
