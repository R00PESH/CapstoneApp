// // src/components/Findercustomer.jsx
// import * as React from 'react';
// import PropTypes from 'prop-types';

// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import LogoutIcon from '@mui/icons-material/Logout';
// import Popover from '@mui/material/Popover';

// import Handshake from "@mui/icons-material/Handshake";

// // Theme imports
// import { ThemeProvider, createTheme } from '@mui/material/styles';

// // Replace these 3 imports with the correct from @mui/toolpad-next or your local path!
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { useDemoRouter } from '@toolpad/core/internal';

// import MapSearch from './MapSearch';
// import CustomerDashboard from '../Customer/CustomerDashBoard';

// // ----- THEME DEFINITION -----
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#00c3ad",
//       dark: "#234ba2",
//       contrastText: "#fff",
//     },
//     secondary: {
//       main: "#01988f",
//     },
//     background: {
//       default: "#ebfbf9",
//       paper: "#fff",
//     },
//     error: {
//       main: "#ff6347",
//     },
//     success: {
//       main: "#03c988",
//     },
//     warning: {
//       main: "#fdd835",
//     },
//     info: {
//       main: "#57aaff",
//     },
//   },
//   typography: {
//     fontFamily: "Roboto, Arial, sans-serif",
//     fontWeightBold: 700,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         containedPrimary: {
//           background: "linear-gradient(90deg,#00c3ad,#234ba2 100%)",
//           color: "#fff",
//         },
//       },
//     },
//   },
// });

// // --------- NAVIGATION ---------
// const NAVIGATION = [
//   {
//     kind: 'header',
//     title: 'Main items',
//   },
//   {
//     segment: 'dashboard',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'map',
//     title: 'Finder',
//     icon: <CreditCardOffIcon />,
//   },
//   // {
//   //   segment: 'reimbursement',
//   //   title: 'Reimbursement',
//   //   icon: <Paid />,
//   // },
//   {
//     kind: 'divider',
//   },
//   {
//     kind: 'header',
//     title: 'Analytics',
//   },
//   // ... (Could add more items)
// ];

// // --------- UTILITIES ---------
// function stringAvatar(name) {
//   if (!name) return '';
//   const names = name.split(' ');
//   if (names.length === 1) return names[0][0].toUpperCase();
//   return `${names[0][0]}${names[1][0]}`.toUpperCase();
// }

// // --------- DYNAMIC PAGE CONTENT ---------
// function DemoPageContent({ pathname }) {
//   switch (pathname) {
//     case '/dashboard':
//       return <CustomerDashboard />;
//     case '/map':
//       return <MapSearch />;
//     default:
//       return (
//         <Box sx={{ py: 9, textAlign: "center", color: "primary.main" }}>
//           <Typography variant="h3" fontWeight={700}>Welcome to HealthConnect, Customer!</Typography>
//           <Typography variant="subtitle1" sx={{ mt: 3, opacity: 0.85 }}>
//             Use the side navigation for Dashboard or Finder.
//           </Typography>
//         </Box>
//       );
//   }
// }
// DemoPageContent.propTypes = {
//   pathname: PropTypes.string.isRequired,
// };

// // --------- BRAND LOGO ---------
// const BrandLogo = () => (
//   <Handshake sx={{
//     color: "#FF6347",
//     fontSize: "24px"
//   }} />
// );

// // --------- MAIN COMPONENT ---------
// function DashboardLayoutBasic() {
//   const router = useDemoRouter('/dashboard');

//   // Get latest user info from localStorage
//   const [user, setUser] = React.useState(() => {
//     const u = localStorage.getItem('user');
//     const avatar = localStorage.getItem('profile_avatar');
//     let userObj = u
//       ? JSON.parse(u)
//       : { name: 'User', email: 'user@example.com', address: '', role: '', status: '' };
//     if (avatar && !userObj.avatar) {
//       userObj.avatar = avatar;
//     }
//     return userObj;
//   });

//   // Listen for storage changes in case another tab logs in/out
//   React.useEffect(() => {
//     const handleStorage = () => {
//       const u = localStorage.getItem('user');
//       const avatar = localStorage.getItem('profile_avatar');
//       let userObj = u
//         ? JSON.parse(u)
//         : { name: 'User', email: 'user@example.com', address: '', role: '', status: '' };
//       if (avatar && !userObj.avatar) {
//         userObj.avatar = avatar;
//       }
//       setUser(userObj);
//     };
//     window.addEventListener('storage', handleStorage);
//     return () => window.removeEventListener('storage', handleStorage);
//   }, []);

//   // Popover state for profile
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
//   const handlePopoverClose = () => setAnchorEl(null);
//   const open = Boolean(anchorEl);

//   // Upload profile picture
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const updatedUser = { ...user, avatar: e.target.result };
//       setUser(updatedUser);
//       localStorage.setItem('profile_avatar', e.target.result);
//       if (localStorage.getItem('user')) {
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   // Remove profile picture
//   const handleRemoveImage = () => {
//     const updatedUser = { ...user };
//     delete updatedUser.avatar;
//     setUser(updatedUser);
//     localStorage.removeItem('profile_avatar');
//     if (localStorage.getItem('user')) {
//       delete updatedUser.avatar;
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     // We keep 'profile_avatar' so the image can persist for demo
//     window.location.href = '/login';
//   };

//   // Always use avatar from localStorage if user.avatar is missing
//   const displayAvatar = user.avatar || localStorage.getItem('profile_avatar') || '';

//   return (
//     <ThemeProvider theme={theme}>
//       <AppProvider
//         navigation={NAVIGATION}
//         router={router}
//         branding={{
//           title: "Finder",
//           logo: <BrandLogo />,
//         }}
//       >
//         <Box
//           sx={{
//             minHeight: "100vh",
//             bgcolor: "background.default",
//             position: "relative",
//           }}
//         >
//           <DashboardLayout>
//             <DemoPageContent pathname={router.pathname} />
//           </DashboardLayout>

//           {/* Avatar with popover at bottom left */}
//           <Box
//             sx={{
//               position: 'fixed',
//               left: 0,
//               bottom: 0,
//               width: 80,
//               height: 80,
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               zIndex: 1301,
//             }}
//           >
//             <IconButton size="large" onClick={handleAvatarClick}>
//               <Avatar
//                 src={displayAvatar}
//                 sx={{
//                   bgcolor: "#00BCD4",
//                   width: 40, height: 40, fontSize: 22,
//                   border: "2.5px solid #fff",
//                   boxShadow: "0 2px 10px #01988f33"
//                 }}
//               >
//                 {!displayAvatar && stringAvatar(user.name)}
//               </Avatar>
//             </IconButton>
//             <Popover
//               open={open}
//               anchorEl={anchorEl}
//               onClose={handlePopoverClose}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               transformOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               PaperProps={{
//                 sx: {
//                   p: 2,
//                   minWidth: 260,
//                   borderRadius: 3,
//                   boxShadow: "0 6px 22px #00c3ad44"
//                 }
//               }}
//             >
//               {/* Profile Picture */}
//               <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
//                 <Avatar src={displayAvatar} sx={{ width: 64, height: 64, bgcolor: "#00BCD4" }}>
//                   {!displayAvatar && stringAvatar(user.name)}
//                 </Avatar>
//               </Box>
//               {/* Upload and Remove Buttons */}
//               <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
//                 <label htmlFor="upload-avatar">
//                   <input
//                     accept="image/*"
//                     id="upload-avatar"
//                     type="file"
//                     style={{ display: 'none' }}
//                     onChange={handleImageChange}
//                   />
//                   <Button variant="outlined" component="span" size="small">
//                     Upload
//                   </Button>
//                 </label>
//                 <Button
//                   variant="outlined"
//                   size="small"
//                   color="secondary"
//                   onClick={handleRemoveImage}
//                   disabled={!displayAvatar}
//                 >Remove</Button>
//               </Box>
//               {/* User Details */}
//               <Box sx={{ textAlign: 'center', mb: 1 }}>
//                 <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
//                 <Typography variant="caption" color="text.secondary">{user.email}</Typography>
//                 <Typography variant="body2">Address: {user.address || 'N/A'}</Typography>
//                 <Typography variant="body2">Role: {user.role || 'N/A'}</Typography>
//               </Box>
//               <Divider sx={{ my: 1 }} />
//               <Button
//                 startIcon={<LogoutIcon />}
//                 color="error"
//                 fullWidth
//                 onClick={handleLogout}
//                 size="small"
//                 variant="outlined"
//                 sx={{ fontWeight: 600, borderRadius: 2 }}
//               >
//                 Logout
//               </Button>
//             </Popover>
//           </Box>
//         </Box>
//       </AppProvider>
//     </ThemeProvider>
//   );
// }

// export default DashboardLayoutBasic;
