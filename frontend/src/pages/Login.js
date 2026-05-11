// import axios from "axios";
// import { useState } from "react";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const API_BASE = "http://localhost:5004";
//   const handleLogin = async ({ email, password }) => {
//     const res = await axios.post(`${API_BASE}/api/auth/login`, {
//       email,
//       password,
//     });
//     // axios puts response data in res.data
//     localStorage.setItem("token", res.data.token);
//     // setUser(res.data.user);
//     localStorage.setItem("user", JSON.stringify(res.data.user));

//     if (res.data.user.role === "admin") {
//       window.location.href = "/admin";
//     } else {
//       window.location.href = "/scan";
//     }
//   };

//   return (
//     <div>
//       <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

//       <input
//         placeholder="Password"
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       {/* Show server error message */}
//       {error && <p style={{ color: "red" }}>{error}</p>}


//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }
