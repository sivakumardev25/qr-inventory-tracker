import axios from "axios";

const saveScan = async (qrData) => {
  const token = localStorage.getItem("token");

  await axios.post(
    `${REACT_APP_API_URL}/api/scans`,
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
