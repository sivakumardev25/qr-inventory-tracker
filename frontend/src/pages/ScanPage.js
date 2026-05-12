import axios from "axios";
import { API_BASE } from "./config";

const saveScan = async (qrData) => {
  const token = localStorage.getItem("token");

  await axios.post(
    `{API_BASE}/api/scans`,
    {
      qrData,
      item: qrData,
    },
    {
      headers: {
        Authorization: token,
      },
    },
  );
};
