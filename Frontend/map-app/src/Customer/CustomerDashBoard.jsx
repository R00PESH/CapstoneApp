// // src/Customer/CustomerDashBoard.jsx
// import React, { useState, useEffect } from "react";
// import {
//   Box, Container, Grid, Paper, Typography, Stack, Chip, Avatar, Button,
//   TextField, MenuItem, Divider, Dialog, DialogTitle, DialogContent, IconButton, CircularProgress
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import StethoscopeIcon from "@mui/icons-material/MedicalServices";
// import StarIcon from "@mui/icons-material/Star";
// import ShieldIcon from "@mui/icons-material/Shield";
// import CustomerHeader from "./CustomerHeader";
// import CustomerFooter from "./CustomerFooter";
// import MapSearch from "../components/MapSearch";
// import { fetchAllProviders, fetchProviderById, filterProviders, fetchProvidersByHospitalName } from "../api/providersApi";
// import { fetchDoctorById, filterDoctors } from "../api/doctor";
// import { fetchAllInsurancePlans } from "../api/insuranceTeam";

// const doctorColor = "#00c3ad";
// const providerColor = "#294fab";
// const cardShadow = "0 5px 20px #d3f0ef3a";
// const PREVIEW_COUNT = 4;

// function getCustomerLocation(customer) {
//   if (!customer) return null;
//   const { lat, lon, locationLat, locationLon, latitude, longitude } = customer;
//   if (locationLat && locationLon) return { lat: Number(locationLat), lon: Number(locationLon) };
//   if (lat && lon) return { lat: Number(lat), lon: Number(lon) };
//   if (latitude && longitude) return { lat: Number(latitude), lon: Number(longitude) };
//   return null;
// }

// function InsuranceIconAvatar() {
//   return (
//     <Avatar sx={{
//       width: 56, height: 56, bgcolor: "#fff", color: providerColor, boxShadow: "0px 3px 12px #e3eaff99", mb: 2,
//     }}>
//       <ShieldIcon sx={{ fontSize: 34, color: doctorColor }} />
//     </Avatar>
//   );
// }

// function DocProvAvatar({ type }) {
//   return (
//     <Avatar sx={{
//       width: 62, height: 62, bgcolor: type === "doctor" ? doctorColor : providerColor, color: "#fff", mb: 1.7,
//     }}>
//       {type === "doctor" ? <StethoscopeIcon sx={{ fontSize: 30 }} /> : <LocalHospitalIcon sx={{ fontSize: 30 }} />}
//     </Avatar>
//   );
// }

// export default function CustomerDashboard({ onLogout }) {
//   const [customer, setCustomer] = useState(() => {
//     try { return JSON.parse(localStorage.getItem("user")) || null; }
//     catch { return null; }
//   });
//   const [profileOpen, setProfileOpen] = useState(false);

//   // Customer's registered insurance plans
//   let customerPlans = [];
//   if (customer) {
//     if (Array.isArray(customer.insurancePlans)) customerPlans = customer.insurancePlans;
//     else if (Array.isArray(customer.insurance_Plans)) customerPlans = customer.insurance_Plans;
//   }

//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [customerInsuranceCards, setCustomerInsuranceCards] = useState([]);
//   const [cardProviders, setCardProviders] = useState([]);
//   const [cardDoctors, setCardDoctors] = useState([]);
//   const [cardSpecialities, setCardSpecialities] = useState([]);
//   const [cardFilters, setCardFilters] = useState({
//     search: "",
//     type: "all", speciality: "", minRating: "",
//     insurancePlan: "", status: ""
//   });
//   const [showAllProviders, setShowAllProviders] = useState(false);
//   const [showAllDoctors, setShowAllDoctors] = useState(false);

//   // --- Provider popup state ---
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [providerDoctors, setProviderDoctors] = useState([]);
//   const [providerDialogOpen, setProviderDialogOpen] = useState(false);
//   const [isProviderDetailsLoading, setIsProviderDetailsLoading] = useState(false);

//   // --- Doctor popup state ---
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [doctorDialogOpen, setDoctorDialogOpen] = useState(false);
//   const [isDoctorDetailsLoading, setIsDoctorDetailsLoading] = useState(false);

//   // Insurance card effect
//   useEffect(() => {
//     fetchAllInsurancePlans().then(setInsurancePlans);
//     let plans = [];
//     if (customer) {
//       if (Array.isArray(customer.insurancePlans)) {
//         plans = customer.insurancePlans;
//       } else if (Array.isArray(customer.insurance_Plans)) {
//         plans = customer.insurance_Plans;
//       }
//     }
//     setCustomerInsuranceCards(plans.length > 0 ? plans : ["Health Basic"]);
//   }, [customer]);

//   // Main filtered doctor/provider grid data
//   useEffect(() => {
//     // --- ENFORCE: No plans = no results (when filter is empty/"Any") ---
//     if (
//       (cardFilters.insurancePlan === "" || !cardFilters.insurancePlan) &&
//       customerPlans.length === 0
//     ) {
//       setCardDoctors([]);
//       setCardProviders([]);
//       return; // block API call
//     }
//     // If specific plan is chosen: filter by it. If "Any", filter by all registered plans.
//     let insurancePlansFilter;
//     if (cardFilters.insurancePlan) {
//       insurancePlansFilter = [cardFilters.insurancePlan];
//     } else if (customerPlans.length > 0) {
//       insurancePlansFilter = customerPlans;
//     }
//     let docPromise = filterDoctors({
//       name: cardFilters.search || undefined,
//       specialization: cardFilters.speciality || undefined,
//       rating: cardFilters.minRating || undefined,
//       availabilityStatus: cardFilters.status || undefined,
//       insurancePlans: insurancePlansFilter,
//     });
//     let provPromise = filterProviders({
//       name: cardFilters.search || undefined,
//       Hospital_name: cardFilters.search || undefined,
//       speciality: cardFilters.speciality || undefined,
//       minRating: cardFilters.minRating || undefined,
//       availabilityStatus: cardFilters.status || undefined,
//       insurancePlans: insurancePlansFilter,
//     });
//     if (cardFilters.type === "doctor") provPromise = Promise.resolve([]);
//     if (cardFilters.type === "provider") docPromise = Promise.resolve([]);
//     docPromise.then(setCardDoctors);
//     provPromise.then(setCardProviders);
//   }, [cardFilters, customerPlans]);

//   useEffect(() => {
//     fetchAllProviders().then((providers) => {
//       const allSpecs = providers.flatMap((p) =>
//         Array.isArray(p.speciality) ? p.speciality
//           : typeof p.speciality === "string" ? [p.speciality]
//             : typeof p.specialization === "string" ? [p.specialization]
//               : Array.isArray(p.specialization) ? p.specialization
//                 : []
//       ).map(s => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
//       setCardSpecialities(Array.from(new Set(allSpecs)));
//     });
//   }, []);

//   const defaultCustomerLoc = getCustomerLocation(customer);

//   // Provider card click logic (fetch details, then docs)
//   const handleProviderCardClick = async (prov) => {
//     setIsProviderDetailsLoading(true);
//     setProviderDialogOpen(true);
//     setProviderDoctors([]);
//     // Fetch provider details by ID
//     let provider = await fetchProviderById(prov.id || prov._id || prov.hosId);

//     // If not found, fallback to hospital name lookup (sometimes provider API may not be populated)
//     if (!provider && prov.Hospital_name) {
//       const byNameArr = await fetchProvidersByHospitalName(prov.Hospital_name);
//       provider = Array.isArray(byNameArr) ? byNameArr[0] : null;
//     }
//     setSelectedProvider(provider);

//     // Fetch all doctors for this provider
//     let docs = [];
//     if (provider && Array.isArray(provider.docId) && provider.docId.length > 0) {
//       docs = await Promise.all(provider.docId.map(id => fetchDoctorById(id)));
//     }
//     setProviderDoctors(docs.filter(Boolean));
//     setIsProviderDetailsLoading(false);
//   };

//   // Doctor card click logic
//   const handleDoctorCardClick = async (doc) => {
//     setIsDoctorDetailsLoading(true);
//     setDoctorDialogOpen(true);
//     // Fetch complete doctor info (for reviews etc)
//     const doctor = await fetchDoctorById(doc.id || doc._id || doc.doc_Id);
//     setSelectedDoctor(doctor);
//     setIsDoctorDetailsLoading(false);
//   };

//   // --- MODALS ---
//   // Provider Details Modal (shows full provider & doctors info)
//   const ProviderDetailsModal = (
//     <Dialog
//       open={providerDialogOpen}
//       onClose={() => setProviderDialogOpen(false)}
//       maxWidth="md"
//       fullWidth
//     >
//       <DialogTitle>
//         <Stack direction="row" spacing={2} alignItems="center">
//           <DocProvAvatar type="provider" />
//           <Typography fontWeight={700}>
//             {selectedProvider?.Hospital_name || selectedProvider?.name || selectedProvider?.hosId}
//           </Typography>
//           <Box flex={1} />
//           <IconButton onClick={() => setProviderDialogOpen(false)}><CloseIcon /></IconButton>
//         </Stack>
//       </DialogTitle>
//       <DialogContent>
//         {isProviderDetailsLoading ? (
//           <Stack alignItems="center" sx={{ my: 6 }}><CircularProgress /></Stack>
//         ) : selectedProvider ? (
//           <Box>
//             <Typography><b>Speciality:</b> {selectedProvider.speciality}</Typography>
//             <Typography><b>Rating:</b> {selectedProvider.rating}</Typography>
//             <Typography><b>Location:</b> {selectedProvider.location} {selectedProvider.zipcode}</Typography>
//             <Typography>
//               <b>Insurance:</b> {Array.isArray(selectedProvider.insurance_Plans) ? selectedProvider.insurance_Plans.join(', ') : ''}
//             </Typography>
//             <Typography><b>Status:</b> {selectedProvider.active_Status}</Typography>
//             <Divider sx={{ my: 2 }}>Doctors at this provider</Divider>
//             {providerDoctors.length === 0 && <Typography color="text.secondary">No listed doctors at this provider.</Typography>}
//             {providerDoctors.map(doc => (
//               <Paper key={doc._id || doc.doc_Id} sx={{ p: 2, my: 1, bgcolor: "#fafeff" }}>
//                 <Typography fontWeight={700}>{doc.name}</Typography>
//                 <Typography>Specialization: {doc.specialization}</Typography>
//                 <Typography>Rating: {doc.rating}</Typography>
//                 <Button size="small" sx={{ mt: 1, color: doctorColor }} onClick={() => handleDoctorCardClick(doc)}>
//                   View Full Doctor Info
//                 </Button>
//               </Paper>
//             ))}
//             <Divider sx={{ my: 2 }}>Provider Reviews</Divider>
//             {selectedProvider.reviews && selectedProvider.reviews.length > 0 ? (
//               selectedProvider.reviews.map((review, idx) => (
//                 <Paper key={idx} sx={{ my: 1, p: 2 }}>
//                   <Typography fontWeight={600}>{review.customer_name} ({review.customer_email})</Typography>
//                   <Typography>Rating: {review.rating}</Typography>
//                   <Typography>{review.review}</Typography>
//                   <Typography variant="caption" sx={{ opacity: .7 }}>
//                     {review.review_given_time && new Date(review.review_given_time).toLocaleString()}
//                   </Typography>
//                 </Paper>
//               ))
//             ) : (
//               <Typography color="text.secondary">No reviews for this provider yet.</Typography>
//             )}
//           </Box>
//         ) : (
//           <Typography color="text.secondary">Provider details not found.</Typography>
//         )}
//       </DialogContent>
//     </Dialog>
//   );

//   // Doctor Details Modal (shows full doctor info with reviews)
//   const DoctorDetailsModal = (
//     <Dialog
//       open={doctorDialogOpen}
//       onClose={() => setDoctorDialogOpen(false)}
//       maxWidth="sm"
//       fullWidth
//     >
//       <DialogTitle>
//         <Stack direction="row" alignItems="center" spacing={2}>
//           <DocProvAvatar type="doctor" />
//           <Typography fontWeight={700}>{selectedDoctor?.name || selectedDoctor?.doc_Id}</Typography>
//           <Box flex={1} />
//           <IconButton onClick={() => setDoctorDialogOpen(false)}><CloseIcon /></IconButton>
//         </Stack>
//       </DialogTitle>
//       <DialogContent>
//         {isDoctorDetailsLoading ? (
//           <Stack alignItems="center" sx={{ my: 6 }}><CircularProgress /></Stack>
//         ) : selectedDoctor ? (
//           <Box>
//             <Typography><b>Specialization:</b> {selectedDoctor.specialization}</Typography>
//             <Typography><b>Qualification:</b> {selectedDoctor.qualification}</Typography>
//             <Typography><b>Years of practice:</b> {selectedDoctor.years_of_practice}</Typography>
//             <Typography><b>License #:</b> {selectedDoctor.license_number}</Typography>
//             <Typography><b>Rating:</b> {selectedDoctor.rating}</Typography>
//             <Typography><b>Status:</b> {selectedDoctor.availability_status}</Typography>
//             <Divider sx={{ my: 2 }}>Doctor Reviews</Divider>
//             {selectedDoctor.reviews && selectedDoctor.reviews.length > 0 ? (
//               selectedDoctor.reviews.map((r, i) => (
//                 <Paper key={i} sx={{ my: .7, p: 2 }}>
//                   <Typography fontWeight={600}>{r.customer_name} ({r.customer_email})</Typography>
//                   <Typography>Rating: {r.rating}</Typography>
//                   <Typography>{r.comment ?? r.review}</Typography>
//                   <Typography variant="caption" sx={{ opacity: .7 }}>
//                     {r.date && new Date(r.date).toLocaleString()}
//                   </Typography>
//                 </Paper>
//               ))
//             ) : (
//               <Typography color="text.secondary">No reviews for this doctor yet.</Typography>
//             )}
//           </Box>
//         ) : (
//           <Typography color="text.secondary">Doctor details not found.</Typography>
//         )}
//       </DialogContent>
//     </Dialog>
//   );

//   return (
//     <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", width: "100vw" }}>
//       <CustomerHeader
//         onProfileClick={() => setProfileOpen(true)}
//         onLogout={onLogout}
//       />
//       <Box sx={{ pt: 10, pb: 4 }}>
//         <MapSearch defaultLocation={defaultCustomerLoc} />
//       </Box>
//       {/* Insurance Cards */}
//       <Container maxWidth="xl">
//         <Typography variant="h5" fontWeight={900} sx={{ pb: 2, pt: 3, color: doctorColor }}>
//           Your Insurance Plan{customerInsuranceCards.length > 1 ? "s" : ""}
//         </Typography>
//         <Grid container spacing={4} sx={{ mb: 1 }}>
//           {customerInsuranceCards.length === 0 && (
//             <Grid item xs={12}>
//               <Paper elevation={2} sx={{ p: 4, textAlign: "center", color: providerColor }}>
//                 <InsuranceIconAvatar />
//                 <Typography variant="h6" fontWeight={700}>No insurance plans found for your account.</Typography>
//               </Paper>
//             </Grid>
//           )}
//           {customerInsuranceCards.map((title, idx) => {
//             const plan = insurancePlans.find((p) =>
//               (p.title || "").toLowerCase() === (title || "").toLowerCase());
//             return (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={title || idx}>
//                 <Paper elevation={5} sx={{
//                   borderRadius: 5, p: 3, textAlign: "center",
//                   bgcolor: "#ebfbf9", boxShadow: "0 6px 16px #d4fffd68"
//                 }}>
//                   <InsuranceIconAvatar />
//                   <Typography variant="h6" fontWeight={900} sx={{ color: doctorColor, mb: .5 }}>
//                     {plan?.title || title}
//                   </Typography>
//                   <Typography sx={{ fontWeight: 600, color: providerColor }}>
//                     Coverage: ₹{Number(plan?.amount || 0).toLocaleString()}
//                   </Typography>
//                   <Typography fontSize={14.5} mt={1.3} color="#338" sx={{ opacity: .82 }}>
//                     {(plan?.description || plan?.desc) || "Comprehensive coverage for hospital stays, diagnostics, surgery and more."}
//                   </Typography>
//                   {plan?.features &&
//                     <Stack direction="column" spacing={.6} sx={{ mt: 2 }}>
//                       {plan.features.map((f, i) => (
//                         <Chip key={i} label={f} size="small" />
//                       ))}
//                     </Stack>
//                   }
//                 </Paper>
//               </Grid>
//             )
//           })}
//         </Grid>
//       </Container>
//       <Divider sx={{ mt: 2, mb: 3 }} />
//       {/* FILTERS */}
//       <Container maxWidth="xl" sx={{ mb: 1, mt: 1 }}>
//         <Paper elevation={2} sx={{
//           p: 2, borderRadius: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", bgcolor: "#fff"
//         }}>
//           <TextField
//             label="Search"
//             value={cardFilters.search}
//             onChange={e => setCardFilters(f => ({ ...f, search: e.target.value }))}
//             size="small"
//             sx={{ minWidth: 180 }}
//             placeholder="Doctor or provider name..."
//           />
//           <TextField select label="Type" value={cardFilters.type}
//             onChange={e => setCardFilters(f => ({ ...f, type: e.target.value }))}
//             size="small" sx={{ minWidth: 110 }}>
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="doctor">Doctor</MenuItem>
//             <MenuItem value="provider">Provider</MenuItem>
//           </TextField>
//           <TextField select label="Speciality" value={cardFilters.speciality}
//             onChange={e => setCardFilters(f => ({ ...f, speciality: e.target.value }))}
//             size="small" sx={{ minWidth: 140 }}>
//             <MenuItem value="">All</MenuItem>
//             {cardSpecialities.map(sp =>
//               <MenuItem key={sp} value={sp}>{sp}</MenuItem>
//             )}
//           </TextField>
//           <TextField select label="Min Rating" value={cardFilters.minRating}
//             onChange={e => setCardFilters(f => ({ ...f, minRating: e.target.value }))}
//             size="small" sx={{ minWidth: 110 }}>
//             <MenuItem value="">Any</MenuItem>
//             {[5, 4, 3].map(r =>
//               <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
//             )}
//           </TextField>
//           {/* *** Filtered by user's insurance plans only *** */}
//           <TextField
//             select
//             label="Insurance Plan"
//             value={cardFilters.insurancePlan}
//             onChange={e => setCardFilters(f => ({ ...f, insurancePlan: e.target.value }))}
//             size="small"
//             sx={{ minWidth: 140 }}
//           >
//             <MenuItem value="">Any</MenuItem>
//             {insurancePlans
//               .filter(plan => customerPlans.includes(plan.title))
//               .map(plan => (
//                 <MenuItem key={plan.title} value={plan.title}>
//                   {plan.title}
//                 </MenuItem>
//             ))}
//           </TextField>
//           <TextField select label="Status" value={cardFilters.status}
//             onChange={e => setCardFilters(f => ({ ...f, status: e.target.value }))}
//             size="small" sx={{ minWidth: 130 }}>
//             <MenuItem value="">Any</MenuItem>
//             <MenuItem value="Available">Available</MenuItem>
//             <MenuItem value="On Leave">On Leave</MenuItem>
//             <MenuItem value="Unavailable">Unavailable</MenuItem>
//           </TextField>
//         </Paper>
//       </Container>
//       {/* Providers and Doctors CARD GRID */}
//       <Container maxWidth="xl" sx={{ pb: 7 }}>
//         <Grid container spacing={4}>
//           {cardDoctors.length === 0 && cardProviders.length === 0 && (
//             <Grid item xs={12} sx={{ textAlign: "center" }}>
//               <Typography variant="h6" color="text.secondary" sx={{ py: 6 }}>
//                 No providers or doctors found. Try broadening your filter/search.
//               </Typography>
//             </Grid>
//           )}
//           {/* Doctor Cards */}
//           {(showAllDoctors ? cardDoctors : cardDoctors.slice(0, PREVIEW_COUNT)).map((doc, idx) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id || doc._id || doc.key || idx}>
//               <Paper elevation={4} sx={{
//                 borderRadius: 5, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
//                 bgcolor: "#fafcff", minHeight: 265, boxShadow: cardShadow,
//                 transition: ".17s", ":hover": { boxShadow: 16, transform: "translateY(-7px) scale(1.025)" },
//                 cursor: "pointer"
//               }}
//                 onClick={() => handleDoctorCardClick(doc)}
//               >
//                 <DocProvAvatar type="doctor" />
//                 <Typography variant="h6" fontWeight={700} gutterBottom>
//                   {doc.name}
//                 </Typography>
//                 <Typography variant="body2" color={doctorColor} fontWeight={700} mb={1}>
//                   {doc.specialty || doc.specialization || doc.speciality || ""}
//                 </Typography>
//                 <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//                   <StarIcon sx={{ color: "#ffb400", fontSize: "1.13rem", mb: "1px" }} />
//                   <Typography color="text.primary" fontWeight={700} fontSize="1rem">
//                     {Number(doc.rating || doc.avgRating || 0).toFixed(1)}
//                   </Typography>
//                 </Stack>
//                 <Stack direction="row" spacing={0.7} flexWrap="wrap" justifyContent="center" mb={1.5}>
//                   {doc.insurancePlans && doc.insurancePlans.length > 0 &&
//                     doc.insurancePlans.map(plan =>
//                       <Chip key={plan} label={plan} size="small" variant="outlined"
//                         sx={{ bgcolor: "#edf6fa", color: doctorColor, fontWeight: 600, mr: 0.5, mb: 0.5 }} />)}
//                   {doc.active_status !== undefined &&
//                     <Chip size="small" sx={{ bgcolor: (doc.active_status === true || doc.active_status === "Active") ? "#d1f9ef" : "#eaeaea", color: "#194", fontWeight: 700, mr: 0.6 }}
//                       label={doc.active_status === true || doc.active_status === "Active" ? "Active"
//                         : (doc.active_status === false || doc.active_status === "Inactive"
//                           ? "Inactive" : String(doc.active_status))}/>}
//                   {doc.availabilityStatus &&
//                     <Chip
//                       size="small"
//                       sx={{ ml: 0.5 }}
//                       color={doc.availabilityStatus === "Available"
//                         ? "success"
//                         : doc.availabilityStatus === "On Leave"
//                           ? "warning"
//                           : "default"}
//                       label={doc.availabilityStatus}
//                     />}
//                 </Stack>
//                 <Typography variant="body2" sx={{ color: "#385e60", opacity: .72, textAlign: "center", mb: 1.1 }}>
//                   {doc.location || doc.address || doc.zipcode || ""}
//                 </Typography>
//                 <Button variant="outlined"
//                   sx={{
//                     borderRadius: 10,
//                     borderColor: doctorColor,
//                     color: doctorColor, fontWeight: 700, fontSize: ".97rem", mt: 0.5
//                   }}
//                   onClick={e => { e.stopPropagation(); handleDoctorCardClick(doc); }}
//                 >
//                   View Details
//                 </Button>
//               </Paper>
//             </Grid>
//           ))}
//           {/* Provider Cards */}
//           {(showAllProviders ? cardProviders : cardProviders.slice(0, PREVIEW_COUNT)).map((prov, idx) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={prov.id || prov._id || prov.key || idx}>
//               <Paper elevation={4} sx={{
//                 borderRadius: 5, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
//                 bgcolor: "#f7fafd", minHeight: 265, boxShadow: cardShadow,
//                 transition: ".17s", ":hover": { boxShadow: 16, transform: "translateY(-7px) scale(1.025)" },
//                 cursor: "pointer"
//               }}
//                 onClick={() => handleProviderCardClick(prov)}
//               >
//                 <DocProvAvatar type="provider" />
//                 <Typography variant="h6" fontWeight={700} gutterBottom>
//                   {prov.hospitalName || prov.name}
//                 </Typography>
//                 <Typography variant="body2" color={providerColor} fontWeight={700} mb={1}>
//                   {prov.speciality || prov.specialization || prov.specialty || prov.location || ""}
//                 </Typography>
//                 <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//                   <StarIcon sx={{ color: "#f0932b", fontSize: "1.13rem", mb: "1px" }} />
//                   <Typography color="text.primary" fontWeight={700} fontSize="1rem">
//                     {Number(prov.rating || 0).toFixed(1)}
//                   </Typography>
//                 </Stack>
//                 <Stack direction="row" spacing={0.7} flexWrap="wrap" justifyContent="center" mb={1.5}>
//                   {prov.insurancePlans && prov.insurancePlans.length > 0 &&
//                     prov.insurancePlans.map(plan =>
//                       <Chip key={plan} label={plan} size="small" variant="outlined"
//                         sx={{ bgcolor: "#edf6fa", color: providerColor, fontWeight: 600, mr: 0.5, mb: 0.5 }} />)}
//                   {prov.active_status !== undefined &&
//                     <Chip size="small" sx={{ bgcolor: (prov.active_status === true || prov.active_status === "Active") ? "#d1f9ef" : "#eaeaea", color: "#194", fontWeight: 700, mr: 0.6 }}
//                       label={prov.active_status === true || prov.active_status === "Active" ? "Active"
//                         : (prov.active_status === false || prov.active_status === "Inactive"
//                           ? "Inactive" : String(prov.active_status))}/>}
//                   {prov.availabilityStatus &&
//                     <Chip
//                       size="small"
//                       sx={{ ml: 0.5 }}
//                       color={prov.availabilityStatus === "Available"
//                         ? "success"
//                         : prov.availabilityStatus === "On Leave"
//                           ? "warning"
//                           : "default"}
//                       label={prov.availabilityStatus}
//                     />}
//                 </Stack>
//                 <Typography variant="body2" sx={{ color: "#385e60", opacity: .72, textAlign: "center", mb: 1.1 }}>
//                   {prov.location || prov.address || prov.zipcode || ""}
//                 </Typography>
//                 <Button variant="outlined"
//                   sx={{
//                     borderRadius: 10,
//                     borderColor: providerColor,
//                     color: providerColor, fontWeight: 700, fontSize: ".97rem", mt: 0.5
//                   }}
//                   onClick={e => { e.stopPropagation(); handleProviderCardClick(prov); }}
//                 >
//                   View Details
//                 </Button>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//         {(cardDoctors.length > PREVIEW_COUNT && !showAllDoctors) && (
//           <Box textAlign="center" mt={3}>
//             <Button
//               variant="contained"
//               sx={{ bgcolor: doctorColor, color: "#fff", borderRadius: 3, px: 4, fontWeight: 700, mr: 2 }}
//               onClick={() => setShowAllDoctors(true)}
//             >
//               View All Doctors
//             </Button>
//           </Box>
//         )}
//         {(cardProviders.length > PREVIEW_COUNT && !showAllProviders) && (
//           <Box textAlign="center" mt={3}>
//             <Button
//               variant="contained"
//               sx={{ bgcolor: providerColor, color: "#fff", borderRadius: 3, px: 4, fontWeight: 700, ml: 2 }}
//               onClick={() => setShowAllProviders(true)}
//             >
//               View All Providers
//             </Button>
//           </Box>
//         )}
//       </Container>
//       <CustomerFooter />
//       {/* Modals */}
//       <CustomerProfileModal open={profileOpen} customer={customer} onClose={() => setProfileOpen(false)} />
//       {ProviderDetailsModal}
//       {DoctorDetailsModal}
//     </Box>
//   );
// }

// // --- Profile modal for the customer ---
// function CustomerProfileModal({ open, customer, onClose }) {
//   if (!customer) return null;
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
//       <DialogTitle>
//         <Stack direction="row" alignItems="center" spacing={2}>
//           <Avatar sx={{ width: 66, height: 66, bgcolor: "#00c3ad", color: "#fff" }}>
//             {customer.name ? customer.name[0] : <ShieldIcon />}
//           </Avatar>
//           <Box>
//             <Typography fontWeight={700} fontSize={23}>My Profile</Typography>
//             <Typography color="text.secondary">{customer.email}</Typography>
//           </Box>
//           <Box flex={1} />
//           <IconButton onClick={onClose}><CloseIcon /></IconButton>
//         </Stack>
//       </DialogTitle>
//       <DialogContent sx={{ px: 3, pb: 2, pt: 1.6 }}>
//         <Stack spacing={1.5}>
//           <Typography fontSize={19} fontWeight={700}>{customer.name}</Typography>
//           <Typography>✉️ {customer.email}</Typography>
//           <Typography>📞 {customer.phone}</Typography>
//           <Typography>
//             Aadhaar: {customer.aadhaar || customer.adhar_num || customer.adharNumber || customer.aadhaarNumber}
//           </Typography>
//           <Divider />
//           <Stack direction="row" spacing={1} alignItems="center">
//             <ShieldIcon sx={{ color: "#00c3ad", mr: .7 }}/>
//             <Typography fontWeight={600}>
//               Insurance: {(Array.isArray(customer.insurancePlans) && customer.insurancePlans.join(', ')) 
//                 || (Array.isArray(customer.insurance_Plans) && customer.insurance_Plans.join(', '))
//                 || customer.insurancePlanTitle || "-"}
//             </Typography>
//           </Stack>
//         </Stack>
//       </DialogContent>
//     </Dialog>
//   );
// }

// src/Customer/CustomerDashBoard.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Container, Grid, Paper, Typography, Stack, Chip, Avatar,
  Button, TextField, MenuItem, Divider, Dialog, DialogTitle, DialogContent,
  IconButton, CircularProgress, Rating
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StethoscopeIcon from "@mui/icons-material/MedicalServices";
import StarIcon from "@mui/icons-material/Star";
import ShieldIcon from "@mui/icons-material/Shield";
// import Snackbar from "@mui/material";
// import Alert from "@mui/material";
import CustomerHeader from "./CustomerHeader";
import CustomerFooter from "./CustomerFooter";
import MapSearch from "../components/MapSearch";
import { fetchAllProviders, fetchProviderById, addProviderReviewPublic } from "../api/providersApi";
import { fetchDoctorById, addDoctorReviewPublic } from "../api/doctor";
import { fetchAllInsurancePlans } from "../api/insuranceTeam";

const doctorColor = "#00c3ad";
const providerColor = "#294fab";
const cardShadow = "0 5px 20px #d3f0ef3a";
const PREVIEW_COUNT = 4;



function getCustomerLocation(customer) {
  if (!customer) return null;
  const { lat, lon, locationLat, locationLon, latitude, longitude } = customer;
  if (locationLat && locationLon) return { lat: Number(locationLat), lon: Number(locationLon) };
  if (lat && lon) return { lat: Number(lat), lon: Number(lon) };
  if (latitude && longitude) return { lat: Number(latitude), lon: Number(longitude) };
  return null;
}
function DocProvAvatar({ type }) {
  return (
    <Avatar sx={{
      width: 62, height: 62, bgcolor: type === "doctor" ? doctorColor : providerColor, color: "#fff", mb: 1.7,
    }}>
      {type === "doctor" ? <StethoscopeIcon sx={{ fontSize: 30 }} /> : <LocalHospitalIcon sx={{ fontSize: 30 }} />}
    </Avatar>
  );
}
function InsuranceIconAvatar() {
  return (
    <Avatar sx={{
      width: 56, height: 56, bgcolor: "#fff", color: providerColor,
      boxShadow: "0px 3px 12px #e3eaff99", mb: 2,
    }}>
      <ShieldIcon sx={{ fontSize: 34, color: doctorColor }} />
    </Avatar>
  );
}
function CustomerProfileModal({ open, customer, onClose }) {
  if (!customer) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: 66, height: 66, bgcolor: "#00c3ad", color: "#fff" }}>
            {customer.name ? customer.name[0] : <ShieldIcon />}
          </Avatar>
          <Box>
            <Typography fontWeight={700} fontSize={23}>My Profile</Typography>
            <Typography color="text.secondary">{customer.email}</Typography>
          </Box>
          <Box flex={1} />
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2, pt: 1.6 }}>
        <Stack spacing={1.5}>
          <Typography fontSize={19} fontWeight={700}>{customer.name}</Typography>
          <Typography>✉️ {customer.email}</Typography>
          <Typography>📞 {customer.phone}</Typography>
          <Typography>
            Aadhaar: {customer.aadhaar || customer.adhar_num || customer.adharNumber || customer.aadhaarNumber}
          </Typography>
          <Divider />
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon sx={{ color: "#00c3ad", mr: .7 }}/>
            <Typography fontWeight={600}>
              Insurance: {(Array.isArray(customer.insurancePlans) && customer.insurancePlans.join(', '))
                || (Array.isArray(customer.insurance_Plans) && customer.insurance_Plans.join(', '))
                || customer.insurancePlanTitle || "-"}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function CustomerDashboard({ onLogout }) {
  // const [snackbar, setSnackbar] = useState({
//   open: false,
//   message: "",
//   severity: "success", // "success" | "error"
// });
  const [customer] = useState(() => {
    try { const item = localStorage.getItem("user"); if (!item) return null; return JSON.parse(item); }
    catch { return null; }
  });
  const [profileOpen, setProfileOpen] = useState(false);

  let customerPlans = [];
  if (customer) {
    if (Array.isArray(customer.insurancePlans)) customerPlans = customer.insurancePlans;
    else if (Array.isArray(customer.insurance_Plans)) customerPlans = customer.insurance_Plans;
  }
  const [allProviders, setAllProviders] = useState([]);
  const [cardProviders, setCardProviders] = useState([]);
  const [providerFilters, setProviderFilters] = useState({
    minRating: "",
    speciality: "",
    status: "",
    zipcode: "",
    insurancePlan: "",
  });
  const [cardSpecialities, setCardSpecialities] = useState([]);
  const [showAllProviders, setShowAllProviders] = useState(false);

  const [insurancePlans, setInsurancePlans] = useState([]);
  const [customerInsuranceCards, setCustomerInsuranceCards] = useState([]);
  useEffect(() => {
    fetchAllInsurancePlans().then(setInsurancePlans);
    let plans = [];
    if (customer) {
      if (Array.isArray(customer.insurancePlans)) plans = customer.insurancePlans;
      else if (Array.isArray(customer.insurance_Plans)) plans = customer.insurance_Plans;
    }
    setCustomerInsuranceCards(plans.length > 0 ? plans : ["Health Basic"]);
  }, [customer]);

  useEffect(() => {
    fetchAllProviders().then(providers => {
      setAllProviders(providers);
      const allSpecs = [...new Set(
        providers.flatMap(p =>
          Array.isArray(p.speciality) ? p.speciality :
            p.speciality ? [p.speciality] :
            p.specialization ? [p.specialization] : []
        ).filter(Boolean)
      )];
      setCardSpecialities(allSpecs);
    });
  }, []);

  // Providers: filter for insurance and all other filters including customer insurance plans
  useEffect(() => {
    let filtered = allProviders.filter(prov => {
      const provPlans = prov.insurancePlans || prov.insurance_Plans || [];
      return provPlans.some(plan => customerPlans.includes(plan));
    });

    // Apply insurance plan filter (ONLY customer plans, dropbox)
    if (providerFilters.insurancePlan)
      filtered = filtered.filter(p =>
        (p.insurancePlans || p.insurance_Plans || []).includes(providerFilters.insurancePlan)
      );

    if (providerFilters.minRating)
      filtered = filtered.filter(p => Number(p.rating || 0) >= Number(providerFilters.minRating));
    if (providerFilters.speciality)
      filtered = filtered.filter(p => {
        const arr = Array.isArray(p.speciality) ? p.speciality : [p.speciality];
        return arr.some(s => s && s.toLowerCase().includes(providerFilters.speciality.toLowerCase()));
      });
    if (providerFilters.status)
      filtered = filtered.filter(p =>
        String(p.activeStatus || p.active_Status || "").toLowerCase() === providerFilters.status.toLowerCase()
      );
    if (providerFilters.zipcode)
      filtered = filtered.filter(p => String(p.zipcode || "").includes(providerFilters.zipcode));
    setCardProviders(filtered);
  }, [allProviders, customerPlans, providerFilters]);

  // --- Provider modal state ---
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerDialogOpen, setProviderDialogOpen] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);

  // --- Doctor modal state ---
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customer_name: "", customer_email: "", rating: 5, comment: ""
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Provider add review
  const [showAddProviderReview, setShowAddProviderReview] = useState(false);
  const [providerReviewForm, setProviderReviewForm] = useState({
    customerName: "", customerEmail: "", rating: 5, review: ""
  });
  const [providerReviewSubmitting, setProviderReviewSubmitting] = useState(false);

  const handleProviderCardClick = async (provider) => {
    setProviderLoading(true);
    setProviderDialogOpen(true);
    let p = await fetchProviderById(provider.id || provider._id || provider.hosId);
    setSelectedProvider(p);
    setProviderLoading(false);
    setShowAddProviderReview(false); // hide the add review form when switching providers
  };

  const handleDoctorView = async (docId) => {
    setSelectedDoctor(null);
    setDoctorDialogOpen(true);
    const d = await fetchDoctorById(docId);
    setSelectedDoctor(d);
    setShowAddReview(false);
    setReviewForm({ customer_name: "", customer_email: "", rating: 5, comment: "" });
  };

  async function submitProviderReview(providerId) {
    setProviderReviewSubmitting(true);
    try{
    await addProviderReviewPublic(providerId, {
      customerName: providerReviewForm.customer_name,
      customerEmail: providerReviewForm.customer_email,
      rating: Number(providerReviewForm.rating),
      review: providerReviewForm.review
    });
     setSnackbar({
      open: true,
      message: "Review added successfully!",
      severity: "success"    // <-- success
    });
  } catch (error) {
    setSnackbar({
      open: true,
      message: "Failed to add review. Please try again.",
      severity: "error"      // <-- error
    });
  }
    setProviderReviewForm({ customerName: "", customerEmail: "", rating: 5, review: "" });
    setShowAddProviderReview(false);
    // Reload provider for updated reviews:
    const updated = await fetchProviderById(providerId);
    setSelectedProvider(updated);
    setProviderReviewSubmitting(false);
  }

  async function submitReview(docId) {
    setReviewSubmitting(true);
    try{
    await addDoctorReviewPublic(docId, {
      customerName: reviewForm.customer_name,
      customerEmail: reviewForm.customer_email,
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment
    });
    setSnackbar({
      open: true,
      message: "Review added successfully!",
      severity: "success"    // <-- success
    });
  } catch (error) {
    setSnackbar({
      open: true,
      message: "Failed to add review. Please try again.",
      severity: "error"      // <-- error
    });
  }
    
    
    setReviewForm({ customer_name: "", customer_email: "", rating: 5, comment: "" });
    setShowAddReview(false);
    const d = await fetchDoctorById(docId);
    setSelectedDoctor(d);
    setReviewSubmitting(false);
  }

  const ProviderDetailsModal = (
    <Dialog open={providerDialogOpen} onClose={() => setProviderDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: providerColor, color: "#fff", width: 66, height: 66 }}>{selectedProvider?.hospitalName?.[0]}</Avatar>
          <Typography fontWeight={700}>{selectedProvider?.hospitalName || selectedProvider?.name || selectedProvider?.hosId}</Typography>
          <Box flex={1} />
          <IconButton onClick={() => setProviderDialogOpen(false)}><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {providerLoading ? (
          <Stack alignItems="center" sx={{ my: 6 }}><CircularProgress /></Stack>
        ) : selectedProvider ? (
          <Stack spacing={1.7}>
            <Typography><b>ID:</b> {selectedProvider.id}</Typography>
            <Typography><b>hosId:</b> {selectedProvider.hosId}</Typography>
            <Typography><b>Hospital Name:</b> {selectedProvider.hospitalName}</Typography>
            <Typography><b>Speciality:</b> {selectedProvider.speciality}</Typography>
            <Typography><b>Rating:</b> <Rating value={Number(selectedProvider.rating)} readOnly max={5}/> {selectedProvider.rating}</Typography>
            <Typography><b>Location:</b> {selectedProvider.location}</Typography>
            <Typography><b>Zipcode:</b> {selectedProvider.zipcode}</Typography>
            <Typography><b>Lat/Lon:</b> {selectedProvider.lat}, {selectedProvider.lon}</Typography>
            <Typography><b>Insurance Plans:</b> {(selectedProvider.insurancePlans||[]).join(", ")}</Typography>
            <Typography><b>Status:</b> {selectedProvider.activeStatus}</Typography>
            <Typography><b>geoLocation:</b> {selectedProvider.geoLocation ? JSON.stringify(selectedProvider.geoLocation) : ""}</Typography>
            <Divider sx={{ my: 2 }}/>
            <Typography variant="h6" fontWeight={700}>Doctors</Typography>
            {(selectedProvider.docId || []).map(docId => (
              <Stack direction="row" spacing={2} alignItems="center" key={docId}>
                <Typography>docId: <b>{docId}</b></Typography>
                <Button size="small" variant="outlined" sx={{ color: doctorColor, fontWeight: 600 }} onClick={() => handleDoctorView(docId)}>
                  View
                </Button>
              </Stack>
            ))}
            <Divider sx={{ my: 2 }}/>
            <Typography variant="h6" fontWeight={700}>Reviews</Typography>
            {Array.isArray(selectedProvider.reviews) && selectedProvider.reviews.length > 0 ?
              selectedProvider.reviews.map((r, i) => (
                <Paper key={i} sx={{ p: 1.5, my: 1 }}>
                  <Typography><b>{r.customerName}</b> ({r.customerEmail})</Typography>
                  <Rating value={Number(r.rating)} readOnly max={5} size="small"/>{r.rating}
                  <Typography>Review: {r.review}</Typography>
                  <Typography variant="caption" sx={{ opacity: .7 }}>
                    {r.review_given_time && new Date(r.review_given_time).toLocaleString()}
                  </Typography>
                </Paper>
              ))
            : <Typography color="text.secondary">No reviews.</Typography>
            }
            <Button variant="contained" sx={{ mt: 2, maxWidth:180 }} onClick={() => setShowAddProviderReview(true)}>Add Review</Button>
            {showAddProviderReview && (
              <Paper sx={{ p: 2, my: 2 }}>
                <Typography variant="h6" fontWeight={700}>Add Review</Typography>
                <Stack spacing={1}>
                  <TextField label="Your Name" required value={providerReviewForm.customer_name}
                    onChange={e => setProviderReviewForm(f => ({ ...f, customer_name: e.target.value }))} size="small" />
                  <TextField label="Your Email" required value={providerReviewForm.customer_email}
                    onChange={e => setProviderReviewForm(f => ({ ...f, customer_email: e.target.value }))} size="small" />
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography>Rating:</Typography>
                    <Rating value={Number(providerReviewForm.rating)} onChange={(e,v) => setProviderReviewForm(f => ({ ...f, rating: v }))} max={5} />
                  </Stack>
                  <TextField
                    label="Review"
                    multiline minRows={2} required
                    value={providerReviewForm.review}
                    onChange={e => setProviderReviewForm(f => ({ ...f, review: e.target.value }))}
                    size="small"
                  />
                  <Stack direction="row">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={providerReviewSubmitting}
                      onClick={() => submitProviderReview(selectedProvider.id)}
                    >
                      {providerReviewSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button size="small" sx={{ ml: 2 }} onClick={() => setShowAddProviderReview(false)}>Cancel</Button>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        ) : <Typography color="text.secondary">Provider not found.</Typography>}
      </DialogContent>
    </Dialog>
  );

  const DoctorDetailsModal = (
    <Dialog open={doctorDialogOpen} onClose={() => setDoctorDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DocProvAvatar type="doctor" />
          <Typography fontWeight={700}>
            {selectedDoctor?.name} ({selectedDoctor?.docId})
          </Typography>
          <Box flex={1} />
          <IconButton onClick={() => setDoctorDialogOpen(false)}><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {!selectedDoctor ? (
          <Stack alignItems="center" sx={{ my: 5 }}><CircularProgress /></Stack>
        ) : (
          <Stack spacing={1.4}>
            <Typography><b>ID:</b> {selectedDoctor.id}</Typography>
            <Typography><b>Doc ID:</b> {selectedDoctor.docId}</Typography>
            <Typography><b>Hos ID:</b> {selectedDoctor.hosId}</Typography>
            <Typography><b>Name:</b> {selectedDoctor.name}</Typography>
            <Typography><b>License Number:</b> {selectedDoctor.licenseNumber}</Typography>
            <Typography><b>Qualification:</b> {selectedDoctor.qualification}</Typography>
            <Typography><b>Specialization:</b> {selectedDoctor.specialization}</Typography>
            <Typography><b>Years of Experience:</b> {selectedDoctor.yearsOfExp}</Typography>
            <Typography><b>Status:</b> {selectedDoctor.availabilityStatus}</Typography>
            <Typography><b>Joining Date:</b> {selectedDoctor.joiningDate && new Date(selectedDoctor.joiningDate).toLocaleDateString()}</Typography>
            <Typography><b>Rating:</b> <Rating value={Number(selectedDoctor.rating)} readOnly max={5} precision={0.1}/> {selectedDoctor.rating}</Typography>
            <Divider sx={{ my: 2 }}>Reviews</Divider>
            {Array.isArray(selectedDoctor.reviews) && selectedDoctor.reviews.length > 0 ? (
              <Stack spacing={2}>
                {selectedDoctor.reviews.map((review, i) => (
                  <Paper key={review.reviewId ?? review.reviewid ?? i} elevation={2} sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography color="primary" fontWeight="bold">
                        #{review.reviewId ?? review.reviewid}
                      </Typography>
                      <Rating value={Number(review.rating)} readOnly max={5} size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
                        {review.date && new Date(review.date).toLocaleString()}
                      </Typography>
                    </Stack>
                    <Typography>
                      <b>{review.customerName ?? review.customername ?? "No Name"}</b>
                      {" — "}
                      <span style={{ color: "#555", fontSize: "0.97em" }}>
                        {review.customerEmail ?? review.customeremail}
                      </span>
                    </Typography>
                    <Typography sx={{ my: ".4em" }}>
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>No reviews for this doctor.</Typography>
            )}
            <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={() => setShowAddReview(true)}>
              Add Review
            </Button>
            {showAddReview && (
              <Paper sx={{ p: 2, my: 2 }}>
                <Typography variant="h6" fontWeight={700}>Add Review</Typography>
                <Stack spacing={1}>
                  <TextField label="Your Name" required value={reviewForm.customer_name}
                    onChange={e => setReviewForm(f => ({ ...f, customer_name: e.target.value }))} size="small" />
                  <TextField label="Your Email" required value={reviewForm.customer_email}
                    onChange={e => setReviewForm(f => ({ ...f, customer_email: e.target.value }))} size="small" />
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography>Rating:</Typography>
                    <Rating value={Number(reviewForm.rating)} onChange={(e,v) => setReviewForm(f => ({ ...f, rating: v }))} max={5} />
                  </Stack>
                  <TextField
                    label="Comment"
                    multiline minRows={2} required
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    size="small"
                  />
                  <Stack direction="row">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={reviewSubmitting}
                      onClick={() => submitReview(selectedDoctor.docId || selectedDoctor.id)}
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button size="small" sx={{ ml: 2 }} onClick={() => setShowAddReview(false)}>
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", width: "100vw" }}>
      <CustomerHeader onProfileClick={() => setProfileOpen(true)} onLogout={onLogout} />
      <Box sx={{ pt: 10, pb: 4 }}>
        <MapSearch defaultLocation={getCustomerLocation(customer)} />
      </Box>

      {/* ---- INSURANCE CARDS ---- */}
      <Container maxWidth="xl">
        <Typography variant="h5" fontWeight={900} sx={{ pb: 2, pt: 3, color: doctorColor }}>
          Your Insurance Plan{customerInsuranceCards.length > 1 ? "s" : ""}
        </Typography>
        <Grid container spacing={4} sx={{ mb: 1 }}>
          {customerInsuranceCards.length === 0 && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 4, textAlign: "center", color: providerColor }}>
                <InsuranceIconAvatar />
                <Typography variant="h6" fontWeight={700}>No insurance plans found for your account.</Typography>
              </Paper>
            </Grid>
          )}
          {customerInsuranceCards.map((title, idx) => {
            const plan = insurancePlans.find((p) =>
              (p.title || "").toLowerCase() === (title || "").toLowerCase());
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={title || idx}>
                <Paper elevation={5} sx={{
                  borderRadius: 5, p: 3, textAlign: "center",
                  bgcolor: "#ebfbf9", boxShadow: "0 6px 16px #d4fffd68"
                }}>
                  <InsuranceIconAvatar />
                  <Typography variant="h6" fontWeight={900} sx={{ color: doctorColor, mb: .5 }}>
                    {plan?.title || title}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: providerColor }}>
                    Coverage: ₹{Number(plan?.amount || 0).toLocaleString()}
                  </Typography>
                  <Typography fontSize={14.5} mt={1.3} color="#338" sx={{ opacity: .82 }}>
                    {(plan?.description || plan?.desc) || "Comprehensive coverage for hospital stays, diagnostics, surgery and more."}
                  </Typography>
                  {plan?.features &&
                    <Stack direction="column" spacing={.6} sx={{ mt: 2 }}>
                      {plan.features.map((f, i) => (
                        <Chip key={i} label={f} size="small" />
                      ))}
                    </Stack>
                  }
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Divider sx={{ mt: 2, mb: 3 }} />

      {/* ---------- PROVIDER FILTERS ---------- */}
      <Container maxWidth="xl" sx={{ mb: 1 }}>
        <Paper elevation={2} sx={{
          p: 2, borderRadius: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", bgcolor: "#fff"
        }}>
          <TextField
            select label="Min Rating" value={providerFilters.minRating}
            onChange={e => setProviderFilters(f => ({ ...f, minRating: e.target.value }))}
            size="small" sx={{ minWidth: 110 }}>
            <MenuItem value="">Any</MenuItem>
            {[5, 4, 3].map(r => (
              <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
            ))}
          </TextField>
          <TextField
            select label="Speciality" value={providerFilters.speciality}
            onChange={e => setProviderFilters(f => ({ ...f, speciality: e.target.value }))}
            size="small" sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            {cardSpecialities.map(sp =>
              <MenuItem key={sp} value={sp}>{sp}</MenuItem>
            )}
          </TextField>
          <TextField
            select label="Status" value={providerFilters.status}
            onChange={e => setProviderFilters(f => ({ ...f, status: e.target.value }))}
            size="small" sx={{ minWidth: 130 }}>
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="On Leave">On Leave</MenuItem>
            <MenuItem value="Unavailable">Unavailable</MenuItem>
          </TextField>
          <TextField
            label="Zipcode"
            value={providerFilters.zipcode}
            onChange={e => setProviderFilters(f => ({ ...f, zipcode: e.target.value }))}
            size="small"
            sx={{ minWidth: 100 }}
          />
          <TextField
            select
            label="Insurance Plan"
            value={providerFilters.insurancePlan}
            onChange={e => setProviderFilters(f => ({ ...f, insurancePlan: e.target.value }))}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Insurance Plans</MenuItem>
            {[...(customerPlans || [])].map(plan => (
              <MenuItem key={plan} value={plan}>{plan}</MenuItem>
            ))}
          </TextField>
        </Paper>
      </Container>

      {/* -------- PROVIDER CARDS GRID -------- */}
      <Container maxWidth="xl" sx={{ pb: 7 }}>
        <Grid container spacing={4}>
          {cardProviders.length === 0 && (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ py: 6 }}>
                No providers found matching your insurance and filters.
              </Typography>
            </Grid>
          )}
          {(showAllProviders ? cardProviders : cardProviders.slice(0, PREVIEW_COUNT)).map((prov, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={prov.id || prov._id || prov.hosId || idx}>
              <Paper elevation={4} sx={{
                borderRadius: 5, p: 3, display: "flex", flexDirection: "column", alignItems: "center",
                bgcolor: "#f7fafd", minHeight: 265, boxShadow: cardShadow,
                transition: ".17s", ":hover": { boxShadow: 16, transform: "translateY(-7px) scale(1.025)" },
                cursor: "pointer"
              }}
                onClick={() => handleProviderCardClick(prov)}
              >
                <DocProvAvatar type="provider" />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {prov.hospitalName}
                </Typography>
                <Typography variant="body2" color={providerColor} fontWeight={700} mb={1}>
                  {prov.speciality}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <StarIcon sx={{ color: "#f0932b", fontSize: "1.13rem", mb: "1px" }} />
                  <Typography color="text.primary" fontWeight={700} fontSize="1rem">
                    {Number(prov.rating || 0).toFixed(1)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.7} flexWrap="wrap" justifyContent="center" mb={1.5}>
                  {(prov.insurancePlans || []).map(plan =>
                    <Chip key={plan} label={plan} size="small" variant="outlined"
                      sx={{ bgcolor: "#edf6fa", color: providerColor, fontWeight: 600, mr: 0.5, mb: 0.5 }} />)}
                </Stack>
                <Typography variant="body2" sx={{ color: "#385e60", opacity: .72, textAlign: "center", mb: 1.1 }}>
                  {prov.location} {prov.zipcode}
                </Typography>
                <Button variant="outlined"
                  sx={{
                    borderRadius: 10,
                    borderColor: providerColor,
                    color: providerColor, fontWeight: 700, fontSize: ".97rem", mt: 0.5
                  }}
                  onClick={e => { e.stopPropagation(); handleProviderCardClick(prov); }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {ProviderDetailsModal}
        {DoctorDetailsModal}
      </Container>
      <CustomerFooter />
      <CustomerProfileModal open={profileOpen} customer={customer} onClose={() => setProfileOpen(false)} />
    </Box>
  );
}
