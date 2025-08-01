// src/components/InsuranceTeam/CreateCustomers.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Popover,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  fetchAllInsurerCustomers,
  createInsurerCustomer,
  updateInsurerCustomerByAdharNum,
  deleteInsurerCustomerByAdharNum,
} from '../../../api/insuranceTeam';

import { fetchAllInsurancePlans } from '../../../api/insuranceTeam';

const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

// Format ISO string to locale date string for display
const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

// Create GeoJSON Point for backend from lat, lon strings/numbers
const createGeoLocation = (lat, lon) => ({
  type: "Point",
  coordinates: [parseFloat(lon), parseFloat(lat)],
});

export default function CreateCustomers() {
  const [customers, setCustomers] = useState([]);
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');

  // Dialog state for add/edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdhar, setSelectedAdhar] = useState(null); // Aadhaar number to identify customer for edit/delete

  // Delete confirmation popover state
  const [deletePopoverPos, setDeletePopoverPos] = useState(null);
  const [deleteTargetAdhar, setDeleteTargetAdhar] = useState(null);
  const deletePopoverOpen = Boolean(deleteTargetAdhar);

  // Customer form state
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    adharNumber: '',
    contactNumber: '',
    address: '',
    zipcode: '',
    lat: '',
    lon: '',
    nominee: '',
    nomineeAdharNumber: '',
    insurancePlans: [],
    status: '',
  });

  useEffect(() => {
    loadCustomers();
    loadInsurancePlans();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllInsurerCustomers();
      setCustomers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }

  async function loadInsurancePlans() {
    try {
      const plans = await fetchAllInsurancePlans();
      setInsurancePlans(plans || []);
    } catch {
      setInsurancePlans([]);
    }
  }

  // Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Filter customers by name or Aadhaar (case-insensitive)
  const filteredCustomers = customers.filter(
    (c) =>
      (c.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (c.adhar_num?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  // Pagination slice
  const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Open dialog for adding new customer
  const openNewCustomerDialog = () => {
    resetForm();
    setSelectedAdhar(null);
    setDialogOpen(true);
  };

  // Open dialog for editing existing customer, populate form
  const openEditCustomerDialog = (customer) => {
    setSelectedAdhar(customer.adhar_num || customer.adharNumber);
    setForm({
      id: customer._id || customer.id || '',
      name: customer.name || '',
      email: customer.email || '',
      password: '', // Do not prefill password for security
      dateOfBirth: customer.date_of_birth ? customer.date_of_birth.split('T')[0] : (customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : ''),
      gender: customer.gender || '',
      adharNumber: (customer.adhar_num || customer.adharNumber || '').trim(),
      contactNumber: customer.contact_num || customer.contactNumber || '',
      address: customer.address || '',
      zipcode: customer.zipcode ? String(customer.zipcode) : '',
      lat: customer.lat ? String(customer.lat) : '',
      lon: customer.lon ? String(customer.lon) : '',
      nominee: customer.Nominee || customer.nominee || '',
      nomineeAdharNumber: customer.nominee_adhar_numb || customer.nomineeAdharNumber || '',
      insurancePlans: customer.insurance_Plans || customer.insurancePlans || [],
      status: customer.status || '',
    });
    setDialogOpen(true);
  };

  // Reset form and editing state
  const resetForm = () => {
    setForm({
      id: '',
      name: '',
      email: '',
      password: '',
      dateOfBirth: '',
      gender: '',
      adharNumber: '',
      contactNumber: '',
      address: '',
      zipcode: '',
      lat: '',
      lon: '',
      nominee: '',
      nomineeAdharNumber: '',
      insurancePlans: [],
      status: '',
    });
    setSelectedAdhar(null);
  };

  // Form field change handler
  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Insurance plans multi-select change handler
  const handleInsurancePlansChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      insurancePlans: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Save customer handler (create or update)
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.adharNumber.trim()
        || !form.dateOfBirth.trim() || !form.gender.trim() || !form.status.trim()) {
      setSnackbar({ open: true, message: 'Please fill all required fields.', severity: 'error' });
      return;
    }
    setSaving(true);

    const payload = {
      id: form.id || undefined,
      name: form.name.trim(),
      email: form.email.trim(),
      ...(form.password.trim() ? { password: form.password.trim() } : {}),
      dateOfBirth: new Date(form.dateOfBirth).toISOString(),
      gender: form.gender.trim(),
      adharNumber: form.adharNumber.trim(),
      contactNumber: form.contactNumber.trim() || undefined,
      address: form.address.trim() || undefined,
      zipcode: form.zipcode ? parseInt(form.zipcode, 10) : 0,
      lat: form.lat ? parseFloat(form.lat) : 0,
      lon: form.lon ? parseFloat(form.lon) : 0,
      nominee: form.nominee.trim() || undefined,
      nomineeAdharNumber: form.nomineeAdharNumber.trim() || undefined,
      insurancePlans: form.insurancePlans || [],
      status: form.status.trim(),
      geoLocation: createGeoLocation(form.lat || "0", form.lon || "0"),
    };

    try {
      if (selectedAdhar) {
        await updateInsurerCustomerByAdharNum(selectedAdhar, payload);
        setSnackbar({ open: true, message: 'Customer updated successfully', severity: 'success' });
      } else {
        await createInsurerCustomer(payload);
        setSnackbar({ open: true, message: 'Customer created successfully', severity: 'success' });
      }
      resetForm();
      setDialogOpen(false);
      loadCustomers();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to save customer', severity: 'error' });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Show delete confirmation popover centered on screen
  const handleDeleteClick = (event, adharNum) => {
    event.preventDefault();
    if (!adharNum) {
      setSnackbar({ open: true, message: 'Invalid Aadhaar number for deletion.', severity: 'error' });
      return;
    }
    setDeleteTargetAdhar(adharNum);
    setDeletePopoverPos({
      top: window.innerHeight / 2,
      left: window.innerWidth / 2,
    });
  };

  // Confirm deletion
  const handleDeleteConfirm = async () => {
    if (!deleteTargetAdhar) return;
    try {
      await deleteInsurerCustomerByAdharNum(deleteTargetAdhar);
      setSnackbar({ open: true, message: 'Customer deleted successfully', severity: 'success' });
      if (selectedAdhar === deleteTargetAdhar) {
        resetForm();
        setDialogOpen(false);
      }
      loadCustomers();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete customer', severity: 'error' });
      console.error(err);
    } finally {
      setDeleteTargetAdhar(null);
      setDeletePopoverPos(null);
    }
  };

  // Cancel deletion popover
  const handleDeleteCancel = () => {
    setDeleteTargetAdhar(null);
    setDeletePopoverPos(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom sx={{
        fontWeight: 'bold',
        background: richGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 3,
      }}>
        Customer Management
      </Typography>

      <TextField
        label="Search by Name or Aadhaar Number"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: providerColor }} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small" aria-label="customers-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: providerColor }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DOB</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Gender</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Aadhaar</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Zipcode</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nominee</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nominee Aadhaar</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Insurance Plans</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((cust) => {
                    const adhar = cust.adhar_num || cust.adharNumber || '';
                    return (
                      <TableRow key={adhar || cust.id || cust._id}>
                        <TableCell>{cust.name || '-'}</TableCell>
                        <TableCell>{cust.email || '-'}</TableCell>
                        <TableCell>{formatDate(cust.date_of_birth || cust.dateOfBirth)}</TableCell>
                        <TableCell>{cust.gender || '-'}</TableCell>
                        <TableCell>{adhar || '-'}</TableCell>
                        <TableCell>{cust.address || '-'}</TableCell>
                        <TableCell>{cust.zipcode ?? '-'}</TableCell>
                        <TableCell>{cust.Nominee || cust.nominee || '-'}</TableCell>
                        <TableCell>{cust.nominee_adhar_numb || cust.nomineeAdharNumber || '-'}</TableCell>
                        <TableCell>{(cust.insurance_Plans || cust.insurancePlans || []).join(', ')}</TableCell>
                        <TableCell>{cust.status || '-'}</TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          <IconButton size="small" aria-label="edit" onClick={() => openEditCustomerDialog(cust)} sx={{ color: doctorColor }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label="delete"
                            onClick={(e) => handleDeleteClick(e, adhar)}
                            sx={{ color: 'red' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredCustomers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              sx={{ background: richGradient, '&:hover': { backgroundColor: doctorColor } }}
              onClick={openNewCustomerDialog}
            >
              Add Customer
            </Button>
          </Box>
        </>
      )}

      {/* Dialog for add/edit */}
      <Dialog fullWidth maxWidth="md" open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedAdhar ? `Edit Customer: ${form.name}` : 'Add New Customer'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Name" required fullWidth value={form.name} onChange={handleFormChange('name')} />
            <TextField label="Email" required type="email" fullWidth value={form.email} onChange={handleFormChange('email')} />
            {!selectedAdhar && (
              <TextField label="Password" required fullWidth type="password" value={form.password} onChange={handleFormChange('password')} helperText="Enter password for new user" />
            )}
            <TextField label="Date of Birth" required fullWidth type="date" value={form.dateOfBirth} onChange={handleFormChange('dateOfBirth')} InputLabelProps={{ shrink: true }} />
            <FormControl fullWidth required>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select labelId="gender-label" label="Gender" value={form.gender} onChange={handleFormChange('gender')}>
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Aadhaar Number"
              required
              fullWidth
              value={form.adharNumber}
              onChange={handleFormChange('adharNumber')}
              disabled={!!selectedAdhar}
              inputProps={{ maxLength: 12 }}
            />
            <TextField label="Contact Number" fullWidth value={form.contactNumber} onChange={handleFormChange('contactNumber')} />
            <TextField label="Address" fullWidth multiline rows={2} value={form.address} onChange={handleFormChange('address')} />
            <TextField label="Zipcode" fullWidth type="number" value={form.zipcode} onChange={handleFormChange('zipcode')} />
            <Stack direction="row" spacing={2}>
              <TextField label="Latitude" fullWidth type="number" inputProps={{ step: "any" }} value={form.lat} onChange={handleFormChange('lat')} />
              <TextField label="Longitude" fullWidth type="number" inputProps={{ step: "any" }} value={form.lon} onChange={handleFormChange('lon')} />
            </Stack>
            <TextField label="Nominee" fullWidth value={form.nominee} onChange={handleFormChange('nominee')} />
            <TextField label="Nominee Aadhaar Number" fullWidth inputProps={{ maxLength: 12 }} value={form.nomineeAdharNumber} onChange={handleFormChange('nomineeAdharNumber')} />
            <FormControl fullWidth>
              <InputLabel id="insurance-plans-label">Insurance Plans</InputLabel>
              <Select
                labelId="insurance-plans-label"
                multiple
                value={form.insurancePlans}
                onChange={handleInsurancePlansChange}
                label="Insurance Plans"
                renderValue={(selected) => selected.join(', ')}
              >
                {insurancePlans.map(plan => (
                  <MenuItem key={plan.title} value={plan.title}>
                    {plan.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Status" required fullWidth value={form.status} onChange={handleFormChange('status')} placeholder="e.g. Active, Pending, Inactive" />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained" sx={{ background: richGradient, '&:hover': { backgroundColor: doctorColor } }}>
            {saving ? <CircularProgress size={22} /> : (selectedAdhar ? 'Update Customer' : 'Add Customer')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation popover */}
      <Popover
        open={deletePopoverOpen}
        anchorReference="anchorPosition"
        anchorPosition={deletePopoverPos || { top: 0, left: 0 }}
        onClose={handleDeleteCancel}
        PaperProps={{ sx: { p: 2, maxWidth: 320 } }}
      >
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete customer with Aadhaar <strong>{deleteTargetAdhar}</strong>?
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={handleDeleteCancel}>Cancel</Button>
          <Button size="small" color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </Stack>
      </Popover>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
