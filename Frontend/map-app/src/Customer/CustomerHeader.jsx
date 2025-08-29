// // CustomerHeader.jsx

// import React from "react";
// import { AppBar, Toolbar, Typography, Container, Box, Button, Stack } from "@mui/material";
// import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

// export default function CustomerHeader() {
//   return (
//     <AppBar position="fixed" elevation={2} sx={{
//       bgcolor: "white",
//       color: "#232259",
//       borderBottom: "1px solid #f1f1f2"
//     }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <MedicalInformationIcon sx={{ color: "primary.main", fontSize: 34, mr: 1, ml: -1 }} />
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 900,
//               background: "linear-gradient(90deg,#3b90fd,#4e3869 100%)",
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               color: "transparent",
//               WebkitTextFillColor: "transparent",
//               letterSpacing: "-1px",
//               mr: { xs: 0, sm: 6 }
//             }}
//           >
//             HealthConnect
//           </Typography>
//           <Box sx={{ flexGrow: 1 }} />
//           <Stack direction="row" spacing={2}>
//             <Button color="primary" href="/home" sx={{ fontWeight: 700 }}>Home</Button>
//             <Button color="primary" href="/find-doctor" sx={{ fontWeight: 700 }}>Find Doctor</Button>
//             <Button color="primary" href="/providers" sx={{ fontWeight: 700 }}>Hospitals</Button>
//             <Button color="primary" href="/insurance" sx={{ fontWeight: 700 }}>Insurance</Button>
//             <Button color="primary" href="/profile" sx={{ fontWeight: 700 }}>Profile</Button>
//             <Button variant="outlined" color="secondary" href="/login" sx={{ fontWeight: 700, borderRadius: 3 }}>Logout</Button>
//           </Stack>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }



// // src/components/CustomerHeader.jsx
// import React from "react";
// import { AppBar, Toolbar, Typography, Button, Stack, Container } from "@mui/material";
// import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

// const doctorColor = "#00c3ad";
// const accentColor = "#234ba2";
// const navLinks = [
//   { label: "Dashboard", href: "/dashboard" },
//   { label: "Appointments", href: "/dashboard/appointments" },
//   { label: "Providers", href: "/dashboard/providers" },
//   { label: "Insurance Plans", href: "/dashboard/insurance" },
//   { label: "Profile", href: "/dashboard/profile" }
// ];

// export default function CustomerHeader({ onLogout }) {
//   return (
//     <AppBar elevation={3} position="fixed" sx={{
//       bgcolor: "#fff", color: "#102938", borderBottom: "1.5px solid #e5eaf2"
//     }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ px: { xs: 1, md: 0 }, height: 70 }}>
//           <MedicalInformationIcon sx={{ color: doctorColor, fontSize: 36, mr: 1.5 }} />
//           <Typography
//             variant="h5"
//             fontWeight={900}
//             sx={{
//               background: "linear-gradient(90deg,#00c3ad,#234ba2 100%)",
//               backgroundClip: "text",
//               color: "transparent",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               letterSpacing: -1,
//               mr: { xs: 2, md: 7 }
//             }}>HealthConnect</Typography>
//           <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
//             {navLinks.map(link => (
//               <Button
//                 key={link.href}
//                 href={link.href}
//                 sx={{
//                   fontWeight: 700,
//                   "&:hover": {
//                     color: doctorColor,
//                   },
//                 }}
//                 color="inherit"
//               >
//                 {link.label}
//               </Button>
//             ))}
//           </Stack>
//           <Button
//             onClick={onLogout}
//             variant="contained"
//             sx={{
//               bgcolor: "linear-gradient(90deg,#00c3ad,#234ba2)",
//               color: "#fff",
//               borderRadius: 3,
//               fontWeight: 800,
//               ml: 1
//             }}
//           >
//             Logout
//           </Button>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// import React from "react";
// import { AppBar, Toolbar, Typography, Button, Stack, Container } from "@mui/material";
// import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

// const doctorColor = "#00c3ad";
// const navLinks = [
//   { label: "Dashboard", section: "map" },
//   { label: "Appointments", section: "map" },
//   { label: "Providers", section: "providers" },
//   { label: "Insurance Plans", section: "insurance" },
//   { label: "Profile", section: "profile" }
// ];

// export default function CustomerHeader({ onSectionChange, onLogout }) {
//   return (
//     <AppBar elevation={3} position="fixed" sx={{
//       bgcolor: "#fff", color: "#102938", borderBottom: "1.5px solid #e5eaf2"
//     }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ px: { xs: 1, md: 0 }, height: 70 }}>
//           <MedicalInformationIcon sx={{ color: doctorColor, fontSize: 36, mr: 1.5 }} />
//           <Typography
//             variant="h5"
//             fontWeight={900}
//             sx={{
//               background: "linear-gradient(90deg,#00c3ad,#234ba2 100%)",
//               backgroundClip: "text",
//               color: "transparent",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               letterSpacing: -1,
//               mr: { xs: 2, md: 7 }
//             }}>HealthConnect</Typography>
//           <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
//             {navLinks.map(link => (
              
//               <Button
//                 key={link.section}
//                 onClick={() => onSectionChange && onSectionChange(link.section)}
//                 sx={{
//                   fontWeight: 700,
//                   "&:hover": { color: doctorColor }
//                 }}
//                 color="inherit"
//               >
//                 {link.label}
//               </Button>
//             ))}
//           </Stack>
//           <Button onClick={() => onSectionChange("profile")}>Profile</Button>
//           <Button
//             onClick={onLogout}
//             variant="contained"
//             sx={{
//               bgcolor: "linear-gradient(90deg,#00c3ad,#234ba2)",
//               color: "#fff",
//               borderRadius: 3,
//               fontWeight: 800,
//               ml: 1
//             }}
//           >
//             Logout
//           </Button>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// src/Customer/CustomerHeader.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Stack, Container, Avatar, IconButton, Button,
  Divider, Popover, Box, Chip, Tooltip
} from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GppGoodIcon from "@mui/icons-material/GppGood";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { format } from "date-fns";
import { fetchCustomerById } from "../api/customer";

// Theme and nav
const doctorColor = "#00c3ad";
const providerColor = "#294fab";
const navLinks = [
  { label: "Home", section: "map" },
  //{ label: "Appointments", section: "map" },
  { label: "Providers", section: "providers" },
  { label: "Insurance Plans", section: "insurance" },
 // { label: "Profile", section: "profile" },
];

// Utility for initials
function stringAvatar(name) {
  if (!name) return "";
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return `${names[0][0]}${names[1][0]}`.toUpperCase();
}

// Format date
function niceDate(date) {
  if (!date) return "";
  try { return format(new Date(date), "dd MMM yyyy"); }
  catch { return String(date); }
}

export default function CustomerHeader({ onSectionChange }) {
  // State: minimal user from localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  });

  // State: full customer profile
  const [fullCustomer, setFullCustomer] = useState(user);

  // DEBUG: print what's read from storage and state at render
  useEffect(() => {
    // Print current localStorage
    try {
      const lsUser = JSON.parse(localStorage.getItem("user"));
      console.log("DEBUG: customer object in localStorage at render:", lsUser);
    } catch {}
    // Print current display object
    console.log("DEBUG: current fullCustomer state:", fullCustomer);
  }, [fullCustomer]);

  // Fetch fresh profile from backend using Aadhaar
  useEffect(() => {
    const aadhaar = user.adhar_num || user.aadhaar;
    if (aadhaar) {
      fetchCustomerById(aadhaar).then((profile) => {
        if (profile) {
          // LOG THE PROFILE OBJECT!
          console.log("Full fetched customer profile object:", profile);
          setFullCustomer(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        }
      });
    }
  }, [user.adhar_num, user.aadhaar]);

  // Avatar popover
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  // Profile avatar image
  const displayAvatar =
    fullCustomer.avatar || localStorage.getItem("profile_avatar") || "";

  // Avatar upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedUser = { ...fullCustomer, avatar: e.target.result };
      setFullCustomer(updatedUser);
      localStorage.setItem("profile_avatar", e.target.result);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  // Remove avatar
  const handleRemoveImage = () => {
    const updatedUser = { ...fullCustomer };
    delete updatedUser.avatar;
    setFullCustomer(updatedUser);
    localStorage.removeItem("profile_avatar");
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AppBar
      elevation={3}
      position="fixed"
      sx={{
        bgcolor: "#fff",
        color: "#102938",
        borderBottom: "1.5px solid #e5eaf2",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ px: { xs: 1, md: 0 }, height: 70 }}>
          <MedicalInformationIcon sx={{ color: doctorColor, fontSize: 36, mr: 1.5 }} />
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              background: "linear-gradient(90deg,#00c3ad,#234ba2 100%)",
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
              mr: { xs: 2, md: 7 },
            }}
          >
            HealthConnect
          </Typography>
          <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.label + '-' + link.section}
                onClick={() =>
                  typeof onSectionChange === "function" && onSectionChange(link.section)
                }
                sx={{
                  fontWeight: 700,
                  "&:hover": { color: doctorColor },
                }}
                color="inherit"
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          {/* Profile Avatar */}
          <Tooltip title="View/Edit Profile">
            <IconButton
              size="large"
              onClick={handleAvatarClick}
              sx={{ ml: 1 }}
              aria-label="User profile menu"
            >
              <Avatar
                src={displayAvatar}
                sx={{
                  bgcolor: doctorColor,
                  width: 40,
                  height: 40,
                  fontSize: 22,
                  border: "2.5px solid #fff",
                  boxShadow: "0 2px 10px #01988f33",
                }}
              >
                {!displayAvatar &&
                  stringAvatar(fullCustomer.name || fullCustomer.email || "User")}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Profile Popover */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                p: 2,
                minWidth: 320,
                borderRadius: 3,
                boxShadow: "0 6px 22px #00c3ad44",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Avatar src={displayAvatar} sx={{ width: 64, height: 64, bgcolor: doctorColor }}>
                {!displayAvatar &&
                  stringAvatar(fullCustomer.name || fullCustomer.email || "User")}
              </Avatar>
            </Box>
            <Stack direction="row" justifyContent="center" spacing={1} mb={2}>
              <label htmlFor="customer-upload-avatar">
                <input
                  accept="image/*"
                  id="customer-upload-avatar"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <Button variant="outlined" component="span" size="small">
                  Upload
                </Button>
              </label>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleRemoveImage}
                disabled={!displayAvatar}
              >
                Remove
              </Button>
            </Stack>
            <Box sx={{ textAlign: "left", mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <PersonIcon sx={{ fontSize: 18, color: doctorColor }} />
                <Typography fontWeight={700}>
                  {fullCustomer.name || "User"}
                </Typography>
                {fullCustomer.status && (
                  <Chip
                    sx={{ ml: 1 }}
                    size="small"
                    label={fullCustomer.status}
                    color="success"
                  />
                )}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <EmailIcon sx={{ fontSize: 17, color: providerColor }} />
                <Typography variant="body2">{fullCustomer.email || "-"}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <CakeIcon sx={{ fontSize: 17, color: providerColor }} />
                <Typography variant="body2">
                  {niceDate(fullCustomer.date_of_birth)}
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {fullCustomer.gender}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <BadgeIcon sx={{ fontSize: 17, color: providerColor }} />
                <Typography variant="body2">
                  Aadhaar: {fullCustomer.adhar_num || fullCustomer.aadhaar || "-"}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <HomeIcon sx={{ fontSize: 17, color: providerColor }} />
                <Typography variant="body2" sx={{ maxWidth: '60%' }} noWrap>
                  {fullCustomer.address || "N/A"}
                </Typography>
                {fullCustomer.zipcode && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {fullCustomer.zipcode}
                  </Typography>
                )}
              </Stack>
              {(fullCustomer.lat || fullCustomer.lon) && (
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <LocationOnIcon sx={{ fontSize: 17, color: "#297dbc" }} />
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {fullCustomer.lat && fullCustomer.lon
                      ? `${fullCustomer.lat}, ${fullCustomer.lon}`
                      : ""}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <FamilyRestroomIcon sx={{ fontSize: 17, color: "#ff8a65" }} />
                <Typography variant="body2">
                  Nominee: {fullCustomer.Nominee || fullCustomer.nominee || "-"}
                </Typography>
                {fullCustomer.nominee_adhar_numb && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    &nbsp;Aadhaar: {fullCustomer.nominee_adhar_numb}
                  </Typography>
                )}
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" alignItems="center" spacing={1} mb={1} flexWrap="wrap">
                <GppGoodIcon sx={{ fontSize: 17, color: "#297dbc" }} />
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Insurance plans:
                </Typography>
                {Array.isArray(fullCustomer.insurance_Plans) &&
                fullCustomer.insurance_Plans.length > 0 ? (
                  fullCustomer.insurance_Plans.map((plan) => (
                    <Chip
                      key={plan}
                      size="small"
                      color="info"
                      label={plan}
                      sx={{ bgcolor: "#edf6fa", fontWeight: 600, mr: 0.5, mb: 0.5 }}
                    />
                  ))
                ) : (
                  <Chip size="small" label="None" />
                )}
              </Stack>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Button
              startIcon={<LogoutIcon />}
              color="error"
              fullWidth
              size="small"
              variant="outlined"
              onClick={handleLogout}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Logout
            </Button>
          </Popover>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
