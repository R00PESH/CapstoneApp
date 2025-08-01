import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper,
  CircularProgress, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack, Select, MenuItem, OutlinedInput, Chip, InputLabel, Snackbar, Alert, IconButton,
  FormControl,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  fetchAllProviders, createProvider, updateProvider, deleteProvider,
  fetchAllDoctors, // Make sure you export this from your api/admin.js
} from '../../../api/admin';

import { fetchAllInsurancePlans } from '../../../api/insuranceTeam';

const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

const ITEM_HEIGHT = 48, ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: { style: { maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP, width: 280 } },
};

const createGeoLocation = (lat, lon) => ({
  type: 'Point',
  coordinates: [parseFloat(lon), parseFloat(lat)],
});

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } catch {
    return isoString;
  }
};

export default function CreateProvider() {
  // State variables
  const [providers, setProviders] = useState([]);
  const [insurancePlansOptions, setInsurancePlansOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]); // <-- For doctors dropdown
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState('');
  const [page, setPage] = useState(0), [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null); // hosId for update/delete

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteHosId, setToDeleteHosId] = useState(null);

  // Form state
  const [form, setForm] = useState({
    hosId: '',
    hospitalName: '',
    email:' ',
    speciality: '',
    rating: '',
    location: '',
    zipcode: '',
    lat: '',
    lon: '',
    activeStatus: '',
    insurancePlans: [],
    docId: [], // array of doctor IDs
    reviews: [],
  });

  // New review inputs
  const [newReview, setNewReview] = useState({
    customerName: '',
    customerEmail: '',
    rating: '',
    review: '',
  });

  // Load initial data
  useEffect(() => {
    loadProviders();
    loadInsurancePlans();
    loadDoctors();
  }, []);

  async function loadProviders() {
    setLoading(true);
    setError('');
    try {
      const list = await fetchAllProviders();
      setProviders(list);
    } catch (e) {
      setError(e.message || 'Error loading providers');
    } finally {
      setLoading(false);
    }
  }

  async function loadInsurancePlans() {
    try {
      const plans = await fetchAllInsurancePlans();
      setInsurancePlansOptions(plans);
    } catch {
      setInsurancePlansOptions([]);
    }
  }

  async function loadDoctors() {
    try {
      const doctors = await fetchAllDoctors();
      setDoctorOptions(doctors);
    } catch (e) {
      console.error('Failed to load doctors', e);
      setDoctorOptions([]);
    }
  }

  // Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(+e.target.value); setPage(0); };

  // Open dialogs
  const openAddProviderDialog = () => { clearForm(); setSelectedProviderId(null); setDialogOpen(true); };
  const openEditProviderDialog = (provider) => {
    setSelectedProviderId(provider.hosId);
    setForm({
      hosId: provider.hosId || '',
      hospitalName: provider.hospitalName || provider.Hospital_name || '',
      email:provider.email|| '',
      speciality: provider.speciality || '',
      rating: (provider.rating ?? '').toString(),
      location: provider.location || '',
      zipcode: (provider.zipcode ?? '').toString(),
      lat: (provider.geoLocation?.coordinates?.[1] ?? provider.lat ?? '').toString(),
      lon: (provider.geoLocation?.coordinates?.[0] ?? provider.lon ?? '').toString(),
      activeStatus: provider.activeStatus || provider.active_Status || '',
      insurancePlans: Array.isArray(provider.insurancePlans)
        ? provider.insurancePlans : (provider.insurance_Plans ?? []),
      docId: Array.isArray(provider.docId) ? provider.docId : [],
      reviews: provider.reviews || [],
    });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); clearNewReview(); setError(''); };
  const clearForm = () => setForm({
    hosId: '', hospitalName: '', speciality: '', rating: '', location: '',
    zipcode: '', lat: '', lon: '', activeStatus: '', insurancePlans: [],
    docId: [], reviews: [],
  });
  const clearNewReview = () => setNewReview({ customerName: '', customerEmail: '', rating: '', review: '' });

  // Form changes
  const handleFormChange = (field) => (e) => {
    if (field === "insurancePlans") {
      setForm(f => ({ ...f, insurancePlans: e.target.value }));
    } else {
      setForm(f => ({ ...f, [field]: e.target.value }));
    }
  };

  const handleNewReviewChange = (field) => (e) =>
    setNewReview(r => ({ ...r, [field]: e.target.value }));

  // Add a new review to form.reviews array
  const addReview = () => {
    const { customerName, customerEmail, rating, review } = newReview;
    if (!customerName || !customerEmail || !rating || !review) {
      setSnackbar({ open: true, message: 'All review fields are required.', severity: 'error' });
      return;
    }
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      setSnackbar({ open: true, message: 'Rating must be between 0 and 5.', severity: 'error' });
      return;
    }
    const reviewObj = {
      customerName,
      customerEmail,
      rating: parsedRating,
      review,
      reviewGivenTime: new Date().toISOString(),
    };
    setForm(f => ({ ...f, reviews: [...(f.reviews || []), reviewObj] }));
    clearNewReview();
    setSnackbar({ open: true, message: 'Review added', severity: 'success' });
  };

  // Save provider - create or update
  const handleSave = async () => {
    const { hosId, hospitalName, lat, lon, activeStatus } = form;
    if (!hosId.trim()) {
      setSnackbar({ open: true, message: 'Hospital ID is required', severity: 'error' });
      return;
    }
    if (!hospitalName.trim()) {
      setSnackbar({ open: true, message: 'Hospital Name is required', severity: 'error' });
      return;
    }
    if (!lat || !lon) {
      setSnackbar({ open: true, message: 'Latitude and Longitude are required', severity: 'error' });
      return;
    }
    if (!activeStatus.trim()) {
      setSnackbar({ open: true, message: 'Active Status is required', severity: 'error' });
      return;
    }
    setSaving(true);
    setError('');
    try {
      const insurancePlanStrings = (form.insurancePlans || []).map(plan =>
        typeof plan === 'object' ? plan.title || plan.name || plan.id : plan
      );
      const payload = {
        hosId: hosId.trim(),
        hospitalName: hospitalName.trim(),
        email:email.trim(),
        speciality: form.speciality.trim() || undefined,
        rating: parseFloat(form.rating) || 0,
        location: form.location.trim() || undefined,
        zipcode: Number(form.zipcode) || 0,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
        activeStatus: activeStatus.trim(),
        insurancePlans: insurancePlanStrings,
        docId: form.docId,
        geoLocation: createGeoLocation(form.lat, form.lon),
        reviews: form.reviews || [],
      };
      if (selectedProviderId) {
        await updateProvider(selectedProviderId, payload);
        setSnackbar({ open: true, message: 'Provider updated successfully', severity: 'success' });
      } else {
        await createProvider(payload);
        setSnackbar({ open: true, message: 'Provider created successfully', severity: 'success' });
      }
      closeDialog();
      loadProviders();
    } catch (e) {
      setSnackbar({ open: true, message: e.message || 'Failed to save provider', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers with confirmation dialog
  const handleDeleteClick = (hosId) => {
    setToDeleteHosId(hosId);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    if (!toDeleteHosId) return;
    try {
      await deleteProvider(toDeleteHosId);
      setSnackbar({ open: true, message: 'Provider deleted successfully', severity: 'success' });
      if (selectedProviderId === toDeleteHosId) clearForm();
      loadProviders();
    } catch (e) {
      setSnackbar({ open: true, message: e.message || 'Failed to delete provider', severity: 'error' });
    }
    setToDeleteHosId(null);
  };

  const handleSnackbarClose = () => setSnackbar(prev => ({ ...prev, open: false }));

  const paginatedProviders = providers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderPlanNames = (plans) => {
    if (!plans) return '';
    if (!Array.isArray(plans)) return plans;
    return plans.map((p) => (typeof p === 'object' ? p.title || p.name || p.id : p)).join(', ');
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          background: richGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3,
        }}
      >
        Providers Management
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: providerColor }} />
        </Box>
      ) : error && !dialogOpen ? (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table size="small" stickyHeader aria-label="providers-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: providerColor }}>
                  <TableCell sx={{  fontWeight: 700 }}>Hospital ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hospital Name</TableCell>
                  <TableCell sx={{  fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{  fontWeight: 700 }}>Speciality</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Rating</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Location</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Zipcode</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Insurance Plans</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Doctor IDs</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Active Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      No providers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProviders.map((provider) => (
                    <TableRow key={provider.hosId}>
                      <TableCell>{provider.hosId}</TableCell>
                      <TableCell>{provider.hospitalName || provider.Hospital_name}</TableCell>
                      {/* <TableCell>{provider.email}</TableCell> */}
                      <TableCell>{provider.speciality}</TableCell>
                      <TableCell>{(typeof provider.rating === 'number'
                        ? provider.rating.toFixed(1)
                        : provider.rating ?? '0')}</TableCell>
                      <TableCell>{provider.location}</TableCell>
                      <TableCell>{provider.zipcode}</TableCell>
                      <TableCell>{renderPlanNames(provider.insurancePlans || provider.insurance_Plans)}</TableCell>
                      <TableCell>{provider.docId?.join(', ') || ''}</TableCell>
                      <TableCell>{provider.activeStatus || provider.active_Status}</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton
                          aria-label="edit"
                          onClick={() => openEditProviderDialog(provider)}
                          sx={{ color: doctorColor }} size="small"
                        ><EditIcon /></IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(provider.hosId)}
                          sx={{ color: 'red' }} size="small"
                        ><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={providers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

          {/* Add Provider button BELOW table: */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              aria-label="Add Provider"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={openAddProviderDialog}
              sx={{
                background: richGradient,
                color: 'white',
                '&:hover': { background: doctorColor }
              }}
            >
              Add Provider
            </Button>
          </Box>
        </>
      )}

      {/* Provider Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProviderId ? 'Edit Provider' : 'Register New Provider'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {selectedProviderId && (
              <Box sx={{ mb: 0 }}>
                <Chip label={`Editing Provider: ${form.hospitalName} (ID: ${form.hosId})`} color="info" />
              </Box>
            )}

            <TextField
              label="Hospital ID"
              value={form.hosId}
              onChange={handleFormChange('hosId')}
              fullWidth required
              disabled={!!selectedProviderId} // disable editing hosId when editing
            />
            <TextField label="Hospital Name" value={form.hospitalName} onChange={handleFormChange('hospitalName')} fullWidth required />
            <TextField label="Email" value={form.email} onChange={handleFormChange('email')} fullWidth />
            <TextField label="Speciality" value={form.speciality} onChange={handleFormChange('speciality')} fullWidth />
            <TextField label="Rating" type="number" inputProps={{ min: 0, max: 5, step: 0.1 }}
              value={form.rating} onChange={handleFormChange('rating')} fullWidth />
            <TextField label="Location" value={form.location} onChange={handleFormChange('location')} fullWidth />
            <TextField label="Zipcode" type="number" value={form.zipcode} onChange={handleFormChange('zipcode')} fullWidth />
            <TextField label="Latitude" type="number" inputProps={{ min: -90, max: 90, step: 0.000001 }}
              value={form.lat} onChange={handleFormChange('lat')} fullWidth required />
            <TextField label="Longitude" type="number" inputProps={{ min: -180, max: 180, step: 0.000001 }}
              value={form.lon} onChange={handleFormChange('lon')} fullWidth required />

            <InputLabel>Insurance Plans</InputLabel>
            <Select multiple value={form.insurancePlans} onChange={handleFormChange('insurancePlans')}
              input={<OutlinedInput label="Insurance Plans" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value, idx) => (
                    <Chip key={typeof value === 'object'
                      ? value.id || value.title || JSON.stringify(value) + idx
                      : value + idx}
                      label={typeof value === 'object'
                        ? value.title || value.name || value.id
                        : value}
                    />
                  ))}
                </Box>
              )}
              fullWidth MenuProps={MenuProps}
            >
              {insurancePlansOptions.map((plan) => (
                <MenuItem key={plan.id || plan.title} value={plan}>
                  {plan.title}
                </MenuItem>
              ))}
            </Select>

            {/* Doctor Multi-Select dropdown */}
            <FormControl fullWidth>
              <InputLabel id="doctor-select-label">Doctors</InputLabel>
              <Select
                labelId="doctor-select-label"
                multiple
                value={form.docId}
                onChange={(e) => setForm(f => ({ ...f, docId: e.target.value }))}
                input={<OutlinedInput label="Doctors" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const doc = doctorOptions.find(d => d.docId === id || d.id === id);
                      const label = doc ? `${doc.docId || doc.id} - ${doc.name}` : id;
                      return <Chip key={id} label={label} />;
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {doctorOptions.map((doc) => (
                  <MenuItem key={doc.docId || doc.id} value={doc.docId || doc.id}>
                    {doc.docId || doc.id} - {doc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Active Status"
              value={form.activeStatus}
              onChange={handleFormChange('activeStatus')}
              fullWidth required
              placeholder="e.g. Available, Unavailable"
            />

            {/* Reviews Table */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Reviews</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 250 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: providerColor }}>
                    <TableCell sx={{ color: 'white', fontWeight: '700' }}>Customer Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '700' }}>Customer Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '700' }}>Rating</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '700' }}>Review</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: '700' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.reviews && form.reviews.length > 0 ? (
                    form.reviews.map((rev, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{rev.customerName || rev.customerName}</TableCell>
                        <TableCell>{rev.customerEmail || rev.customerEmail}</TableCell>
                        <TableCell>{rev.rating}</TableCell>
                        <TableCell>{rev.review}</TableCell>
                        <TableCell>{formatDate(rev.reviewGivenTime || rev.reviewTime)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No reviews available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add Review Inputs */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Add Review</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Customer Name" value={newReview.customerName} onChange={handleNewReviewChange('customerName')} fullWidth />
              <TextField label="Customer Email" value={newReview.customerEmail} onChange={handleNewReviewChange('customerEmail')} fullWidth type="email" />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
              <TextField label="Rating" type="number" inputProps={{ min: 0, max: 5, step: 0.1 }} value={newReview.rating} onChange={handleNewReviewChange('rating')} fullWidth />
              <TextField label="Review" value={newReview.review} onChange={handleNewReviewChange('review')} fullWidth />
            </Stack>
            <Box mt={1}>
              <Button variant="contained" size="small" onClick={addReview}
                sx={{ backgroundColor: doctorColor, '&:hover': { backgroundColor: providerColor } }}>
                Add Review
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained"
            sx={{ background: richGradient, '&:hover': { background: doctorColor } }}>
            {saving ? <CircularProgress size={22} color="inherit" /> : selectedProviderId ? 'Update Provider' : 'Register Provider'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Provider</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this provider?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
