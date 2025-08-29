
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box, Paper, TextField, InputAdornment, MenuItem, Button,
//   Stack, Chip, Avatar, Rating, CircularProgress, Autocomplete, Typography, IconButton
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import StethoscopeIcon from "@mui/icons-material/MedicalServices";
// import {
//   GoogleMap, Marker, InfoWindow, DirectionsService, DirectionsRenderer, useJsApiLoader
// } from "@react-google-maps/api";

// import { filterDoctors } from "../api/doctor";
// import { filterProviders, fetchAllProviders } from "../api/providersApi";
// import { fetchAllInsurancePlans } from "../api/insuranceTeam";

// const THEME = { teal: "#00c3ad", indigo: "#234ba2", danger: "#e53935", provider: "#294fab" };
// const DEFAULT_LOC = { lat: 12.9716, lng: 77.5946 }; // Bangalore

// function speakDirections(text) {
//   if (window.speechSynthesis && text) {
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
//   }
// }

// export default function MapSearch() {
//   const [userLoc, setUserLoc] = useState(DEFAULT_LOC);
//   const [searchInput, setSearchInput] = useState("");
//   const [filters, setFilters] = useState({
//     speciality: "", insurance: "", minRating: "", distanceKm: "", zipcode: ""
//   });
//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [specialities, setSpecialities] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Directions / navigation features
//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const [directionsReq, setDirectionsReq] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [directionsStep, setDirectionsStep] = useState(0);
//   const [muted, setMuted] = useState(false);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });
//   const mapRef = useRef();

//   // User location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         pos => setUserLoc({ lat: Number(pos.coords.latitude), lng: Number(pos.coords.longitude) }),
//         () => setUserLoc(DEFAULT_LOC)
//       );
//     }
//   }, []);

//   // Insurance Plans and Specialities (deduped live from providers)
//   useEffect(() => { fetchAllInsurancePlans().then(setInsurancePlans); }, []);
//   useEffect(() => {
//     async function loadSpecs() {
//       const providers = await fetchAllProviders();
//       const allSpecs = providers.flatMap(p =>
//         Array.isArray(p.speciality) ? p.speciality
//         : typeof p.speciality === "string" ? [p.speciality]
//         : typeof p.specialization === "string" ? [p.specialization]
//         : Array.isArray(p.specialization) ? p.specialization
//         : []
//       ).map(s => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
//       setSpecialities(Array.from(new Set(allSpecs)));
//     }
//     loadSpecs();
//   }, []);

//   // Suggestions (just providers OR add doctors if you want, both filtered by input)
//   useEffect(() => {
//     if (!searchInput.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     const input = searchInput.trim().toLowerCase();

//     Promise.all([
//       fetchAllProviders(),
//       filterDoctors({ name: searchInput })
//     ]).then(([providers, docs]) => {
//       // Provider suggestions filtered by input
//       const provSugs = (providers || [])
//         .filter(p =>
//           (p.hospitalName && p.hospitalName.toLowerCase().includes(input)) ||
//           (p.name && p.name.toLowerCase().includes(input))
//         )
//         .map(p => ({
//           type: "provider",
//           label: p.hospitalName || p.name,
//           ...p,
//           lat: p.lat ? Number(p.lat) : undefined,
//           lng: p.lon ? Number(p.lon) : undefined,
//         }));
//       // Doctor suggestions filtered by input (if wanted)
//       const docSugs = (docs || [])
//         .filter(d => d.name && d.name.toLowerCase().includes(input))
//         .map(d => ({
//           type: "doctor",
//           label: d.name,
//           ...d,
//           lat: d.locationLat ? Number(d.locationLat) : undefined,
//           lng: d.locationLon ? Number(d.locationLon) : undefined,
//         }));

//       // Dedupe by label
//       const seen = new Set();
//       const united = [...provSugs, ...docSugs].filter(s => {
//         if (seen.has(s.label)) return false;
//         seen.add(s.label);
//         return true;
//       });

//       setSuggestions(united);
//     });
//   }, [searchInput]);

//   // Search/apply
//   const handleSearch = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setDirectionsReq(null); setDirectionsResponse(null); setSelectedMarker(null); setDirectionsStep(0);

//     let searchLat = userLoc.lat, searchLng = userLoc.lng;
//     const sel = suggestions.find(s => s.label === searchInput);

//     const [doctors, providers] = await Promise.all([
//       filterDoctors({
//         name: sel?.type === "doctor" ? sel.label : (searchInput || undefined),
//         specialization: filters.speciality || undefined,
//         rating: filters.minRating || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined
//       }),
//       filterProviders({
//         Hospital_name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         speciality: filters.speciality || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         minRating: filters.minRating || undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined,
//         zipcode: filters.zipcode || undefined,
//       })
//     ]);
//     const items = [
//       ...(doctors || []).filter(d => d.locationLat && d.locationLon)
//         .map(d => ({
//           key: `doc-${d.id || d.name}-${d.locationLat}`,
//           ...d, type: "doctor", lat: Number(d.locationLat), lng: Number(d.locationLon)
//         })),
//       ...(providers || []).filter(p => p.lat && p.lon)
//         .map(p => ({
//           key: `prov-${p.id || p.name}-${p.lat}`,
//           ...p, type: "provider", lat: Number(p.lat), lng: Number(p.lon)
//         }))
//     ];
//     setResults(items);
//     setLoading(false);
//   };

//   // When a suggestion is selected: show only that entity instantly (focus on map)
//   const handleSuggestionSelect = (option) => {
//     setSearchInput(option.label);
//     setDirectionsReq(null); setDirectionsResponse(null); setDirectionsStep(0);
//     if (option && option.lat && option.lng) {
//       setResults([{
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       }]);
//       setSelectedMarker({
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       });
//       if (mapRef.current && mapRef.current.panTo) mapRef.current.panTo({ lat: option.lat, lng: option.lng });
//     } else {
//       setResults([]);
//       setSelectedMarker(null);
//     }
//   };

//   // Routing/navigation
//   const handleShowRoute = (item) => {
//     setDirectionsReq({
//       origin: userLoc,
//       destination: { lat: item.lat, lng: item.lng },
//       travelMode: "DRIVING"
//     });
//     setDirectionsResponse(null);
//     setDirectionsStep(0);
//   };

//   useEffect(() => {
//     if (
//       directionsResponse &&
//       !muted &&
//       directionsResponse.routes[0]?.legs[0]?.steps[directionsStep]
//     ) {
//       const step = directionsResponse.routes[0].legs[0].steps[directionsStep];
//       speakDirections(step.instructions.replace(/(<([^>]+)>)/gi, ""));
//     }
//   }, [directionsStep, directionsResponse, muted]);

//   function InfoContent({ item }) {
//     return (
//       <Box sx={{ minWidth: 220 }}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={.8}>
//           <Avatar sx={{ bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider }}>
//             {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
//           </Avatar>
//           <Typography fontWeight={700}>{item.label || item.name || item.hospitalName}</Typography>
//         </Stack>
//         <Typography fontSize={15} color="text.secondary" mb={.4}>
//           {item.speciality || item.specialization || ""}
//         </Typography>
//         <Typography color="text.secondary" fontSize={13.5}>
//           {item.location || item.address || item.zipcode}
//         </Typography>
//         {item.active_status !== undefined &&
//           <Chip
//             size="small"
//             sx={{ mb: 1, mr: 1 }}
//             color={item.active_status === true || item.active_status === "Active" ? "success" : "default"}
//             label={
//               item.active_status === true || item.active_status === "Active"
//                 ? "Active"
//                 : (item.active_status === false || item.active_status === "Inactive"
//                   ? "Inactive"
//                   : String(item.active_status))
//             }
//           />
//         }
//         <Rating value={Number(item.rating || item.avgRating || 0)} readOnly size="small" />
//         {item.insurancePlans && item.insurancePlans.length > 0 &&
//           <Stack direction="row" spacing={1} my={1} flexWrap="wrap">
//             {item.insurancePlans.map(plan =>
//               <Chip key={plan} label={plan} color="info" size="small" />
//             )}
//           </Stack>}
//         {item.availabilityStatus &&
//           <Chip label={item.availabilityStatus} color={item.availabilityStatus === "Available" ? "success" : "default"} size="small" sx={{ mr: 1, mb: 1 }} />}
//         <Button variant="contained" color="primary" size="small"
//           sx={{ mt: 1, fontWeight: 700, bgcolor: THEME.teal }}
//           onClick={() => handleShowRoute(item)}
//         >
//           Show Route
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 2 }}>
//       {/* SEARCH BAR WITH SEARCH BUTTON */}
//       <Box sx={{ maxWidth: 820, mx: "auto", pt: 4 }}>
//         <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
//           <Autocomplete
//             options={suggestions}
//             inputValue={searchInput}
//             onInputChange={(_, val, reason) => { if (reason !== "reset") setSearchInput(val); }}
//             freeSolo
//             getOptionLabel={opt => typeof opt === "string" ? opt : opt.label || ""}
//             isOptionEqualToValue={(opt, v) => opt.label === (v?.label || v)}
//             noOptionsText="No results"
//             loading={loading}
//             filterOptions={x => x}
//             onChange={(_, option) => {
//               if (typeof option === "string") setSearchInput(option);
//               else if (option?.label) handleSuggestionSelect(option);
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search hospital, provider, or doctor"
//                 InputProps={{
//                   ...params.InputProps,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <IconButton type="submit" color="primary" sx={{ mr: 1, mt: 'auto', mb: 'auto' }}>
//                       <SearchIcon />
//                     </IconButton>
//                   ),
//                 }}
//                 placeholder="eg. Apollo, Alex, Global Hospital"
//                 fullWidth
//               />
//             )}
//             sx={{ flex: 1, mb: 2, bgcolor: "#fff", borderRadius: 2 }}
//           />
//         </form>
//       </Box>

//       {/* FILTERS (Apply Filters button unchanged, can submit search logic too) */}
//       <Box sx={{ maxWidth: 1200, mx: "auto", mt: 3 }}>
//         <Paper sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, borderRadius: 3, mb: 4, bgcolor: "#fff" }}>
//           <TextField
//             select label="Speciality" value={filters.speciality}
//             onChange={e => setFilters(f => ({ ...f, speciality: e.target.value }))}
//             size="small" sx={{ minWidth: 140, flex: 1 }}
//           >
//             <MenuItem value="">All</MenuItem>
//             {specialities.map(sp =>
//               <MenuItem key={sp} value={sp}>{sp}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Insurance Plan" value={filters.insurance}
//             onChange={e => setFilters(f => ({ ...f, insurance: e.target.value }))}
//             size="small" sx={{ minWidth: 130, flex: 1 }}
//           >
//             <MenuItem value="">Any</MenuItem>
//             {insurancePlans.map(plan =>
//               <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Min Rating" value={filters.minRating}
//             onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
//             size="small" sx={{ minWidth: 110, flex: 1 }}
//           >
//             {[5, 4, 3].map(r =>
//               <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             label="Distance (km)"
//             value={filters.distanceKm}
//             onChange={e => setFilters(f => ({ ...f, distanceKm: e.target.value }))}
//             type="number"
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <TextField
//             label="Zipcode"
//             value={filters.zipcode}
//             onChange={e => setFilters(f => ({ ...f, zipcode: e.target.value }))}
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <Button variant="contained" type="button" onClick={handleSearch}
//             sx={{ fontWeight: 700, borderRadius: 2, bgcolor: THEME.teal, color: "#fff" }}>
//             Apply Filters
//           </Button>
//         </Paper>
//       </Box>

//       {/* MAP */}
//       <div
//         id="map-container"
//         style={{
//           width: "100%",
//           maxWidth: 1200,
//           margin: "2rem auto",
//           height: 470,
//           borderRadius: 24,
//           overflow: "hidden",
//           background: "#eee"
//         }}
//       >
//         {!isLoaded ? (
//           <Box sx={{ py: 12, textAlign: "center" }}><CircularProgress size={50} /></Box>
//         ) : (
//           <GoogleMap
//             ref={mapRef}
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={userLoc}
//             zoom={13}
//             options={{
//               streetViewControl: true, zoomControl: true,
//               mapTypeControl: true, fullscreenControl: true,
//             }}
//             onLoad={map => { mapRef.current = map; }}
//           >
//             {/* User marker */}
//             <Marker position={userLoc} icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 8, fillColor: THEME.teal, fillOpacity: 0.9,
//               strokeWeight: 2, strokeColor: "#fff"
//             }} title="Your Location" />
//             {/* Results markers */}
//             {results.map(item =>
//               <Marker
//                 key={item.key}
//                 position={{ lat: item.lat, lng: item.lng }}
//                 icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
//                 onClick={() => {
//                   setSelectedMarker(item);
//                   setDirectionsReq(null);
//                   setDirectionsResponse(null);
//                   setDirectionsStep(0);
//                 }}
//               />
//             )}
//             {/* InfoWindow */}
//             {selectedMarker &&
//               <InfoWindow
//                 position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//                 onCloseClick={() => setSelectedMarker(null)}
//               >
//                 <InfoContent item={selectedMarker} />
//               </InfoWindow>
//             }
//             {/* Directions polyline: dotted */}
//             {directionsReq && (
//               <>
//                 <DirectionsService
//                   options={directionsReq}
//                   callback={res => {
//                     if (res && res.status === "OK") setDirectionsResponse(res);
//                   }}
//                 />
//                 {directionsResponse &&
//                   <DirectionsRenderer
//                     options={{
//                       directions: directionsResponse,
//                       suppressMarkers: false,
//                       polylineOptions: {
//                         strokeColor: THEME.teal,
//                         strokeWeight: 5,
//                         icons: [{
//                           icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
//                           offset: "0", repeat: "12px"
//                         }]
//                       }
//                     }}
//                   />
//                 }
//               </>
//             )}
//           </GoogleMap>
//         )}
//       </div>

//       {/* Navigation stepper w/ finish flag */}
//       {directionsResponse && directionsResponse.routes[0]?.legs[0]?.steps &&
//         <Box sx={{ maxWidth: 800, mx: "auto", my: 3 }}>
//           <Paper sx={{ p: 2, bgcolor: "#f9fdfd", border: `2px solid ${THEME.teal}` }}>
//             <Typography fontWeight={700} mb={1}>
//               Directions (Step {directionsStep + 1} of {directionsResponse.routes[0].legs[0].steps.length})
//             </Typography>
//             <Typography sx={{ mb: .6 }}>
//               <span style={{ color: THEME.indigo, fontWeight: 700 }}>{directionsStep + 1}.</span>{" "}
//               <span dangerouslySetInnerHTML={{ __html: directionsResponse.routes[0].legs[0].steps[directionsStep].instructions }} />
//               {" "}
//               <b>({directionsResponse.routes[0].legs[0].steps[directionsStep].distance.text})</b>
//             </Typography>
//             {directionsStep === directionsResponse.routes[0].legs[0].steps.length - 1 && (
//               <Stack direction="row" alignItems="center" spacing={1} mt={2}>
//                 <Typography fontWeight={700} color="success.main">Destination reached</Typography>
//                 <span style={{ fontSize: 28 }} role="img" aria-label="Finish">🏁</span>
//               </Stack>
//             )}
//             <Stack direction="row" spacing={2} mt={2}>
//               <Button
//                 onClick={() => setDirectionsStep(s => s > 0 ? s - 1 : 0)}
//                 disabled={directionsStep === 0}
//                 variant="outlined"
//                 color="primary"
//               >Back</Button>
//               <Button
//                 onClick={() => setDirectionsStep(s =>
//                   s < directionsResponse.routes[0].legs[0].steps.length - 1
//                     ? s + 1 : s
//                 )}
//                 disabled={directionsStep >= directionsResponse.routes[0].legs[0].steps.length - 1}
//                 variant="contained"
//                 sx={{ bgcolor: THEME.teal }}
//               >Next</Button>
//               <Button
//                 onClick={() => setMuted(v => !v)}
//                 variant="outlined"
//                 color={muted ? "success" : "error"}
//               >{muted ? "Unmute Voice" : "Mute Voice"}</Button>
//             </Stack>
//           </Paper>
//         </Box>
//       }
//     </Box>
//   );
// }

// // src/components/MapSearch.jsx
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box, Paper, TextField, InputAdornment, MenuItem, Button,
//   Stack, Chip, Avatar, Rating, CircularProgress, Autocomplete, Typography, IconButton
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import StethoscopeIcon from "@mui/icons-material/MedicalServices";
// import {
//   GoogleMap, Marker, InfoWindow, DirectionsService, DirectionsRenderer, useJsApiLoader
// } from "@react-google-maps/api";
// import { filterDoctors } from "../api/doctor";
// import { filterProviders, fetchAllProviders } from "../api/providersApi";
// import { fetchAllInsurancePlans } from "../api/insuranceTeam";

// const THEME = { teal: "#00c3ad", indigo: "#234ba2", danger: "#e53935", provider: "#294fab" };
// const FALLBACK_LOC = { lat: 12.9716, lng: 77.5946 }; // Bangalore

// // Helper: get user location from latest localStorage "user"
// function getSavedUserLocation() {
//   try {
//     const customerRaw = localStorage.getItem("user");
//     // For debug: what does localStorage actually have?
//     console.log("[DEBUG] localStorage user:", customerRaw);
//     if (!customerRaw) return null;
//     const customer = JSON.parse(customerRaw);
//     console.log("[DEBUG] parsed user:", customer);
//     if (customer.lat && customer.lon) {
//       return { lat: Number(customer.lat), lng: Number(customer.lon) };
//     }
//     if (customer.locationLat && customer.locationLon) {
//       return { lat: Number(customer.locationLat), lng: Number(customer.locationLon) };
//     }
//     if (customer.latitude && customer.longitude) {
//       return { lat: Number(customer.latitude), lng: Number(customer.longitude) };
//     }
//     return null;
//   } catch (e) {
//     console.log("[DEBUG] Failed to parse user from localStorage", e);
//     return null;
//   }
// }

// function speakDirections(text) {
//   if (window.speechSynthesis && text) {
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
//   }
// }

// export default function MapSearch() {
//   // Always set userLoc from localStorage or fallback on mount.
//   const [userLoc, setUserLoc] = useState(FALLBACK_LOC);

//   // DEBUG: Log exactly what we use at mount
//   useEffect(() => {
//     const loc = getSavedUserLocation() || FALLBACK_LOC;
//     console.log("[DEBUG] Initial userLoc for map:", loc);
//     setUserLoc(loc);
//   }, []);

//   // OPTIONAL: auto-update userLoc if localStorage changes in another tab
//   // useEffect(() => {
//   //   const handleStorage = () => {
//   //     const loc = getSavedUserLocation() || FALLBACK_LOC;
//   //     setUserLoc(loc);
//   //   };
//   //   window.addEventListener('storage', handleStorage);
//   //   return () => window.removeEventListener('storage', handleStorage);
//   // }, []);

//   // Comment out browser geolocation override for debugging user default!
//   // useEffect(() => {
//   //   if (navigator.geolocation) {
//   //     navigator.geolocation.getCurrentPosition(
//   //       pos => setUserLoc({ lat: Number(pos.coords.latitude), lng: Number(pos.coords.longitude) }),
//   //       () => setUserLoc(prev => prev)
//   //     );
//   //   }
//   // }, []);

//   const [searchInput, setSearchInput] = useState("");
//   const [filters, setFilters] = useState({
//     speciality: "", insurance: "", minRating: "", distanceKm: "", zipcode: ""
//   });
//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [specialities, setSpecialities] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Directions / navigation features
//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const [directionsReq, setDirectionsReq] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [directionsStep, setDirectionsStep] = useState(0);
//   const [muted, setMuted] = useState(false);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });
//   const mapRef = useRef();

//   useEffect(() => { fetchAllInsurancePlans().then(setInsurancePlans); }, []);
//   useEffect(() => {
//     async function loadSpecs() {
//       const providers = await fetchAllProviders();
//       const allSpecs = providers.flatMap(p =>
//         Array.isArray(p.speciality) ? p.speciality
//           : typeof p.speciality === "string" ? [p.speciality]
//             : typeof p.specialization === "string" ? [p.specialization]
//               : Array.isArray(p.specialization) ? p.specialization
//                 : []
//       ).map(s => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
//       setSpecialities(Array.from(new Set(allSpecs)));
//     }
//     loadSpecs();
//   }, []);

//   useEffect(() => {
//     if (!searchInput.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     const input = searchInput.trim().toLowerCase();

//     Promise.all([
//       fetchAllProviders(),
//       filterDoctors({ name: searchInput })
//     ]).then(([providers, docs]) => {
//       const provSugs = (providers || [])
//         .filter(p =>
//           (p.hospitalName && p.hospitalName.toLowerCase().includes(input)) ||
//           (p.name && p.name.toLowerCase().includes(input))
//         )
//         .map(p => ({
//           type: "provider",
//           label: p.hospitalName || p.name,
//           ...p,
//           lat: p.lat ? Number(p.lat) : undefined,
//           lng: p.lon ? Number(p.lon) : undefined,
//         }));
//       const docSugs = (docs || [])
//         .filter(d => d.name && d.name.toLowerCase().includes(input))
//         .map(d => ({
//           type: "doctor",
//           label: d.name,
//           ...d,
//           lat: d.locationLat ? Number(d.locationLat) : undefined,
//           lng: d.locationLon ? Number(d.locationLon) : undefined,
//         }));

//       const seen = new Set();
//       const united = [...provSugs, ...docSugs].filter(s => {
//         if (seen.has(s.label)) return false;
//         seen.add(s.label);
//         return true;
//       });

//       setSuggestions(united);
//     });
//   }, [searchInput]);

//   const handleSearch = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setDirectionsReq(null); setDirectionsResponse(null); setSelectedMarker(null); setDirectionsStep(0);

//     let searchLat = userLoc.lat, searchLng = userLoc.lng;
//     const sel = suggestions.find(s => s.label === searchInput);

//     const [doctors, providers] = await Promise.all([
//       filterDoctors({
//         name: sel?.type === "doctor" ? sel.label : (searchInput || undefined),
//         specialization: filters.speciality || undefined,
//         rating: filters.minRating || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined
//       }),
//       filterProviders({
//         Hospital_name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         speciality: filters.speciality || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         minRating: filters.minRating || undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined,
//         zipcode: filters.zipcode || undefined,
//       })
//     ]);
//     const items = [
//       ...(doctors || []).filter(d => d.locationLat && d.locationLon)
//         .map(d => ({
//           key: `doc-${d.id || d.name}-${d.locationLat}`,
//           ...d, type: "doctor", lat: Number(d.locationLat), lng: Number(d.locationLon)
//         })),
//       ...(providers || []).filter(p => p.lat && p.lon)
//         .map(p => ({
//           key: `prov-${p.id || p.name}-${p.lat}`,
//           ...p, type: "provider", lat: Number(p.lat), lng: Number(p.lon)
//         }))
//     ];
//     setResults(items);
//     setLoading(false);
//   };

//   const handleSuggestionSelect = (option) => {
//     setSearchInput(option.label);
//     setDirectionsReq(null); setDirectionsResponse(null); setDirectionsStep(0);
//     if (option && option.lat && option.lng) {
//       setResults([{
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       }]);
//       setSelectedMarker({
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       });
//       if (mapRef.current && mapRef.current.panTo) mapRef.current.panTo({ lat: option.lat, lng: option.lng });
//     } else {
//       setResults([]);
//       setSelectedMarker(null);
//     }
//   };

//   const handleShowRoute = (item) => {
//     setDirectionsReq({
//       origin: userLoc,
//       destination: { lat: item.lat, lng: item.lng },
//       travelMode: "DRIVING"
//     });
//     setDirectionsResponse(null);
//     setDirectionsStep(0);
//   };

//   useEffect(() => {
//     if (
//       directionsResponse &&
//       !muted &&
//       directionsResponse.routes[0]?.legs[0]?.steps[directionsStep]
//     ) {
//       const step = directionsResponse.routes[0].legs[0].steps[directionsStep];
//       speakDirections(step.instructions.replace(/(<([^>]+)>)/gi, ""));
//     }
//   }, [directionsStep, directionsResponse, muted]);

//   function InfoContent({ item }) {
//     return (
//       <Box sx={{ minWidth: 220 }}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={.8}>
//           <Avatar sx={{ bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider }}>
//             {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
//           </Avatar>
//           <Typography fontWeight={700}>{item.label || item.name || item.hospitalName}</Typography>
//         </Stack>
//         <Typography fontSize={15} color="text.secondary" mb={.4}>
//           {item.speciality || item.specialization || ""}
//         </Typography>
//         <Typography color="text.secondary" fontSize={13.5}>
//           {item.location || item.address || item.zipcode}
//         </Typography>
//         {item.active_status !== undefined &&
//           <Chip
//             size="small"
//             sx={{ mb: 1, mr: 1 }}
//             color={item.active_status === true || item.active_status === "Active" ? "success" : "default"}
//             label={
//               item.active_status === true || item.active_status === "Active"
//                 ? "Active"
//                 : (item.active_status === false || item.active_status === "Inactive"
//                   ? "Inactive"
//                   : String(item.active_status))
//             }
//           />
//         }
//         <Rating value={Number(item.rating || item.avgRating || 0)} readOnly size="small" />
//         {item.insurancePlans && item.insurancePlans.length > 0 &&
//           <Stack direction="row" spacing={1} my={1} flexWrap="wrap">
//             {item.insurancePlans.map(plan =>
//               <Chip key={plan} label={plan} color="info" size="small" />
//             )}
//           </Stack>}
//         {item.availabilityStatus &&
//           <Chip label={item.availabilityStatus} color={item.availabilityStatus === "Available" ? "success" : "default"} size="small" sx={{ mr: 1, mb: 1 }} />}
//         <Button variant="contained" color="primary" size="small"
//           sx={{ mt: 1, fontWeight: 700, bgcolor: THEME.teal }}
//           onClick={() => handleShowRoute(item)}
//         >
//           Show Route
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 2 }}>
//       {/* SEARCH BAR WITH SEARCH BUTTON */}
//       <Box sx={{ maxWidth: 820, mx: "auto", pt: 4 }}>
//         <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
//           <Autocomplete
//             options={suggestions}
//             inputValue={searchInput}
//             onInputChange={(_, val, reason) => { if (reason !== "reset") setSearchInput(val); }}
//             freeSolo
//             getOptionLabel={opt => typeof opt === "string" ? opt : opt.label || ""}
//             isOptionEqualToValue={(opt, v) => opt.label === (v?.label || v)}
//             noOptionsText="No results"
//             loading={loading}
//             filterOptions={x => x}
//             onChange={(_, option) => {
//               if (typeof option === "string") setSearchInput(option);
//               else if (option?.label) handleSuggestionSelect(option);
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search hospital, provider, or doctor"
//                 InputProps={{
//                   ...params.InputProps,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <IconButton type="submit" color="primary" sx={{ mr: 1, mt: 'auto', mb: 'auto' }}>
//                       <SearchIcon />
//                     </IconButton>
//                   ),
//                 }}
//                 placeholder="eg. Apollo, Alex, Global Hospital"
//                 fullWidth
//               />
//             )}
//             sx={{ flex: 1, mb: 2, bgcolor: "#fff", borderRadius: 2 }}
//           />
//         </form>
//       </Box>

//       {/* FILTERS */}
//       <Box sx={{ maxWidth: 1200, mx: "auto", mt: 3 }}>
//         <Paper sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, borderRadius: 3, mb: 4, bgcolor: "#fff" }}>
//           <TextField
//             select label="Speciality" value={filters.speciality}
//             onChange={e => setFilters(f => ({ ...f, speciality: e.target.value }))}
//             size="small" sx={{ minWidth: 140, flex: 1 }}
//           >
//             <MenuItem value="">All</MenuItem>
//             {specialities.map(sp =>
//               <MenuItem key={sp} value={sp}>{sp}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Insurance Plan" value={filters.insurance}
//             onChange={e => setFilters(f => ({ ...f, insurance: e.target.value }))}
//             size="small" sx={{ minWidth: 130, flex: 1 }}
//           >
//             <MenuItem value="">Any</MenuItem>
//             {insurancePlans.map(plan =>
//               <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Min Rating" value={filters.minRating}
//             onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
//             size="small" sx={{ minWidth: 110, flex: 1 }}
//           >
//             {[5, 4, 3].map(r =>
//               <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             label="Distance (km)"
//             value={filters.distanceKm}
//             onChange={e => setFilters(f => ({ ...f, distanceKm: e.target.value }))}
//             type="number"
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <TextField
//             label="Zipcode"
//             value={filters.zipcode}
//             onChange={e => setFilters(f => ({ ...f, zipcode: e.target.value }))}
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <Button variant="contained" type="button" onClick={handleSearch}
//             sx={{ fontWeight: 700, borderRadius: 2, bgcolor: THEME.teal, color: "#fff" }}>
//             Apply Filters
//           </Button>
//         </Paper>
//       </Box>

//       {/* MAP */}
//       <div
//         id="map-container"
//         style={{
//           width: "100%",
//           maxWidth: 1200,
//           margin: "2rem auto",
//           height: 470,
//           borderRadius: 24,
//           overflow: "hidden",
//           background: "#eee"
//         }}
//       >
//         {!isLoaded ? (
//           <Box sx={{ py: 12, textAlign: "center" }}><CircularProgress size={50} /></Box>
//         ) : (
//           <GoogleMap
//             ref={mapRef}
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={userLoc}
//             zoom={13}
//             options={{
//               streetViewControl: true, zoomControl: true,
//               mapTypeControl: true, fullscreenControl: true,
//             }}
//             onLoad={map => { mapRef.current = map; }}
//           >
//             {/* User marker */}
//             <Marker position={userLoc} icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 8, fillColor: THEME.teal, fillOpacity: 0.9,
//               strokeWeight: 2, strokeColor: "#fff"
//             }} title="Your Location" />
//             {/* Results markers */}
//             {results.map(item =>
//               <Marker
//                 key={item.key}
//                 position={{ lat: item.lat, lng: item.lng }}
//                 icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
//                 onClick={() => {
//                   setSelectedMarker(item);
//                   setDirectionsReq(null);
//                   setDirectionsResponse(null);
//                   setDirectionsStep(0);
//                 }}
//               />
//             )}
//             {/* InfoWindow */}
//             {selectedMarker &&
//               <InfoWindow
//                 position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//                 onCloseClick={() => setSelectedMarker(null)}
//               >
//                 <InfoContent item={selectedMarker} />
//               </InfoWindow>
//             }
//             {/* Directions polyline: dotted */}
//             {directionsReq && (
//               <>
//                 <DirectionsService
//                   options={directionsReq}
//                   callback={res => {
//                     if (res && res.status === "OK") setDirectionsResponse(res);
//                   }}
//                 />
//                 {directionsResponse &&
//                   <DirectionsRenderer
//                     options={{
//                       directions: directionsResponse,
//                       suppressMarkers: false,
//                       polylineOptions: {
//                         strokeColor: THEME.teal,
//                         strokeWeight: 5,
//                         icons: [{
//                           icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
//                           offset: "0", repeat: "12px"
//                         }]
//                       }
//                     }}
//                   />
//                 }
//               </>
//             )}
//           </GoogleMap>
//         )}
//       </div>

//       {/* Navigation stepper w/ finish flag */}
//       {directionsResponse && directionsResponse.routes[0]?.legs[0]?.steps &&
//         <Box sx={{ maxWidth: 800, mx: "auto", my: 3 }}>
//           <Paper sx={{ p: 2, bgcolor: "#f9fdfd", border: `2px solid ${THEME.teal}` }}>
//             <Typography fontWeight={700} mb={1}>
//               Directions (Step {directionsStep + 1} of {directionsResponse.routes[0].legs[0].steps.length})
//             </Typography>
//             <Typography sx={{ mb: .6 }}>
//               <span style={{ color: THEME.indigo, fontWeight: 700 }}>{directionsStep + 1}.</span>{" "}
//               <span dangerouslySetInnerHTML={{ __html: directionsResponse.routes[0].legs[0].steps[directionsStep].instructions }} />
//               {" "}
//               <b>({directionsResponse.routes[0].legs[0].steps[directionsStep].distance.text})</b>
//             </Typography>
//             {directionsStep === directionsResponse.routes[0].legs[0].steps.length - 1 && (
//               <Stack direction="row" alignItems="center" spacing={1} mt={2}>
//                 <Typography fontWeight={700} color="success.main">Destination reached</Typography>
//                 <span style={{ fontSize: 28 }} role="img" aria-label="Finish">🏁</span>
//               </Stack>
//             )}
//             <Stack direction="row" spacing={2} mt={2}>
//               <Button
//                 onClick={() => setDirectionsStep(s => s > 0 ? s - 1 : 0)}
//                 disabled={directionsStep === 0}
//                 variant="outlined"
//                 color="primary"
//               >Back</Button>
//               <Button
//                 onClick={() => setDirectionsStep(s =>
//                   s < directionsResponse.routes[0].legs[0].steps.length - 1
//                     ? s + 1 : s
//                 )}
//                 disabled={directionsStep >= directionsResponse.routes[0].legs[0].steps.length - 1}
//                 variant="contained"
//                 sx={{ bgcolor: THEME.teal }}
//               >Next</Button>
//               <Button
//                 onClick={() => setMuted(v => !v)}
//                 variant="outlined"
//                 color={muted ? "success" : "error"}
//               >{muted ? "Unmute Voice" : "Mute Voice"}</Button>
//             </Stack>
//           </Paper>
//         </Box>
//       }
//     </Box>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box, Paper, TextField, InputAdornment, MenuItem, Button,
//   Stack, Chip, Avatar, Rating, CircularProgress, Autocomplete, Typography, IconButton
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import StethoscopeIcon from "@mui/icons-material/MedicalServices";
// import {
//   GoogleMap, Marker, InfoWindow, DirectionsService, Polyline, useJsApiLoader
// } from "@react-google-maps/api";
// import { filterDoctors } from "../api/doctor";
// import { filterProviders, fetchAllProviders } from "../api/providersApi";
// import { fetchAllInsurancePlans } from "../api/insuranceTeam";

// const THEME = { teal: "#00c3ad", indigo: "#234ba2", danger: "#e53935", provider: "#294fab" };
// const FALLBACK_LOC = { lat: 12.9716, lng: 77.5946 };

// // Helper: Get user's saved location
// function getSavedUserLocation() {
//   try {
//     const customerRaw = localStorage.getItem("user");
//     if (!customerRaw) return null;
//     const customer = JSON.parse(customerRaw);
//     if (customer.lat && customer.lon) return { lat: Number(customer.lat), lng: Number(customer.lon) };
//     if (customer.locationLat && customer.locationLon) return { lat: Number(customer.locationLat), lng: Number(customer.locationLon) };
//     if (customer.latitude && customer.longitude) return { lat: Number(customer.latitude), lng: Number(customer.longitude) };
//     return null;
//   } catch {
//     return null;
//   }
// }

// // Polyline decoder
// function decodePolyline(encoded) {
//   let points = [];
//   let index = 0, lat = 0, lng = 0;
//   while (index < encoded.length) {
//     let b, shift = 0, result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
//     lat += dlat;
//     shift = 0; result = 0;
//     do {
//       b = encoded.charCodeAt(index++) - 63;
//       result |= (b & 0x1f) << shift;
//       shift += 5;
//     } while (b >= 0x20);
//     let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
//     lng += dlng;
//     points.push({ lat: lat / 1e5, lng: lng / 1e5 });
//   }
//   return points;
// }

// // Speech helper
// function speakDirections(text) {
//   if (window.speechSynthesis && text) {
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
//   }
// }

// export default function MapSearch() {
//   const [userLoc, setUserLoc] = useState(FALLBACK_LOC);
//   const [searchInput, setSearchInput] = useState("");
//   const [filters, setFilters] = useState({
//     speciality: "", insurance: "", minRating: "", distanceKm: "", zipcode: ""
//   });
//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [specialities, setSpecialities] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const [directionsReq, setDirectionsReq] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [directionsStep, setDirectionsStep] = useState(0);
//   const [muted, setMuted] = useState(false);

//   const [navUserPos, setNavUserPos] = useState(userLoc);
//   const [polylinePath, setPolylinePath] = useState([]);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });
//   const mapRef = useRef();

//   // Initial user location
//   useEffect(() => {
//     setUserLoc(getSavedUserLocation() || FALLBACK_LOC);
//   }, []);

//   useEffect(() => { fetchAllInsurancePlans().then(setInsurancePlans); }, []);
//   useEffect(() => {
//     async function loadSpecs() {
//       const providers = await fetchAllProviders();
//       const allSpecs = providers.flatMap(p =>
//         Array.isArray(p.speciality) ? p.speciality
//           : typeof p.speciality === "string" ? [p.speciality]
//           : typeof p.specialization === "string" ? [p.specialization]
//           : Array.isArray(p.specialization) ? p.specialization
//           : []
//       ).map(s => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
//       setSpecialities([...new Set(allSpecs)]);
//     }
//     loadSpecs();
//   }, []);

//   // Search suggestions
//   useEffect(() => {
//     if (!searchInput.trim()) { setSuggestions([]); return; }
//     const input = searchInput.trim().toLowerCase();
//     Promise.all([fetchAllProviders(), filterDoctors({ name: searchInput })])
//       .then(([providers, docs]) => {
//         const provSugs = (providers || []).filter(p =>
//           (p.hospitalName && p.hospitalName.toLowerCase().includes(input)) ||
//           (p.name && p.name.toLowerCase().includes(input))
//         ).map(p => ({
//           type: "provider", label: p.hospitalName || p.name, ...p,
//           lat: p.lat ? Number(p.lat) : undefined,
//           lng: p.lon ? Number(p.lon) : undefined,
//         }));
//         const docSugs = (docs || []).filter(d => d.name && d.name.toLowerCase().includes(input)).map(d => ({
//           type: "doctor", label: d.name, ...d,
//           lat: d.locationLat ? Number(d.locationLat) : undefined,
//           lng: d.locationLon ? Number(d.locationLon) : undefined,
//         }));
//         const seen = new Set();
//         const united = [...provSugs, ...docSugs].filter(s => {
//           if (seen.has(s.label)) return false;
//           seen.add(s.label); return true;
//         });
//         setSuggestions(united);
//       });
//   }, [searchInput]);

//   // Handle search & filters
//   const handleSearch = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setDirectionsReq(null); setDirectionsResponse(null); setSelectedMarker(null); setDirectionsStep(0); setPolylinePath([]); setNavUserPos(userLoc);
//     let searchLat = userLoc.lat, searchLng = userLoc.lng;
//     const sel = suggestions.find(s => s.label === searchInput);
//     const [doctors, providers] = await Promise.all([
//       filterDoctors({
//         name: sel?.type === "doctor" ? sel.label : (searchInput || undefined),
//         specialization: filters.speciality || undefined,
//         rating: filters.minRating || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined
//       }),
//       filterProviders({
//         Hospital_name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         speciality: filters.speciality || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         minRating: filters.minRating || undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined,
//         zipcode: filters.zipcode || undefined,
//       })
//     ]);
//     const items = [
//       ...(doctors || []).filter(d => d.locationLat && d.locationLon).map(d => ({
//         key: `doc-${d.id || d.name}-${d.locationLat}`,
//         ...d, type: "doctor", lat: Number(d.locationLat), lng: Number(d.locationLon)
//       })),
//       ...(providers || []).filter(p => p.lat && p.lon).map(p => ({
//         key: `prov-${p.id || p.name}-${p.lat}`,
//         ...p, type: "provider", lat: Number(p.lat), lng: Number(p.lon)
//       }))
//     ];
//     setResults(items); setLoading(false);
//   };

//   const handleSuggestionSelect = (option) => {
//     setSearchInput(option.label);
//     setDirectionsReq(null); setDirectionsResponse(null); setDirectionsStep(0); setPolylinePath([]); setNavUserPos(userLoc);
//     if (option && option.lat && option.lng) {
//       setResults([{
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       }]);
//       setSelectedMarker({
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       });
//       if (mapRef.current && mapRef.current.panTo) mapRef.current.panTo({ lat: option.lat, lng: option.lng });
//     } else { setResults([]); setSelectedMarker(null); }
//   };

//   const handleShowRoute = (item) => {
//     setDirectionsReq({
//       origin: userLoc,
//       destination: { lat: item.lat, lng: item.lng },
//       travelMode: "DRIVING"
//     });
//     setDirectionsResponse(null); setDirectionsStep(0); setPolylinePath([]); setNavUserPos(userLoc);
//   };

//   // Navigation step logic: move marker and update polyline
//   useEffect(() => {
//     if (!directionsResponse) return;
//     const route = directionsResponse.routes[0];
//     if (!route) return;
//     const steps = route.legs[0].steps;
//     if (!steps || steps.length === 0) return;
//     let newUserPos = directionsStep === 0
//       ? route.legs[0].start_location
//       : (directionsStep <= steps.length
//         ? steps[directionsStep - 1].end_location
//         : steps[steps.length - 1].end_location);
//     setNavUserPos(newUserPos);

//     // Decode full polyline and trim ahead
//     const encodedPolyline = route.overview_polyline?.polyline || route.overview_polyline?.points;
//     if (!encodedPolyline) return;
//     const fullPath = decodePolyline(encodedPolyline);
//     // Find point closest to user
//     let closestIndex = 0, minDist = Number.MAX_VALUE;
//     fullPath.forEach((pt, idx) => {
//       const dist = (pt.lat - newUserPos.lat) ** 2 + (pt.lng - newUserPos.lng) ** 2;
//       if (dist < minDist) { minDist = dist; closestIndex = idx; }
//     });
//     setPolylinePath(fullPath.slice(closestIndex));
//     if (mapRef.current) mapRef.current.panTo(newUserPos);
//   }, [directionsStep, directionsResponse]);

//   // Speak step instructions
//   useEffect(() => {
//     if (
//       directionsResponse &&
//       !muted &&
//       directionsResponse.routes[0]?.legs[0]?.steps[directionsStep]
//     ) {
//       const step = directionsResponse.routes[0].legs[0].steps[directionsStep];
//       speakDirections(step.instructions.replace(/(<([^>]+)>)/gi, ""));
//     }
//   }, [directionsStep, directionsResponse, muted]);

//   function InfoContent({ item }) {
//     return (
//       <Box sx={{ minWidth: 220 }}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={.8}>
//           <Avatar sx={{ bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider }}>
//             {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
//           </Avatar>
//           <Typography fontWeight={700}>{item.label || item.name || item.hospitalName}</Typography>
//         </Stack>
//         <Typography fontSize={15} color="text.secondary" mb={.4}>
//           {item.speciality || item.specialization || ""}
//         </Typography>
//         <Typography color="text.secondary" fontSize={13.5}>
//           {item.location || item.address || item.zipcode}
//         </Typography>
//         {item.active_status !== undefined &&
//           <Chip
//             size="small"
//             sx={{ mb: 1, mr: 1 }}
//             color={item.active_status === true || item.active_status === "Active" ? "success" : "default"}
//             label={
//               item.active_status === true || item.active_status === "Active"
//                 ? "Active"
//                 : (item.active_status === false || item.active_status === "Inactive"
//                   ? "Inactive"
//                   : String(item.active_status))
//             }
//           />
//         }
//         <Rating value={Number(item.rating || item.avgRating || 0)} readOnly size="small" />
//         {item.insurancePlans && item.insurancePlans.length > 0 &&
//           <Stack direction="row" spacing={1} my={1} flexWrap="wrap">
//             {item.insurancePlans.map(plan =>
//               <Chip key={plan} label={plan} color="info" size="small" />
//             )}
//           </Stack>}
//         {item.availabilityStatus &&
//           <Chip label={item.availabilityStatus} color={item.availabilityStatus === "Available" ? "success" : "default"} size="small" sx={{ mr: 1, mb: 1 }} />}
//         <Button variant="contained" color="primary" size="small"
//           sx={{ mt: 1, fontWeight: 700, bgcolor: THEME.teal }}
//           onClick={() => handleShowRoute(item)}
//         >
//           Show Route
//         </Button>
//       </Box>
//     );
//   }

//   // --- RENDER ---
//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 2 }}>
//       {/* --- SEARCH BAR AND FILTERS --- */}
//       <Box sx={{ maxWidth: 820, mx: "auto", pt: 4 }}>
//         <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
//           <Autocomplete
//             options={suggestions}
//             inputValue={searchInput}
//             onInputChange={(_, val, reason) => { if (reason !== "reset") setSearchInput(val); }}
//             freeSolo
//             getOptionLabel={opt => typeof opt === "string" ? opt : opt.label || ""}
//             isOptionEqualToValue={(opt, v) => opt.label === (v?.label || v)}
//             noOptionsText="No results"
//             loading={loading}
//             filterOptions={x => x}
//             onChange={(_, option) => {
//               if (typeof option === "string") setSearchInput(option);
//               else if (option?.label) handleSuggestionSelect(option);
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search hospital, provider, or doctor"
//                 InputProps={{
//                   ...params.InputProps,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <IconButton type="submit" color="primary" sx={{ mr: 1, mt: 'auto', mb: 'auto' }}>
//                       <SearchIcon />
//                     </IconButton>
//                   ),
//                 }}
//                 placeholder="eg. Apollo, Alex, Global Hospital"
//                 fullWidth
//               />
//             )}
//             sx={{ flex: 1, mb: 2, bgcolor: "#fff", borderRadius: 2 }}
//           />
//         </form>
//       </Box>

//       <Box sx={{ maxWidth: 1200, mx: "auto", mt: 3 }}>
//         <Paper sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, borderRadius: 3, mb: 4, bgcolor: "#fff" }}>
//           <TextField
//             select label="Speciality" value={filters.speciality}
//             onChange={e => setFilters(f => ({ ...f, speciality: e.target.value }))}
//             size="small" sx={{ minWidth: 140, flex: 1 }}
//           >
//             <MenuItem value="">All</MenuItem>
//             {specialities.map(sp =>
//               <MenuItem key={sp} value={sp}>{sp}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Insurance Plan" value={filters.insurance}
//             onChange={e => setFilters(f => ({ ...f, insurance: e.target.value }))}
//             size="small" sx={{ minWidth: 130, flex: 1 }}
//           >
//             <MenuItem value="">Any</MenuItem>
//             {insurancePlans.map(plan =>
//               <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Min Rating" value={filters.minRating}
//             onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
//             size="small" sx={{ minWidth: 110, flex: 1 }}
//           >
//             {[5, 4, 3].map(r =>
//               <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             label="Distance (km)"
//             value={filters.distanceKm}
//             onChange={e => setFilters(f => ({ ...f, distanceKm: e.target.value }))}
//             type="number"
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <TextField
//             label="Zipcode"
//             value={filters.zipcode}
//             onChange={e => setFilters(f => ({ ...f, zipcode: e.target.value }))}
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <Button variant="contained" type="button" onClick={handleSearch}
//             sx={{ fontWeight: 700, borderRadius: 2, bgcolor: THEME.teal, color: "#fff" }}>
//             Apply Filters
//           </Button>
//         </Paper>
//       </Box>

//       {/* --- MAP --- */}
//       <Box id="map-container" sx={{
//         width: "100%", maxWidth: 1200, mx: "auto", height: 470, borderRadius: 3,
//         overflow: "hidden", backgroundColor: "#eee",
//       }}>
//         {!isLoaded ? (
//           <Box sx={{ py: 12, textAlign: "center" }}><CircularProgress size={50} /></Box>
//         ) : (
//           <GoogleMap
//             ref={mapRef}
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={userLoc}
//             zoom={13}
//             options={{
//               streetViewControl: true, zoomControl: true,
//               mapTypeControl: true, fullscreenControl: true,
//             }}
//             onLoad={map => { mapRef.current = map; }}
//           >
//             {/* User navigation marker (step-by-step) */}
//             <Marker position={navUserPos} icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 8, fillColor: THEME.teal, fillOpacity: 0.9,
//               strokeWeight: 2, strokeColor: "#fff"
//             }} title="Current Position" />

//             {/* Results markers */}
//             {results.map(item =>
//               <Marker
//                 key={item.key}
//                 position={{ lat: item.lat, lng: item.lng }}
//                 icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
//                 onClick={() => {
//                   setSelectedMarker(item);
//                   setDirectionsReq(null);
//                   setDirectionsResponse(null);
//                   setDirectionsStep(0);
//                   setPolylinePath([]);
//                   setNavUserPos(userLoc);
//                 }}
//               />
//             )}

//             {/* InfoWindow for marker */}
//             {selectedMarker &&
//               <InfoWindow
//                 position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//                 onCloseClick={() => setSelectedMarker(null)}
//               >
//                 <InfoContent item={selectedMarker} />
//               </InfoWindow>
//             }

//             {/* Route directions */}
//             {directionsReq &&
//               <DirectionsService
//                 options={directionsReq}
//                 callback={res => {
//                   if (res && res.status === "OK") setDirectionsResponse(res);
//                 }}
//               />
//             }

//             {/* Polyline for remaining route */}
//             {polylinePath.length > 0 &&
//               <Polyline
//                 path={polylinePath}
//                 options={{
//                   strokeColor: THEME.teal,
//                   strokeWeight: 5,
//                   icons: [{
//                     icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
//                     offset: "0", repeat: "12px"
//                   }],
//                 }}
//               />
//             }
//           </GoogleMap>
//         )}
//       </Box>

//       {/* --- NAVIGATION STEPPER AND VOICE --- */}
//       {directionsResponse && directionsResponse.routes[0]?.legs[0]?.steps &&
//         <Box sx={{ maxWidth: 800, mx: "auto", my: 3 }}>
//           <Paper sx={{ p: 2, bgcolor: "#f9fdfd", border: `2px solid ${THEME.teal}` }}>
//             <Typography fontWeight={700} mb={1}>
//               Directions (Step {directionsStep + 1} of {directionsResponse.routes[0].legs[0].steps.length})
//             </Typography>
//             <Typography sx={{ mb: .6 }}>
//               <span style={{ color: THEME.indigo, fontWeight: 700 }}>{directionsStep + 1}.</span>{" "}
//               <span dangerouslySetInnerHTML={{ __html: directionsResponse.routes[0].legs[0].steps[directionsStep].instructions }} />
//               {" "}
//               <b>({directionsResponse.routes[0].legs[0].steps[directionsStep].distance.text})</b>
//             </Typography>
//             {directionsStep === directionsResponse.routes[0].legs[0].steps.length - 1 && (
//               <Stack direction="row" alignItems="center" spacing={1} mt={2}>
//                 <Typography fontWeight={700} color="success.main">Destination reached</Typography>
//                 <span style={{ fontSize: 28 }} role="img" aria-label="Finish">🏁</span>
//               </Stack>
//             )}
//             <Stack direction="row" spacing={2} mt={2}>
//               <Button
//                 onClick={() => setDirectionsStep(s => s > 0 ? s - 1 : 0)}
//                 disabled={directionsStep === 0}
//                 variant="outlined"
//                 color="primary"
//               >Back</Button>
//               <Button
//                 onClick={() => setDirectionsStep(s =>
//                   s < directionsResponse.routes[0].legs[0].steps.length - 1 ? s + 1 : s
//                 )}
//                 disabled={directionsStep >= directionsResponse.routes[0].legs[0].steps.length - 1}
//                 variant="contained"
//                 sx={{ bgcolor: THEME.teal }}
//               >Next</Button>
//               <Button
//                 onClick={() => setMuted(v => !v)}
//                 variant="outlined"
//                 color={muted ? "success" : "error"}
//               >{muted ? "Unmute Voice" : "Mute Voice"}</Button>
//             </Stack>
//           </Paper>
//         </Box>
//       }
//     </Box>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box, Paper, TextField, InputAdornment, MenuItem, Button,
//   Stack, Chip, Avatar, Rating, CircularProgress,
//   Autocomplete, Typography, IconButton,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
// import StethoscopeIcon from "@mui/icons-material/MedicalServices";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   DirectionsService,
//   DirectionsRenderer,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { filterDoctors } from "../api/doctor";
// import { filterProviders, fetchAllProviders } from "../api/providersApi";
// import { fetchAllInsurancePlans } from "../api/insuranceTeam";

// const THEME = { teal: "#00c3ad", indigo: "#234ba2", danger: "#e53935", provider: "#294fab" };
// const FALLBACK_LOC = { lat: 12.9716, lng: 77.5946 };

// function getSavedUserLocation() {
//   try {
//     const customerRaw = localStorage.getItem("user");
//     if (!customerRaw) return null;
//     const customer = JSON.parse(customerRaw);
//     if (customer.lat && customer.lon) return { lat: Number(customer.lat), lng: Number(customer.lon) };
//     if (customer.locationLat && customer.locationLon) return { lat: Number(customer.locationLat), lng: Number(customer.locationLon) };
//     if (customer.latitude && customer.longitude) return { lat: Number(customer.latitude), lng: Number(customer.longitude) };
//     return null;
//   } catch { return null; }
// }

// function speakDirections(text) {
//   if (window.speechSynthesis && text) {
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
//   }
// }

// export default function MapSearch() {
//   const [userLoc, setUserLoc] = useState(FALLBACK_LOC);
//   const [searchInput, setSearchInput] = useState("");
//   const [filters, setFilters] = useState({
//     speciality: "", insurance: "", minRating: "", distanceKm: "", zipcode: ""
//   });
//   const [insurancePlans, setInsurancePlans] = useState([]);
//   const [specialities, setSpecialities] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const [directionsReq, setDirectionsReq] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const [directionsStep, setDirectionsStep] = useState(0);
//   const [muted, setMuted] = useState(false);

//   const [navUserPos, setNavUserPos] = useState(FALLBACK_LOC);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//   });
//   const mapRef = useRef();

//   // Set initial user location from storage (or fallback)
//   useEffect(() => {
//     setUserLoc(getSavedUserLocation() || FALLBACK_LOC);
//   }, []);

//   // Load insurance plans on mount
//   useEffect(() => { 
//     fetchAllInsurancePlans().then(setInsurancePlans); 
//   }, []);

//   // Load specialities from providers' data
//   useEffect(() => {
//     async function loadSpecs() {
//       const ps = await fetchAllProviders();
//       const allSpecs = ps.flatMap(p =>
//         Array.isArray(p.speciality) ? p.speciality
//           : typeof p.speciality === "string" ? [p.speciality]
//           : typeof p.specialization === "string" ? [p.specialization]
//           : Array.isArray(p.specialization) ? p.specialization
//           : []
//       ).map(s => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
//       setSpecialities([...new Set(allSpecs)]);
//     }
//     loadSpecs();
//   }, []);

//   // Suggestion list for autocomplete
//   useEffect(() => {
//     if (!searchInput.trim()) { setSuggestions([]); return; }
//     const input = searchInput.trim().toLowerCase();
//     Promise.all([fetchAllProviders(), filterDoctors({ name: searchInput })]).then(([providers, docs]) => {
//       const provSugs = (providers || []).filter(p =>
//         (p.hospitalName && p.hospitalName.toLowerCase().includes(input)) ||
//         (p.name && p.name.toLowerCase().includes(input))
//       ).map(p => ({
//         type: "provider", label: p.hospitalName || p.name, ...p,
//         lat: p.lat ? Number(p.lat) : undefined,
//         lng: p.lon ? Number(p.lon) : undefined,
//       }));
//       const docSugs = (docs || []).filter(d => d.name && d.name.toLowerCase().includes(input)).map(d => ({
//         type: "doctor", label: d.name, ...d,
//         lat: d.locationLat ? Number(d.locationLat) : undefined,
//         lng: d.locationLon ? Number(d.locationLon) : undefined,
//       }));
//       const seen = new Set();
//       const united = [...provSugs, ...docSugs].filter(s => {
//         if (seen.has(s.label)) return false;
//         seen.add(s.label); return true;
//       });
//       setSuggestions(united);
//     });
//   }, [searchInput]);

//   // Search and apply filters
//   const handleSearch = async (e) => {
//     if (e) e.preventDefault();
//     setLoading(true);
//     setDirectionsReq(null); setDirectionsResponse(null); setSelectedMarker(null); setDirectionsStep(0); setNavUserPos(userLoc);

//     let searchLat = userLoc.lat, searchLng = userLoc.lng;
//     const sel = suggestions.find(s => s.label === searchInput);
//     const [doctors, providers] = await Promise.all([
//       filterDoctors({
//         name: sel?.type === "doctor" ? sel.label : (searchInput || undefined),
//         specialization: filters.speciality || undefined,
//         rating: filters.minRating || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined
//       }),
//       filterProviders({
//         Hospital_name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
//         speciality: filters.speciality || undefined,
//         insurancePlans: filters.insurance ? [filters.insurance] : undefined,
//         minRating: filters.minRating || undefined,
//         lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined,
//         zipcode: filters.zipcode || undefined,
//       })
//     ]);
//     const items = [
//       ...(doctors || []).filter(d => d.locationLat && d.locationLon).map(d => ({
//         key: `doc-${d.id || d.name}-${d.locationLat}`,
//         ...d, type: "doctor", lat: Number(d.locationLat), lng: Number(d.locationLon)
//       })),
//       ...(providers || []).filter(p => p.lat && p.lon).map(p => ({
//         key: `prov-${p.id || p.name}-${p.lat}`,
//         ...p, type: "provider", lat: Number(p.lat), lng: Number(p.lon)
//       }))
//     ];
//     setResults(items); setLoading(false);
//   };

//   // Handle suggestion selection from autocomplete
//   const handleSuggestionSelect = (option) => {
//     setSearchInput(option.label);
//     setDirectionsReq(null); setDirectionsResponse(null); setDirectionsStep(0); setNavUserPos(userLoc);
//     if (option && option.lat && option.lng) {
//       setResults([{
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       }]);
//       setSelectedMarker({
//         ...option,
//         key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
//         type: option.type
//       });
//       if (mapRef.current && mapRef.current.panTo) mapRef.current.panTo({ lat: option.lat, lng: option.lng });
//     } else { setResults([]); setSelectedMarker(null); }
//   };

//   // Show route and start navigation to selected item
//   const handleShowRoute = (item) => {
//     setDirectionsReq({
//       origin: userLoc,
//       destination: { lat: item.lat, lng: item.lng },
//       travelMode: "DRIVING"
//     });
//     setDirectionsResponse(null); setDirectionsStep(0); setNavUserPos(userLoc);
//   };

//   // Update navigation user-marker position on directions step changes
//   useEffect(() => {
//     if (!directionsResponse) return;
//     const route = directionsResponse.routes[0];
//     if (!route) return;
//     const steps = route.legs[0].steps;
//     if (!steps || steps.length === 0) return;
//     let newUserPos = directionsStep === 0
//       ? route.legs[0].start_location
//       : steps[Math.min(directionsStep - 1, steps.length - 1)].end_location;
//     setNavUserPos(newUserPos);

//     if (mapRef.current) mapRef.current.panTo(newUserPos);
//   }, [directionsStep, directionsResponse]);

//   // Speak instructions on each step if not muted
//   useEffect(() => {
//     if (
//       directionsResponse &&
//       !muted &&
//       directionsResponse.routes[0]?.legs[0]?.steps[directionsStep]
//     ) {
//       const step = directionsResponse.routes[0].legs[0].steps[directionsStep];
//       speakDirections(step.instructions.replace(/(<([^>]+)>)/gi, ""));
//     }
//   }, [directionsStep, directionsResponse, muted]);

//   // Content inside InfoWindow for markers
//   function InfoContent({ item }) {
//     return (
//       <Box sx={{ minWidth: 220 }}>
//         <Stack direction="row" alignItems="center" spacing={1} mb={.8}>
//           <Avatar sx={{ bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider }}>
//             {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
//           </Avatar>
//           <Typography fontWeight={700}>{item.label || item.name || item.hospitalName}</Typography>
//         </Stack>
//         <Typography fontSize={15} color="text.secondary" mb={.4}>
//           {item.speciality || item.specialization || ""}
//         </Typography>
//         <Typography color="text.secondary" fontSize={13.5}>
//           {item.location || item.address || item.zipcode}
//         </Typography>
//         {item.active_status !== undefined &&
//           <Chip
//             size="small"
//             sx={{ mb: 1, mr: 1 }}
//             color={item.active_status === true || item.active_status === "Active" ? "success" : "default"}
//             label={
//               item.active_status === true || item.active_status === "Active"
//                 ? "Active"
//                 : (item.active_status === false || item.active_status === "Inactive"
//                   ? "Inactive"
//                   : String(item.active_status))
//             }
//           />
//         }
//         <Rating value={Number(item.rating || item.avgRating || 0)} readOnly size="small" />
//         {item.insurancePlans && item.insurancePlans.length > 0 &&
//           <Stack direction="row" spacing={1} my={1} flexWrap="wrap">
//             {item.insurancePlans.map(plan =>
//               <Chip key={plan} label={plan} color="info" size="small" />
//             )}
//           </Stack>}
//         {item.availabilityStatus &&
//           <Chip label={item.availabilityStatus} color={item.availabilityStatus === "Available" ? "success" : "default"} size="small" sx={{ mr: 1, mb: 1 }} />}
//         <Button variant="contained" color="primary" size="small"
//           sx={{ mt: 1, fontWeight: 700, bgcolor: THEME.teal }}
//           onClick={() => handleShowRoute(item)}
//         >
//           Show Route
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 2 }}>
//       {/* SEARCH BAR AND FILTERS */}
//       <Box sx={{ maxWidth: 820, mx: "auto", pt: 4 }}>
//         <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
//           <Autocomplete
//             options={suggestions}
//             inputValue={searchInput}
//             onInputChange={(_, val, reason) => { if (reason !== "reset") setSearchInput(val); }}
//             freeSolo
//             getOptionLabel={opt => typeof opt === "string" ? opt : opt.label || ""}
//             isOptionEqualToValue={(opt, v) => opt.label === (v?.label || v)}
//             noOptionsText="No results"
//             loading={loading}
//             filterOptions={x => x}
//             onChange={(_, option) => {
//               if (typeof option === "string") setSearchInput(option);
//               else if (option?.label) handleSuggestionSelect(option);
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Search hospital, provider, or doctor"
//                 InputProps={{
//                   ...params.InputProps,
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <IconButton type="submit" color="primary" sx={{ mr: 1, mt: 'auto', mb: 'auto' }}>
//                       <SearchIcon />
//                     </IconButton>
//                   ),
//                 }}
//                 placeholder="eg. Apollo, Alex, Global Hospital"
//                 fullWidth
//               />
//             )}
//             sx={{ flex: 1, mb: 2, bgcolor: "#fff", borderRadius: 2 }}
//           />
//         </form>
//       </Box>

//       <Box sx={{ maxWidth: 1200, mx: "auto", mt: 3 }}>
//         <Paper sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, borderRadius: 3, mb: 4, bgcolor: "#fff" }}>
//           <TextField
//             select label="Speciality" value={filters.speciality}
//             onChange={e => setFilters(f => ({ ...f, speciality: e.target.value }))}
//             size="small" sx={{ minWidth: 140, flex: 1 }}
//           >
//             <MenuItem value="">All</MenuItem>
//             {specialities.map(sp =>
//               <MenuItem key={sp} value={sp}>{sp}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Insurance Plan" value={filters.insurance}
//             onChange={e => setFilters(f => ({ ...f, insurance: e.target.value }))}
//             size="small" sx={{ minWidth: 130, flex: 1 }}
//           >
//             <MenuItem value="">Any</MenuItem>
//             {insurancePlans.map(plan =>
//               <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             select label="Min Rating" value={filters.minRating}
//             onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
//             size="small" sx={{ minWidth: 110, flex: 1 }}
//           >
//             {[5, 4, 3].map(r =>
//               <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
//             )}
//           </TextField>
//           <TextField
//             label="Distance (km)"
//             value={filters.distanceKm}
//             onChange={e => setFilters(f => ({ ...f, distanceKm: e.target.value }))}
//             type="number"
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <TextField
//             label="Zipcode"
//             value={filters.zipcode}
//             onChange={e => setFilters(f => ({ ...f, zipcode: e.target.value }))}
//             size="small"
//             sx={{ minWidth: 110, flex: 1 }}
//           />
//           <Button variant="contained" type="button" onClick={handleSearch}
//             sx={{ fontWeight: 700, borderRadius: 2, bgcolor: THEME.teal, color: "#fff" }}>
//             Apply Filters
//           </Button>
//         </Paper>
//       </Box>

//       {/* MAP AND NAVIGATION */}
//       <Box id="map-container" sx={{
//         width: "100%", maxWidth: 1200, mx: "auto", height: 470, borderRadius: 3,
//         overflow: "hidden", backgroundColor: "#eee",
//       }}>
//         {!isLoaded ? (
//           <Box sx={{ py: 12, textAlign: "center" }}>
//             <CircularProgress size={50} />
//           </Box>
//         ) : (
//           <GoogleMap
//             ref={mapRef}
//             mapContainerStyle={{ width: "100%", height: "100%" }}
//             center={userLoc}
//             zoom={13}
//             options={{
//               streetViewControl: true, zoomControl: true,
//               mapTypeControl: true, fullscreenControl: true,
//             }}
//             onLoad={map => { mapRef.current = map; }}
//           >
//             <Marker position={navUserPos} icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 8, fillColor: THEME.teal, fillOpacity: 0.9,
//               strokeWeight: 2, strokeColor: "#fff"
//             }} title="Current Position" />

//             {results.map(item =>
//               <Marker
//                 key={item.key}
//                 position={{ lat: item.lat, lng: item.lng }}
//                 icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
//                 onClick={() => {
//                   setSelectedMarker(item);
//                   setDirectionsReq(null);
//                   setDirectionsResponse(null);
//                   setDirectionsStep(0);
//                   setNavUserPos(userLoc);
//                 }}
//               />
//             )}

//             {selectedMarker &&
//               <InfoWindow
//                 position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//                 onCloseClick={() => setSelectedMarker(null)}
//               >
//                 <InfoContent item={selectedMarker} />
//               </InfoWindow>
//             }

//             {/* Directions service to get route */}
//             {directionsReq &&
//               <DirectionsService
//                 options={directionsReq}
//                 callback={res => {
//                   if (res && res.status === "OK") setDirectionsResponse(res);
//                 }}
//               />
//             }

//             {/* DirectionsRenderer for showing route */}
//             {directionsResponse && (
//               <DirectionsRenderer
//                 options={{
//                   directions: directionsResponse,
//                   polylineOptions: {
//                     strokeColor: THEME.teal,
//                     strokeWeight: 6,
//                     strokeOpacity: 0.7,
//                   },
//                   suppressMarkers: true,
//                 }}
//               />
//             )}
//           </GoogleMap>
//         )}
//       </Box>

//       {/* NAVIGATION CONTROLS */}
//       {directionsResponse && (
//         <Paper
//           elevation={3}
//           sx={{
//             maxWidth: 1200,
//             mx: "auto",
//             mt: 2,
//             p: 2,
//             borderRadius: 3,
//             bgcolor: "#fff",
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//             flexWrap: "wrap",
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight={600} flex={1}>
//             Step {directionsStep + 1} of {directionsResponse.routes[0].legs[0].steps.length}
//           </Typography>

//           <Typography
//             variant="body2"
//             flex={4}
//             dangerouslySetInnerHTML={{
//               __html: directionsResponse.routes[0].legs[0].steps[directionsStep]?.instructions || "",
//             }}
//             sx={{ overflowWrap: "break-word" }}
//           />

//           <Stack direction="row" spacing={1} alignItems="center">
//             <Button
//               variant="outlined"
//               size="small"
//               disabled={directionsStep <= 0}
//               onClick={() => setDirectionsStep(s => Math.max(0, s - 1))}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outlined"
//               size="small"
//               disabled={
//                 directionsStep >= directionsResponse.routes[0].legs[0].steps.length - 1
//               }
//               onClick={() =>
//                 setDirectionsStep(s =>
//                   Math.min(directionsResponse.routes[0].legs[0].steps.length - 1, s + 1)
//                 )
//               }
//             >
//               Next
//             </Button>
//             <Button
//               variant="contained"
//               color={muted ? "error" : "primary"}
//               size="small"
//               onClick={() => setMuted(m => !m)}
//               sx={{ fontWeight: "bold" }}
//               title={muted ? "Unmute voice instructions" : "Mute voice instructions"}
//             >
//               {muted ? "🔇 Mute" : "🔊 Unmute"}
//             </Button>
//             <Button
//               variant="text"
//               size="small"
//               color="secondary"
//               onClick={() => {
//                 setDirectionsReq(null);
//                 setDirectionsResponse(null);
//                 setDirectionsStep(0);
//               }}
//             >
//               Cancel Navigation
//             </Button>
//           </Stack>
//         </Paper>
//       )}

//       {/* RESULTS LIST */}
//       <Box
//         maxWidth={1200}
//         mx="auto"
//         mt={4}
//         mb={6}
//         sx={{
//           bgcolor: "#fff",
//           borderRadius: 3,
//           p: 2,
//           minHeight: 120,
//           overflowY: "auto",
//           maxHeight: 320,
//         }}
//       >
//         {loading ? (
//           <Box textAlign="center" py={6}>
//             <CircularProgress size={28} />
//           </Box>
//         ) : results.length === 0 ? (
//           <Typography textAlign="center" color="text.secondary" py={6}>
//             No results found matching your criteria.
//           </Typography>
//         ) : (
//           results.map(item => (
//             <Paper
//               key={item.key}
//               elevation={1}
//               sx={{
//                 p: 1.5,
//                 mb: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//                 cursor: "pointer",
//                 bgcolor:
//                   selectedMarker?.key === item.key
//                     ? THEME.teal + "22"
//                     : "transparent",
//                 borderRadius: 2,
//                 "&:hover": { bgcolor: THEME.teal + "11" },
//               }}
//               onClick={() => {
//                 setSelectedMarker(item);
//                 if (mapRef.current && mapRef.current.panTo)
//                   mapRef.current.panTo({ lat: item.lat, lng: item.lng });
//               }}
//             >
//               <Avatar
//                 sx={{
//                   bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider,
//                   width: 40,
//                   height: 40,
//                 }}
//               >
//                 {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
//               </Avatar>
//               <Box flex={1}>
//                 <Typography fontWeight={700} fontSize={16}>
//                   {item.label || item.name || item.hospitalName}
//                 </Typography>
//                 <Typography fontSize={14} color="text.secondary" noWrap>
//                   {item.speciality || item.specialization || ""}
//                 </Typography>
//                 <Typography fontSize={13} color="text.secondary" noWrap>
//                   {item.location || item.address || item.zipcode}
//                 </Typography>
//               </Box>
//               <Chip
//                 label="Show Route"
//                 variant="outlined"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleShowRoute(item);
//                 }}
//                 sx={{ cursor: "pointer" }}
//                 color="primary"
//               />
//             </Paper>
//           ))
//         )}
//       </Box>
//     </Box>
//   );
// }


//-----------------------------------

import React, { useState, useEffect, useRef } from "react";
import {
  Box, Paper, TextField, InputAdornment, MenuItem, Button,
  Stack, Chip, Avatar, Rating, CircularProgress,
  Autocomplete, Typography, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StethoscopeIcon from "@mui/icons-material/MedicalServices";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { filterDoctors } from "../api/doctor";
import { filterProviders, fetchAllProviders } from "../api/providersApi";
import { fetchAllInsurancePlans } from "../api/insuranceTeam";


const THEME = { teal: "#00c3ad", indigo: "#234ba2", danger: "#e53935", provider: "#294fab" };
const FALLBACK_LOC = { lat: 12.9716, lng: 77.5946 };

function getSavedUserLocation() {
  try {
    const customerRaw = localStorage.getItem("user");
    if (!customerRaw) return null;
    const customer = JSON.parse(customerRaw);
    if (customer.lat && customer.lon) return { lat: Number(customer.lat), lng: Number(customer.lon) };
    if (customer.locationLat && customer.locationLon) return { lat: Number(customer.locationLat), lng: Number(customer.locationLon) };
    if (customer.latitude && customer.longitude) return { lat: Number(customer.latitude), lng: Number(customer.longitude) };
    return null;
  } catch { return null; }
}

function speakDirections(text) {
  if (window.speechSynthesis && text) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(text));
  }
}

export default function MapSearch() {
  const [userLoc, setUserLoc] = useState(FALLBACK_LOC);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    speciality: "", insurance: "", minRating: "", distanceKm: "", zipcode: ""
  });
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directionsReq, setDirectionsReq] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionsStep, setDirectionsStep] = useState(0);
  const [muted, setMuted] = useState(false);

  const [navUserPos, setNavUserPos] = useState(FALLBACK_LOC);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const mapRef = useRef();

  // Function to fetch user current location via Geolocation API on demand
  const updateCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setUserLoc(newLoc);
        setNavUserPos(newLoc);
        if (mapRef.current && mapRef.current.panTo) {
          mapRef.current.panTo(newLoc);
        }
      },
      (err) => {
        alert("Unable to fetch your location. Please allow location access.");
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Set initial user location from localStorage (or fallback) only on mount. DO NOT auto fetch GPS location here.
  useEffect(() => {
    const savedLoc = getSavedUserLocation();
    if (savedLoc) {
      setUserLoc(savedLoc);
      setNavUserPos(savedLoc);
      if (mapRef.current && mapRef.current.panTo) {
        mapRef.current.panTo(savedLoc);
      }
    }
  }, []);

  // Load insurance plans on mount
  useEffect(() => {
    fetchAllInsurancePlans().then(setInsurancePlans);
  }, []);

  // Load specialities from providers' data
  useEffect(() => {
    async function loadSpecs() {
      const ps = await fetchAllProviders();
      const allSpecs = ps.flatMap(p =>
        Array.isArray(p.speciality) ? p.speciality
          : typeof p.speciality === "string" ? [p.speciality]
            : typeof p.specialization === "string" ? [p.specialization]
              : Array.isArray(p.specialization) ? p.specialization
                : []
      ).map(s => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
      setSpecialities([...new Set(allSpecs)]);
    }
    loadSpecs();
  }, []);

  // Suggestion list for autocomplete
  useEffect(() => {
    if (!searchInput.trim()) { setSuggestions([]); return; }
    const input = searchInput.trim().toLowerCase();
    Promise.all([fetchAllProviders(), filterDoctors({ name: searchInput })]).then(([providers, docs]) => {
      const provSugs = (providers || []).filter(p =>
        (p.hospitalName && p.hospitalName.toLowerCase().includes(input)) ||
        (p.name && p.name.toLowerCase().includes(input))
      ).map(p => ({
        type: "provider", label: p.hospitalName || p.name, ...p,
        lat: p.lat ? Number(p.lat) : undefined,
        lng: p.lon ? Number(p.lon) : undefined,
      }));
      const docSugs = (docs || []).filter(d => d.name && d.name.toLowerCase().includes(input)).map(d => ({
        type: "doctor", label: d.name, ...d,
        lat: d.locationLat ? Number(d.locationLat) : undefined,
        lng: d.locationLon ? Number(d.locationLon) : undefined,
      }));
      const seen = new Set();
      const united = [...provSugs, ...docSugs].filter(s => {
        if (seen.has(s.label)) return false;
        seen.add(s.label); return true;
      });
      setSuggestions(united);
    });
  }, [searchInput]);

  // Search and apply filters
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setDirectionsReq(null); setDirectionsResponse(null); setSelectedMarker(null); setDirectionsStep(0); setNavUserPos(userLoc);

    let searchLat = userLoc.lat, searchLng = userLoc.lng;
    const sel = suggestions.find(s => s.label === searchInput);
    const [doctors, providers] = await Promise.all([
      filterDoctors({
        name: sel?.type === "doctor" ? sel.label : (searchInput || undefined),
        specialization: filters.speciality || undefined,
        rating: filters.minRating || undefined,
        insurancePlans: filters.insurance ? [filters.insurance] : undefined,
        lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined
      }),
      filterProviders({
        Hospital_name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
        name: sel?.type === "provider" ? sel.label : (searchInput || undefined),
        speciality: filters.speciality || undefined,
        insurancePlans: filters.insurance ? [filters.insurance] : undefined,
        minRating: filters.minRating || undefined,
        lat: searchLat, lon: searchLng, distanceKm: filters.distanceKm || undefined,
        zipcode: filters.zipcode || undefined,
      })
    ]);
    const items = [
      ...(doctors || []).filter(d => d.locationLat && d.locationLon).map(d => ({
        key: `doc-${d.id || d.name}-${d.locationLat}`,
        ...d, type: "doctor", lat: Number(d.locationLat), lng: Number(d.locationLon)
      })),
      ...(providers || []).filter(p => p.lat && p.lon).map(p => ({
        key: `prov-${p.id || p.name}-${p.lat}`,
        ...p, type: "provider", lat: Number(p.lat), lng: Number(p.lon)
      }))
    ];
    setResults(items); setLoading(false);
  };

  // Handle suggestion selection from autocomplete
  const handleSuggestionSelect = (option) => {
    setSearchInput(option.label);
    setDirectionsReq(null); setDirectionsResponse(null); setDirectionsStep(0); setNavUserPos(userLoc);
    if (option && option.lat && option.lng) {
      setResults([{
        ...option,
        key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
        type: option.type
      }]);
      setSelectedMarker({
        ...option,
        key: `${option.type === "doctor" ? "doc" : "prov"}-${option.id || option.name}-${option.lat}`,
        type: option.type
      });
      if (mapRef.current && mapRef.current.panTo) mapRef.current.panTo({ lat: option.lat, lng: option.lng });
    } else { setResults([]); setSelectedMarker(null); }
  };

  // Show route and start navigation to selected item
  const handleShowRoute = (item) => {
    setDirectionsReq({
      origin: userLoc,
      destination: { lat: item.lat, lng: item.lng },
      travelMode: "DRIVING"
    });
    setDirectionsResponse(null); setDirectionsStep(0); setNavUserPos(userLoc);
  };

  // Update navigation user-marker position on directions step changes
  useEffect(() => {
    if (!directionsResponse) return;
    const route = directionsResponse.routes[0];
    if (!route) return;
    const steps = route.legs[0].steps;
    if (!steps || steps.length === 0) return;
    let newUserPos = directionsStep === 0
      ? route.legs[0].start_location
      : steps[Math.min(directionsStep - 1, steps.length - 1)].end_location;
    setNavUserPos(newUserPos);

    if (mapRef.current) mapRef.current.panTo(newUserPos);
  }, [directionsStep, directionsResponse]);

  // Speak instructions on each step if not muted
  useEffect(() => {
    if (
      directionsResponse &&
      !muted &&
      directionsResponse.routes[0]?.legs[0]?.steps[directionsStep]
    ) {
      const step = directionsResponse.routes[0].legs[0].steps[directionsStep];
      speakDirections(step.instructions.replace(/(<([^>]+)>)/gi, ""));
    }
  }, [directionsStep, directionsResponse, muted]);

  // Content inside InfoWindow for markers
  function InfoContent({ item }) {
    return (
      <Box sx={{ minWidth: 220 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={.8}>
          <Avatar sx={{ bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider }}>
            {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
          </Avatar>
          <Typography fontWeight={700}>{item.label || item.name || item.hospitalName}</Typography>
        </Stack>
        <Typography fontSize={15} color="text.secondary" mb={.4}>
          {item.speciality || item.specialization || ""}
        </Typography>
        <Typography color="text.secondary" fontSize={13.5}>
          {item.location || item.address || item.zipcode}
        </Typography>
        {item.active_status !== undefined &&
          <Chip
            size="small"
            sx={{ mb: 1, mr: 1 }}
            color={item.active_status === true || item.active_status === "Active" ? "success" : "default"}
            label={
              item.active_status === true || item.active_status === "Active"
                ? "Active"
                : (item.active_status === false || item.active_status === "Inactive"
                  ? "Inactive"
                  : String(item.active_status))
            }
          />
        }
        <Rating value={Number(item.rating || item.avgRating || 0)} readOnly size="small" />
        {item.insurancePlans && item.insurancePlans.length > 0 &&
          <Stack direction="row" spacing={1} my={1} flexWrap="wrap">
            {item.insurancePlans.map(plan =>
              <Chip key={plan} label={plan} color="info" size="small" />
            )}
          </Stack>}
        {item.availabilityStatus &&
          <Chip label={item.availabilityStatus} color={item.availabilityStatus === "Available" ? "success" : "default"} size="small" sx={{ mr: 1, mb: 1 }} />}
        <Button variant="contained" color="primary" size="small"
          sx={{ mt: 1, fontWeight: 700, bgcolor: THEME.teal }}
          onClick={() => handleShowRoute(item)}
        >
          Show Route
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 2 }}>
      {/* SEARCH BAR AND FILTERS */}
      <Box sx={{ maxWidth: 820, mx: "auto", pt: 4 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Autocomplete
            options={suggestions}
            inputValue={searchInput}
            onInputChange={(_, val, reason) => { if (reason !== "reset") setSearchInput(val); }}
            freeSolo
            getOptionLabel={opt => typeof opt === "string" ? opt : opt.label || ""}
            isOptionEqualToValue={(opt, v) => opt.label === (v?.label || v)}
            noOptionsText="No results"
            loading={loading}
            filterOptions={x => x}
            onChange={(_, option) => {
              if (typeof option === "string") setSearchInput(option);
              else if (option?.label) handleSuggestionSelect(option);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search hospital, provider, or doctor"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton type="submit" color="primary" sx={{ mr: 1, mt: 'auto', mb: 'auto' }}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
                placeholder="eg. Apollo, Alex, Global Hospital"
                fullWidth
              />
            )}
            sx={{ flex: 1, mb: 2, bgcolor: "#fff", borderRadius: 2 }}
          />
          {/* Button to fetch current location */}
          <Button
            variant="outlined"
            size="small"
            onClick={updateCurrentLocation}
            sx={{ mt: 1 }}
          >
            Use Current Location
          </Button>
        </form>
      </Box>

      {/* Filters */}
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 3 }}>
        <Paper sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, borderRadius: 3, mb: 4, bgcolor: "#fff" }}>
          <TextField
            select label="Speciality" value={filters.speciality}
            onChange={e => setFilters(f => ({ ...f, speciality: e.target.value }))}
            size="small" sx={{ minWidth: 140, flex: 1 }}
          >
            <MenuItem value="">All</MenuItem>
            {specialities.map(sp =>
              <MenuItem key={sp} value={sp}>{sp}</MenuItem>
            )}
          </TextField>
          <TextField
            select label="Insurance Plan" value={filters.insurance}
            onChange={e => setFilters(f => ({ ...f, insurance: e.target.value }))}
            size="small" sx={{ minWidth: 130, flex: 1 }}
          >
            <MenuItem value="">Any</MenuItem>
            {insurancePlans.map(plan =>
              <MenuItem key={plan.title || plan.id} value={plan.title}>{plan.title}</MenuItem>
            )}
          </TextField>
          <TextField
            select label="Min Rating" value={filters.minRating}
            onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
            size="small" sx={{ minWidth: 110, flex: 1 }}
          >
            {[5, 4, 3].map(r =>
              <MenuItem key={r} value={String(r)}>{r}★</MenuItem>
            )}
          </TextField>
          <TextField
            label="Distance (km)"
            value={filters.distanceKm}
            onChange={e => setFilters(f => ({ ...f, distanceKm: e.target.value }))}
            type="number"
            size="small"
            sx={{ minWidth: 110, flex: 1 }}
          />
          <TextField
            label="Zipcode"
            value={filters.zipcode}
            onChange={e => setFilters(f => ({ ...f, zipcode: e.target.value }))}
            size="small"
            sx={{ minWidth: 110, flex: 1 }}
          />
          <Button variant="contained" type="button" onClick={handleSearch}
            sx={{ fontWeight: 700, borderRadius: 2, bgcolor: THEME.teal, color: "#fff" }}>
            Apply Filters
          </Button>
        </Paper>
      </Box>

      {/* MAP AND NAVIGATION */}
      <Box id="map-container" sx={{
        width: "100%", maxWidth: 1200, mx: "auto", height: 470, borderRadius: 3,
        overflow: "hidden", backgroundColor: "#eee",
      }}>
        {!isLoaded ? (
          <Box sx={{ py: 12, textAlign: "center" }}>
            <CircularProgress size={50} />
          </Box>
        ) : (
          <GoogleMap
            ref={mapRef}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={userLoc}
            zoom={13}
            options={{
              streetViewControl: true, zoomControl: true,
              mapTypeControl: true, fullscreenControl: true,
            }}
            onLoad={map => { mapRef.current = map; }}
          >
            <Marker position={navUserPos} icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8, fillColor: THEME.teal, fillOpacity: 0.9,
              strokeWeight: 2, strokeColor: "#fff"
            }} title="Current Position" />

            {results.map(item =>
              <Marker
                key={item.key}
                position={{ lat: item.lat, lng: item.lng }}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                onClick={() => {
                  setSelectedMarker(item);
                  setDirectionsReq(null);
                  setDirectionsResponse(null);
                  setDirectionsStep(0);
                  setNavUserPos(userLoc);
                }}
              />
            )}

            {selectedMarker &&
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <InfoContent item={selectedMarker} />
              </InfoWindow>
            }

            {/* Directions service to get route */}
            {directionsReq &&
              <DirectionsService
                options={directionsReq}
                callback={res => {
                  if (res && res.status === "OK") setDirectionsResponse(res);
                }}
              />
            }

            {/* DirectionsRenderer for showing route */}
            {directionsResponse && (
              <DirectionsRenderer
                options={{
                  directions: directionsResponse,
                  polylineOptions: {
                    strokeColor: THEME.teal,
                    strokeWeight: 6,
                    strokeOpacity: 0.7,
                  },
                  suppressMarkers: true,
                }}
              />
            )}
          </GoogleMap>
        )}
      </Box>

      {/* NAVIGATION CONTROLS */}
      {directionsResponse && (
        <Paper
          elevation={3}
          sx={{
            maxWidth: 1200,
            mx: "auto",
            mt: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} flex={1}>
            Step {directionsStep + 1} of {directionsResponse.routes[0].legs[0].steps.length}
          </Typography>

          <Typography
            variant="body2"
            flex={4}
            dangerouslySetInnerHTML={{
              __html: directionsResponse.routes[0].legs[0].steps[directionsStep]?.instructions || "",
            }}
            sx={{ overflowWrap: "break-word" }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              disabled={directionsStep <= 0}
              onClick={() => setDirectionsStep(s => Math.max(0, s - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={
                directionsStep >= directionsResponse.routes[0].legs[0].steps.length - 1
              }
              onClick={() =>
                setDirectionsStep(s =>
                  Math.min(directionsResponse.routes[0].legs[0].steps.length - 1, s + 1)
                )
              }
            >
              Next
            </Button>
            <Button
              variant="contained"
              color={muted ? "error" : "primary"}
              size="small"
              onClick={() => setMuted(m => !m)}
              sx={{ fontWeight: "bold" }}
              title={muted ? "Unmute voice instructions" : "Mute voice instructions"}
            >
              {muted ? "🔇 Mute" : "🔊 Unmute"}
            </Button>
            <Button
              variant="text"
              size="small"
              color="secondary"
              onClick={() => {
                setDirectionsReq(null);
                setDirectionsResponse(null);
                setDirectionsStep(0);
              }}
            >
              Cancel Navigation
            </Button>
          </Stack>
        </Paper>
      )}

      {/* RESULTS LIST */}
      <Box
        maxWidth={1200}
        mx="auto"
        mt={4}
        mb={6}
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          p: 2,
          minHeight: 120,
          overflowY: "auto",
          maxHeight: 320,
        }}
      >
        {loading ? (
          <Box textAlign="center" py={6}>
            <CircularProgress size={28} />
          </Box>
        ) : results.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>
            No results found matching your criteria.
          </Typography>
        ) : (
          results.map(item => (
            <Paper
              key={item.key}
              elevation={1}
              sx={{
                p: 1.5,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                bgcolor:
                  selectedMarker?.key === item.key
                    ? THEME.teal + "22"
                    : "transparent",
                borderRadius: 2,
                "&:hover": { bgcolor: THEME.teal + "11" },
              }}
              onClick={() => {
                setSelectedMarker(item);
                if (mapRef.current && mapRef.current.panTo)
                  mapRef.current.panTo({ lat: item.lat, lng: item.lng });
              }}
            >
              <Avatar
                sx={{
                  bgcolor: item.type === "doctor" ? THEME.teal : THEME.provider,
                  width: 40,
                  height: 40,
                }}
              >
                {item.type === "doctor" ? <StethoscopeIcon /> : <LocalHospitalIcon />}
              </Avatar>
              <Box flex={1}>
                <Typography fontWeight={700} fontSize={16}>
                  {item.label || item.name || item.hospitalName}
                </Typography>
                <Typography fontSize={14} color="text.secondary" noWrap>
                  {item.speciality || item.specialization || ""}
                </Typography>
                <Typography fontSize={13} color="text.secondary" noWrap>
                  {item.location || item.address || item.zipcode}
                </Typography>
              </Box>
              <Chip
                label="Show Route"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowRoute(item);
                }}
                sx={{ cursor: "pointer" }}
                color="primary"
              />
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}
