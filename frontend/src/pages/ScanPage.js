import axios from "axios";

const saveScan = async (qrData) => {
  const token = localStorage.getItem("token");

  await axios.post(
    "http://localhost:5004/api/scans",
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
