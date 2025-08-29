
// // CustomerFooter.jsx

// import React from "react";
// import { Box, Container, Grid, Typography, Link, Stack } from "@mui/material";
// import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

// export default function CustomerFooter() {
//   return (
//     <Box component="footer" sx={{
//       bgcolor: "#232259",
//       color: "#eee",
//       pt: 6, pb: 3, mt: 10
//     }}>
//       <Container maxWidth="xl">
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={4}>
//             <Stack direction="row" alignItems="center" spacing={1} mb={1}>
//               <MedicalInformationIcon sx={{ color: "#3b90fd" }} />
//               <Typography variant="h6" fontWeight="bold">HealthConnect</Typography>
//             </Stack>
//             <Typography sx={{ opacity: 0.85 }}>
//               Helping you find the right doctors, hospitals, and insurance plans–fast, easy, and trusted.
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={5}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Typography fontWeight={700} sx={{ mb: 1 }}>Navigation</Typography>
//                 <Stack spacing={1}>
//                   <Link href="/home" color="inherit" underline="hover">Home</Link>
//                   <Link href="/find-doctor" color="inherit" underline="hover">Find Doctor</Link>
//                   <Link href="/providers" color="inherit" underline="hover">Hospitals</Link>
//                   <Link href="/insurance" color="inherit" underline="hover">Insurance</Link>
//                 </Stack>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography fontWeight={700} sx={{ mb: 1 }}>Resources</Typography>
//                 <Stack spacing={1}>
//                   <Link href="/support" color="inherit" underline="hover">Support</Link>
//                   <Link href="/about" color="inherit" underline="hover">About</Link>
//                   <Link href="/privacy" color="inherit" underline="hover">Privacy Policy</Link>
//                 </Stack>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Typography fontWeight={700} sx={{ mb: 1 }}>Contact</Typography>
//             <Typography variant="body2" sx={{ mb: 1 }}>help@healthconnect.com</Typography>
//             <Typography variant="body2">Mon–Fri: 9am–8pm</Typography>
//           </Grid>
//         </Grid>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
//           <Typography variant="body2" sx={{ color: "#a2a8c6" }}>
//             &copy; {new Date().getFullYear()} HealthConnect. All rights reserved.
//           </Typography>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }


// src/components/CustomerFooter.jsx
import React from "react";
import { Box, Container, Grid, Typography, Stack, Divider } from "@mui/material";

export default function CustomerFooter() {
  return (
    <Box component="footer" sx={{
      background: "#1f2941", color: "#fff", mt: 9, pt: { xs: 5, md: 7 }, pb: 2,
      position: "relative", bottom: 0, width: "100%"
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>HealthConnect</Typography>
            <Typography fontSize="1rem">Making healthcare accessible and convenient for everyone.</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>For Patients</Typography>
            <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
              <li><a href="/dashboard/providers" style={{ color: "#9ff1ea", textDecoration: "none" }}>Find a Provider</a></li>
              <li><a href="/dashboard/appointments" style={{ color: "#9ff1ea", textDecoration: "none" }}>Book Appointment</a></li>
              <li><a href="/dashboard/profile" style={{ color: "#9ff1ea", textDecoration: "none" }}>Profile</a></li>
              <li><a href="/dashboard/insurance" style={{ color: "#9ff1ea", textDecoration: "none" }}>My Insurance</a></li>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: "#00c3ad", mb: 2 }}>For Providers</Typography>
            <Stack spacing={0.8} component="ul" sx={{ pl: 0, listStyle: "none" }}>
              <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Join Network</a></li>
              <li><a href="#" style={{ color: "#9ff1ea", textDecoration: "none" }}>Provider Portal</a></li>
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
        <Typography align="center" sx={{ color: "#8ce0d9", pt: 2, fontSize: "1rem" }}>
          &copy; {new Date().getFullYear()} HealthConnect. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
