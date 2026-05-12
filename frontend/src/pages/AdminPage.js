import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "./config";

export default function AdminDashboard() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`{API_BASE}/api/scans`, {
      headers: {
        Authorization: token,
      },
    });

    setScans(res.data);
  };

  return (
    <div>
      <h1>All Scans</h1>

      {scans.map((scan) => (
        <div key={scan._id}>
          <h3>{scan.item}</h3>

          <p>{scan.scannedBy?.name}</p>

          <p>{new Date(scan.scannedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
