// // src/components/LandingDoctorsProviders.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   AppBar, Toolbar, Box, Container, Typography, Button, Stack, Avatar,
//   Grid, Paper, Chip, Divider, TextField, MenuItem, Snackbar, Alert, Card, CardContent
// } from "@mui/material";
// import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import StethoscopeIcon from "@mui/icons-material/MedicalServices";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import StarIcon from "@mui/icons-material/Star";
// import { fetchAllInsurancePlans } from "../api/insuranceTeam";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:9090";

// const FEATURES = [
//   { icon: "📅", title: "Instant Booking", desc: "Book appointments 24/7 with real-time availability." },
//   { icon: "💳", title: "Insurance Accepted", desc: "Find providers that accept your insurance." },
//   { icon: "🌈", title: "Modern UI", desc: "Rich, accessible interfaces on all devices." },
//   { icon: "🏥", title: "Wide Network", desc: "Hospitals & clinics for every specialty." },
// ];

// const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
// const doctorColor = "#01988f";
// const providerColor = "#294fab";

// export default function LandingDoctorsProviders({ onLoginSuccess }) {
//   const [aadhaar, setAadhaar] = useState("");
//   const [email, setEmail] = useState("");
//   const [insurance, setInsurance] = useState("");
//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [formError, setFormError] = useState({});
//   const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

//   const [doctors, setDoctors] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const insuranceSectionRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAllInsurancePlans()
//       .then(data => setInsurancePlans(Array.isArray(data) ? data : []));
//     fetch(`${API_BASE}/admin/doctors`).then(r => r.json()).then(data => setDoctors(Array.isArray(data) ? data : []));
//     fetch(`${API_BASE}/admin/providers`).then(r => r.json()).then(data => setProviders(Array.isArray(data) ? data : []));
//   }, []);

//   // Header nav: click insurance scrolls to plans
//   const scrollToInsurance = () => {
//     insuranceSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     let errors = {};
//     if (!aadhaar.trim() || !/^\d{12}$/.test(aadhaar)) errors.aadhaar = "Valid 12-digit Aadhaar required";
//     if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email required";
//     if (!insurance) errors.insurance = "Select insurance";
//     setFormError(errors);
//     if (Object.keys(errors).length) return;
//     try {
//       const resp = await fetch(`${API_BASE}/customers/${aadhaar}`);
//       if (!resp.ok) throw new Error();
//       setSnack({ open: true, msg: "Login successful!", severity: "success" });

//       // save Aadhaar
//       localStorage.setItem("aadhaar", aadhaar);
//       // Inform App top-level if needed (for routing state)
//       if (onLoginSuccess) onLoginSuccess(aadhaar);
//       // Navigate to dashboard after a short delay for UI feedback
//       setTimeout(() => navigate("/dashboard"), 600);

//     } catch {
//       setSnack({ open: true, msg: "Login failed: details not found.", severity: "error" });
//     }
//   };

//   return (
//     <Box sx={{ bgcolor: richGradient, minHeight: "100vh" }}>
//       {/* HEADER */}
//       <AppBar elevation={2} position="fixed" sx={{
//         bgcolor: "#fff", color: "#102938", borderBottom: "1.5px solid #e5eaf2"
//       }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters sx={{ px: { xs: 1, md: 0 }, height: 70 }}>
//             <MedicalInformationIcon sx={{ color: doctorColor, fontSize: 36, mr: 1.2 }} />
//             <Typography variant="h5" fontWeight={900} sx={{
//               background: "linear-gradient(90deg,#00c3ad,#234ba2 100%)",
//               backgroundClip: "text", color: "transparent", WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent", letterSpacing: -1, mr: { xs: 2, md: 7 }
//             }}>HealthConnect</Typography>
//             <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
//               <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} color="inherit">Home</Button>
//               <Button onClick={() => {
//                 document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
//               }} color="inherit">Services Provided By</Button>
//               <Button onClick={scrollToInsurance} color="inherit">Insurance</Button>
//               <Button color="inherit">Contact</Button>
//             </Stack>
//             <Button variant="outlined" sx={{
//               color: doctorColor, borderColor: doctorColor, borderRadius: 3, fontWeight: 700, mr: 1
//             }} href="/login">Sign In</Button>
//             <Button variant="contained" sx={{
//               bgcolor: "linear-gradient(90deg,#00c3ad,#234ba2)", color: "#fff", borderRadius: 3, fontWeight: 700
//             }} href="/signup">Sign Up</Button>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* HERO + HORIZONTAL LOGIN */}
//       <Box sx={{
//         pt: { xs: 13, md: 15 }, pb: 4, background: richGradient,
//         color: "#fff", textAlign: "center"
//       }}>
//         <Container maxWidth="lg">
//           <Typography variant="h2" fontWeight={700} sx={{
//             mb: 2, letterSpacing: -0.7, fontSize: { xs: "2rem", md: "2.5rem" }
//           }}>
//             Secure Patient Access – Find the Right Care Instantly
//           </Typography>
//           <Typography sx={{ fontSize: '1.16rem', opacity: .95, mb: 2 }}>
//             Enter your Aadhaar, Email, and select insurance to explore healthcare providers near you.
//           </Typography>
//           {/* HORIZONTAL LOGIN FORM */}
//           <Box mx="auto" maxWidth={1050} mt={3}>
//             <Paper elevation={5} sx={{
//               p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: "#fff",
//               display: "flex", gap: 2.5, flexWrap: { xs: "wrap", md: "nowrap" },
//               alignItems: "center", justifyContent: "center"
//             }}>
//               <Avatar sx={{ bgcolor: doctorColor, width: 50, height: 50, mr: 2 }}>
//                 <MedicalInformationIcon fontSize="large" />
//               </Avatar>
//               <TextField
//                 label="Aadhaar"
//                 value={aadhaar}
//                 onChange={e => setAadhaar(e.target.value)}
//                 size="small"
//                 error={!!formError.aadhaar}
//                 helperText={formError.aadhaar}
//                 inputProps={{ maxLength: 12, inputMode: "numeric" }}
//                 sx={{ minWidth: 140, flex: 1 }}
//               />
//               <TextField
//                 label="Email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 size="small"
//                 error={!!formError.email}
//                 helperText={formError.email}
//                 type="email"
//                 sx={{ minWidth: 180, flex: 2 }}
//               />
//               <TextField
//                 label="Insurance Plan"
//                 value={insurance}
//                 onChange={e => setInsurance(e.target.value)}
//                 select
//                 size="small"
//                 error={!!formError.insurance}
//                 helperText={formError.insurance}
//                 sx={{ minWidth: 160, flex: 1.5 }}
//               >
//                 <MenuItem value="">Select...</MenuItem>
//                 {insurancePlans.map(plan => (
//                   <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
//                 ))}
//               </TextField>
//               <Button
//                 type="button"
//                 variant="contained"
//                 sx={{
//                   bgcolor: "linear-gradient(90deg,#00c3ad,#234ba2)",
//                   color: "#fff", borderRadius: 2.5, fontWeight: 700, px: 4, py: 1.5, fontSize: "1.08rem"
//                 }}
//                 onClick={handleSubmit}
//               >
//                 Sign In
//               </Button>
//             </Paper>
//           </Box>
//         </Container>
//       </Box>

//       {/* INSURANCE CARDS */}
//       <Box ref={insuranceSectionRef} sx={{ mt: 7, mb: 3 }}>
//         <Container maxWidth="xl">
//           <Typography variant="h4" fontWeight={800} align="center" sx={{
//             mb: 3, letterSpacing: -0.5, color: doctorColor, pb: 1
//           }}>
//             Explore Our Insurance Plans
//           </Typography>
//           <Grid container spacing={4} justifyContent="center">
//             {insurancePlans.slice(0, 4).map((plan, i) => (
//               <Grid item xs={12} sm={6} md={3} key={plan.title || plan.id || i}>
//                 <Card elevation={6} sx={{
//                   borderRadius: 4, bgcolor: "#ebfbf9", boxShadow: "0 5px 20px #d3f0ef88",
//                   minHeight: 175, p: 1.5, display: "flex", flexDirection: "column", justifyContent: "center"
//                 }}>
//                   <CardContent>
//                     <Typography variant="h6" fontWeight={700} sx={{ color: doctorColor, mb: 1, textAlign: "center" }}>{plan.title || "Insurance Plan"}</Typography>
//                     <Typography fontWeight={600} sx={{ color: "#297dbc", textAlign: "center", mb: 1 }}>
//                       ₹{plan.amount ? Number(plan.amount).toLocaleString() : (plan.coverage || "N/A")}
//                     </Typography>
//                     <Typography variant="body2" color="#2e5168" sx={{ opacity: .95, textAlign: "center" }}>
//                       {plan.description || plan.desc || "Perfect coverage for hospital stays, diagnostics and more!"}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* SERVICES PROVIDED BY */}
//       <Container maxWidth="xl" sx={{ py: 6 }}>
//         <Box id="services" sx={{ mb: 5 }}>
//           <Typography variant="h4" fontWeight={900} align="center" color="primary.dark" sx={{
//             mb: 1.5, letterSpacing: -.5, fontSize: { xs: "1.8rem", md: "2.2rem" }
//           }}>
//             Services Provided By
//           </Typography>
//           <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
//             Meet our top doctors and reputed hospitals, ready to care for you.
//           </Typography>
//         </Box>
//         <Grid container spacing={4} justifyContent="center">
//           {/* Doctors Cards */}
//           {doctors.map((doc, idx) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id || doc._id || idx}>
//               <Paper elevation={6} sx={{
//                 borderRadius: 4, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
//                 bgcolor: "#fafcff", minHeight: 225, transition: ".18s",
//                 ":hover": { boxShadow: 10, transform: "translateY(-5px) scale(1.02)" }
//               }}>
//                 <Avatar sx={{
//                   width: 66, height: 66, mb: 2, bgcolor: doctorColor, color: "#fff"
//                 }}>
//                   <StethoscopeIcon sx={{ fontSize: 32 }} />
//                 </Avatar>
//                 <Typography variant="h6" fontWeight={600} gutterBottom>
//                   {doc.name}
//                 </Typography>
//                 <Typography variant="body2" color={doctorColor} fontWeight={700} mb={1}>
//                   {doc.specialty || doc.specialization || "Specialty"}
//                 </Typography>
//                 <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//                   <StarIcon sx={{ color: "#ffb400", fontSize: "1.15rem", mb: "1px" }} />
//                   <Typography color="text.primary" fontWeight={700} fontSize="1rem">{Number(doc.rating || 0).toFixed(1)}</Typography>
//                 </Stack>
//                 <Button variant="contained"
//                   fullWidth
//                   sx={{
//                     borderRadius: 17, bgcolor: doctorColor,
//                     fontWeight: 700, mt: "auto",
//                     "&:hover": { background: "#01736d" }
//                   }}>
//                   See Location
//                 </Button>
//               </Paper>
//             </Grid>
//           ))}
//           {/* Providers Cards */}
//           {providers.map((prov, idx) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={prov.id || prov._id || idx}>
//               <Paper elevation={6} sx={{
//                 borderRadius: 4, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
//                 bgcolor: "#f8fafd", minHeight: 270, transition: ".18s",
//                 ":hover": { boxShadow: 10, transform: "translateY(-5px) scale(1.02)" }
//               }}>
//                 <Avatar sx={{
//                   width: 66, height: 66, mb: 2, bgcolor: providerColor, color: "#fff"
//                 }}>
//                   <AddCircleOutlineIcon sx={{ fontSize: 34 }} />
//                 </Avatar>
//                 <Typography variant="h6" fontWeight={600} gutterBottom>
//                   {prov.hospitalName || prov.name}
//                 </Typography>
//                 <Typography variant="body2" color={providerColor} fontWeight={700} mb={1}>
//                   {prov.specialization || prov.specialty || prov.location || "Specialization"}
//                 </Typography>
//                 <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//                   <StarIcon sx={{ color: "#f0932b", fontSize: "1.15rem", mb: "1px" }} />
//                   <Typography color="text.primary" fontWeight={700} fontSize="1rem">{Number(prov.rating || 0).toFixed(1)}</Typography>
//                 </Stack>
//                 <Stack direction="row" spacing={0.7} flexWrap="wrap" justifyContent="center" mb={1.8}>
//                   {(Array.isArray(prov.insurancePlans) && prov.insurancePlans.length
//                     ? prov.insurancePlans : ["No Insurance"]).map(plan =>
//                       <Chip key={plan} label={plan} size="small" variant="outlined"
//                         sx={{
//                           bgcolor: plan === "No Insurance" ? "#f7fafd" : "#edf6fa",
//                           color: "#294fab", fontWeight: 600
//                         }} />
//                     )}
//                 </Stack>
//                 <Button variant="contained"
//                   fullWidth
//                   sx={{
//                     borderRadius: 17, bgcolor: providerColor,
//                     fontWeight: 700, mt: "auto",
//                     "&:hover": { background: "#162d52" }
//                   }}>
//                   Find
//                 </Button>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Feature Cards */}
//       <Box sx={{ bgcolor: "#fff", py: 6, mt: 7 }}>
//         <Container maxWidth="lg">
//           <Typography sx={{
//             fontSize: "2.3rem", fontWeight: 700, textAlign: "center", mb: 5,
//             background: "linear-gradient(45deg, #00c3ad, #234ba2)",
//             backgroundClip: "text", color: "transparent", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
//           }}>
//             Why Choose HealthConnect?
//           </Typography>
//           <Grid container spacing={4}>
//             {FEATURES.map((f, idx) =>
//               <Grid item xs={12} sm={6} md={3} key={idx}>
//                 <Paper elevation={2} sx={{
//                   textAlign: 'center', py: 4, px: 2, borderRadius: 2,
//                   background: "linear-gradient(135deg, #e3faf9 0%, #e1eaff 100%)"
//                 }}>
//                   <Box sx={{
//                     width: 66, height: 66, fontSize: "2rem",
//                     color: "#fff", background: richGradient,
//                     borderRadius: "50%", mx: "auto", mb: 3, display: "flex", alignItems: "center", justifyContent: "center"
//                   }}>{f.icon}</Box>
//                   <Typography variant="h6" fontWeight="700" mb={1}>{f.title}</Typography>
//                   <Typography color="#666" fontSize="1rem">{f.desc}</Typography>
//                 </Paper>
//               </Grid>
//             )}
//           </Grid>
//         </Container>
//       </Box>

//       {/* FOOTER */}
//       <Box component="footer" sx={{
//         background: "#1f2941", color: "#fff", mt: 7, pt: { xs: 5, md: 7 }, pb: 2
//       }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             <Grid item xs={12} md={3}>
//               <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>HealthConnect</Typography>
//               <Typography>Making healthcare accessible and convenient for everyone.</Typography>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>For Patients</Typography>
//               <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Find a Doctor</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Book Appointment</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Patient Portal</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Insurance Guide</a></li>
//               </Stack>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>For Providers</Typography>
//               <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Join Network</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Provider Portal</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Practice Management</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Support</a></li>
//               </Stack>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>Company</Typography>
//               <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>About Us</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Careers</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Privacy Policy</a></li>
//                 <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Terms of Service</a></li>
//               </Stack>
//             </Grid>
//           </Grid>
//           <Divider sx={{ my: 2, borderColor: "#163545" }} />
//           <Typography align="center" sx={{ color: "#8ce0d9", pt: 2 }}>
//             &copy; {new Date().getFullYear()} HealthConnect. All rights reserved.
//           </Typography>
//         </Container>
//       </Box>
//       <Snackbar
//         open={snack.open}
//         onClose={() => setSnack(s => ({ ...s, open: false }))}
//         autoHideDuration={2700}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// src/components/LandingDoctorsProviders.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  AppBar, Toolbar, Box, Container, Typography, Button, Stack, Avatar,
  Grid, Paper, Chip, Divider, TextField, MenuItem, Snackbar, Alert, Card, CardContent
} from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StethoscopeIcon from "@mui/icons-material/MedicalServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import { fetchAllInsurancePlans } from "../api/insuranceTeam";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:9090";

const FEATURES = [
  { icon: "📅", title: "Instant Booking", desc: "Book appointments 24/7 with real-time availability." },
  { icon: "💳", title: "Insurance Accepted", desc: "Find providers that accept your insurance." },
  { icon: "🌈", title: "Modern UI", desc: "Rich, accessible interfaces on all devices." },
  { icon: "🏥", title: "Wide Network", desc: "Hospitals & clinics for every specialty." },
];

const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

export default function LandingDoctorsProviders({ onLoginSuccess }) {
  const [aadhaar, setAadhaar] = useState("");
  const [email, setEmail] = useState("");
  const [insurance, setInsurance] = useState("");
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [formError, setFormError] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [doctors, setDoctors] = useState([]);
  const [providers, setProviders] = useState([]);
  const insuranceSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllInsurancePlans()
      .then(data => setInsurancePlans(Array.isArray(data) ? data : []));
    fetch(`${API_BASE}/admin/doctors`).then(r => r.json()).then(data => setDoctors(Array.isArray(data) ? data : []));
    fetch(`${API_BASE}/admin/providers`).then(r => r.json()).then(data => setProviders(Array.isArray(data) ? data : []));
  }, []);

  // Scroll handler for insurance section
  const scrollToInsurance = () => {
    insuranceSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Modified handleSubmit: fetch full profile, store full object, navigate
  const handleSubmit = async e => {
    e.preventDefault();
    let errors = {};
    if (!aadhaar.trim() || !/^\d{12}$/.test(aadhaar)) errors.aadhaar = "Valid 12-digit Aadhaar required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Valid email required";
    if (!insurance) errors.insurance = "Select insurance";
    setFormError(errors);
    if (Object.keys(errors).length) return;
    try {
      const resp = await fetch(`${API_BASE}/customers/${aadhaar}`);
      if (!resp.ok) throw new Error();
      const profile = await resp.json();

      // Store full profile along with entered email and insurance
      const userObj = {
        ...profile,
        email,
        selectedInsurance: insurance,
      };

      localStorage.setItem("user", JSON.stringify(userObj));

      setSnack({ open: true, msg: "Login successful!", severity: "success" });

      if (typeof onLoginSuccess === "function") onLoginSuccess(userObj);

      navigate("/customer");
    } catch {
      setSnack({ open: true, msg: "Login failed: details not found.", severity: "error" });
    }
  };

  return (
    <Box sx={{ bgcolor: richGradient, minHeight: "100vh" }}>
      {/* HEADER */}
      <AppBar elevation={2} position="fixed" sx={{
        bgcolor: "#fff", color: "#102938", borderBottom: "1.5px solid #e5eaf2"
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ px: { xs: 1, md: 0 }, height: 70 }}>
            <MedicalInformationIcon sx={{ color: doctorColor, fontSize: 36, mr: 1.2 }} />
            <Typography variant="h5" fontWeight={900} sx={{
              background: "linear-gradient(90deg,#00c3ad,#234ba2 100%)",
              backgroundClip: "text", color: "transparent", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", letterSpacing: -1, mr: { xs: 2, md: 7 }
            }}>HealthConnect</Typography>
            <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} color="inherit">Home</Button>
              <Button onClick={() => {
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }} color="inherit">Services Provided By</Button>
              <Button onClick={scrollToInsurance} color="inherit">Insurance</Button>
              <Button color="inherit">Contact</Button>
            </Stack>
            {/* These buttons are static links (not intercepting SPA router) */}
            <Button variant="outlined" sx={{
              color: doctorColor, borderColor: doctorColor, borderRadius: 3, fontWeight: 700, mr: 1
            }} href="/login">Sign In</Button>
            <Button variant="contained" sx={{
              bgcolor: "linear-gradient(90deg,#00c3ad,#234ba2)", color: "#fff", borderRadius: 3, fontWeight: 700
            }} href="/signup">Sign Up</Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO + HORIZONTAL LOGIN */}
      <Box sx={{
        pt: { xs: 13, md: 15 }, pb: 4, background: richGradient,
        color: "#fff", textAlign: "center"
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={700} sx={{
            mb: 2, letterSpacing: -0.7, fontSize: { xs: "2rem", md: "2.5rem" }
          }}>
            Secure Patient Access – Find the Right Care Instantly
          </Typography>
          <Typography sx={{ fontSize: '1.16rem', opacity: .95, mb: 2 }}>
            Enter your Aadhaar, Email, and select insurance to explore healthcare providers near you.
          </Typography>
          {/* HORIZONTAL LOGIN FORM */}
          <Box mx="auto" maxWidth={1050} mt={3}>
            <Paper elevation={5} sx={{
              p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: "#fff",
              display: "flex", gap: 2.5, flexWrap: { xs: "wrap", md: "nowrap" },
              alignItems: "center", justifyContent: "center"
            }}>
              <Avatar sx={{ bgcolor: doctorColor, width: 50, height: 50, mr: 2 }}>
                <MedicalInformationIcon fontSize="large" />
              </Avatar>
              <TextField
                label="Aadhaar"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                size="small"
                error={!!formError.aadhaar}
                helperText={formError.aadhaar}
                inputProps={{ maxLength: 12, inputMode: "numeric" }}
                sx={{ minWidth: 140, flex: 1 }}
              />
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                size="small"
                error={!!formError.email}
                helperText={formError.email}
                type="email"
                sx={{ minWidth: 180, flex: 2 }}
              />
              <TextField
                label="Insurance Plan"
                value={insurance}
                onChange={e => setInsurance(e.target.value)}
                select
                size="small"
                error={!!formError.insurance}
                helperText={formError.insurance}
                sx={{ minWidth: 160, flex: 1.5 }}
              >
                <MenuItem value="">Select...</MenuItem>
                {insurancePlans.map(plan => (
                  <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
                ))}
              </TextField>
              <Button
                type="button"
                variant="contained"
                sx={{
                  bgcolor: "linear-gradient(90deg,#00c3ad,#234ba2)",
                  color: "#fff", borderRadius: 2.5, fontWeight: 700, px: 4, py: 1.5, fontSize: "1.08rem"
                }}
                onClick={handleSubmit}
              >
                Sign In
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* INSURANCE CARDS */}
      <Box ref={insuranceSectionRef} sx={{ mt: 7, mb: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={800} align="center" sx={{
            mb: 3, letterSpacing: -0.5, color: doctorColor, pb: 1
          }}>
            Explore Our Insurance Plans
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {insurancePlans.slice(0, 4).map((plan, i) => (
              <Grid item xs={12} sm={6} md={3} key={plan.title || plan.id || i}>
                <Card elevation={6} sx={{
                  borderRadius: 4, bgcolor: "#ebfbf9", boxShadow: "0 5px 20px #d3f0ef88",
                  minHeight: 175, p: 1.5, display: "flex", flexDirection: "column", justifyContent: "center"
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ color: doctorColor, mb: 1, textAlign: "center" }}>{plan.title || "Insurance Plan"}</Typography>
                    <Typography fontWeight={600} sx={{ color: "#297dbc", textAlign: "center", mb: 1 }}>
                      ₹{plan.amount ? Number(plan.amount).toLocaleString() : (plan.coverage || "N/A")}
                    </Typography>
                    <Typography variant="body2" color="#2e5168" sx={{ opacity: .95, textAlign: "center" }}>
                      {plan.description || plan.desc || "Perfect coverage for hospital stays, diagnostics and more!"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SERVICES PROVIDED BY */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box id="services" sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight={900} align="center" color="primary.dark" sx={{
            mb: 1.5, letterSpacing: -.5, fontSize: { xs: "1.8rem", md: "2.2rem" }
          }}>
            Services Provided By
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
            Meet our top doctors and reputed hospitals, ready to care for you.
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {/* Doctors Cards */}
          {doctors.map((doc, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id || doc._id || idx}>
              <Paper elevation={6} sx={{
                borderRadius: 4, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
                bgcolor: "#fafcff", minHeight: 225, transition: ".18s",
                ":hover": { boxShadow: 10, transform: "translateY(-5px) scale(1.02)" }
              }}>
                <Avatar sx={{
                  width: 66, height: 66, mb: 2, bgcolor: doctorColor, color: "#fff"
                }}>
                  <StethoscopeIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {doc.name}
                </Typography>
                <Typography variant="body2" color={doctorColor} fontWeight={700} mb={1}>
                  {doc.specialty || doc.specialization || "Specialty"}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <StarIcon sx={{ color: "#ffb400", fontSize: "1.15rem", mb: "1px" }} />
                  <Typography color="text.primary" fontWeight={700} fontSize="1rem">{Number(doc.rating || 0).toFixed(1)}</Typography>
                </Stack>
                <Button variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 17, bgcolor: doctorColor,
                    fontWeight: 700, mt: "auto",
                    "&:hover": { background: "#01736d" }
                  }}>
                  See Location
                </Button>
              </Paper>
            </Grid>
          ))}
          {/* Providers Cards */}
          {providers.map((prov, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={prov.id || prov._id || idx}>
              <Paper elevation={6} sx={{
                borderRadius: 4, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
                bgcolor: "#f8fafd", minHeight: 270, transition: ".18s",
                ":hover": { boxShadow: 10, transform: "translateY(-5px) scale(1.02)" }
              }}>
                <Avatar sx={{
                  width: 66, height: 66, mb: 2, bgcolor: providerColor, color: "#fff"
                }}>
                  <AddCircleOutlineIcon sx={{ fontSize: 34 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {prov.hospitalName || prov.name}
                </Typography>
                <Typography variant="body2" color={providerColor} fontWeight={700} mb={1}>
                  {prov.specialization || prov.specialty || prov.location || "Specialization"}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <StarIcon sx={{ color: "#f0932b", fontSize: "1.15rem", mb: "1px" }} />
                  <Typography color="text.primary" fontWeight={700} fontSize="1rem">{Number(prov.rating || 0).toFixed(1)}</Typography>
                </Stack>
                <Stack direction="row" spacing={0.7} flexWrap="wrap" justifyContent="center" mb={1.8}>
                  {(Array.isArray(prov.insurancePlans) && prov.insurancePlans.length
                    ? prov.insurancePlans : ["No Insurance"]).map(plan =>
                      <Chip key={plan} label={plan} size="small" variant="outlined"
                        sx={{
                          bgcolor: plan === "No Insurance" ? "#f7fafd" : "#edf6fa",
                          color: "#294fab", fontWeight: 600
                        }} />
                    )}
                </Stack>
                <Button variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 17, bgcolor: providerColor,
                    fontWeight: 700, mt: "auto",
                    "&:hover": { background: "#162d52" }
                  }}>
                  Find
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Cards */}
      <Box sx={{ bgcolor: "#fff", py: 6, mt: 7 }}>
        <Container maxWidth="lg">
          <Typography sx={{
            fontSize: "2.3rem", fontWeight: 700, textAlign: "center", mb: 5,
            background: "linear-gradient(45deg, #00c3ad, #234ba2)",
            backgroundClip: "text", color: "transparent", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Why Choose HealthConnect?
          </Typography>
          <Grid container spacing={4}>
            {FEATURES.map((f, idx) =>
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper elevation={2} sx={{
                  textAlign: 'center', py: 4, px: 2, borderRadius: 2,
                  background: "linear-gradient(135deg, #e3faf9 0%, #e1eaff 100%)"
                }}>
                  <Box sx={{
                    width: 66, height: 66, fontSize: "2rem",
                    color: "#fff", background: richGradient,
                    borderRadius: "50%", mx: "auto", mb: 3, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight="700" mb={1}>{f.title}</Typography>
                  <Typography color="#666" fontSize="1rem">{f.desc}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box component="footer" sx={{
        background: "#1f2941", color: "#fff", mt: 7, pt: { xs: 5, md: 7 }, pb: 2
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>HealthConnect</Typography>
              <Typography>Making healthcare accessible and convenient for everyone.</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>For Patients</Typography>
              <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Find a Doctor</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Book Appointment</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Patient Portal</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Insurance Guide</a></li>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>For Providers</Typography>
              <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Join Network</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Provider Portal</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Practice Management</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Support</a></li>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>Company</Typography>
              <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>About Us</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Careers</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Terms of Service</a></li>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, borderColor: "#163545" }} />
          <Typography align="center" sx={{ color: "#8ce0d9", pt: 2 }}>
            &copy; {new Date().getFullYear()} HealthConnect. All rights reserved.
          </Typography>
        </Container>
      </Box>

      <Snackbar
        open={snack.open}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        autoHideDuration={2700}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

