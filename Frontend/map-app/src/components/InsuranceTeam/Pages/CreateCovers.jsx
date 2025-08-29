// src/components/InsuranceTeam/CreatePlans.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Popover,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  fetchAllInsurancePlans,
  createInsurancePlan,
  updateInsurancePlanByTitle,
  deleteInsurancePlanByTitle,
} from '../../../api/insuranceTeam';

const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } catch {
    return isoString;
  }
};

export default function CreatePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search filter
  const [searchTitle, setSearchTitle] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPlanTitle, setEditPlanTitle] = useState(null); // Identifier

  // Popover state for delete confirmation
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState(null);
  const deletePopoverOpen = Boolean(deleteAnchorEl);

  // Form state for plan
  const [form, setForm] = useState({
    id: '',
    title: '',
    amount: '',
    validity: '',
    exclusion: '',
    covers: [],
  });

  // Form state for cover inputs
  const emptyCover = { coverId: '', coverName: '', description: '', coverAmount: '' };
  const [coverForm, setCoverForm] = useState(emptyCover);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    setLoading(true);
    setError('');
    try {
      const list = await fetchAllInsurancePlans();
      setPlans(list);
    } catch (e) {
      setError(e.message || 'Error loading insurance plans');
    } finally {
      setLoading(false);
    }
  }

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const openAddDialog = () => {
    clearForm();
    setEditPlanTitle(null);
    setDialogOpen(true);
  };

  const openEditDialog = (plan) => {
    setEditPlanTitle(plan.title);
    setForm({
      id: plan.id || '',
      title: plan.title || '',
      amount: plan.amount != null ? plan.amount.toString() : '',
      validity: plan.validity ? plan.validity.split('T')[0] : '',
      exclusion: plan.exclusion || '',
      covers: plan.covers ? plan.covers.map(c => ({
        coverId: c.coverId != null ? c.coverId.toString() : '',
        coverName: c.coverName || '',
        description: c.description || '',
        coverAmount: c.coverAmount || '',
      })) : [],
    });
    setCoverForm(emptyCover);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    clearForm();
    setError('');
  };

  const clearForm = () => {
    setForm({
      id: '',
      title: '',
      amount: '',
      validity: '',
      exclusion: '',
      covers: [],
    });
    setCoverForm(emptyCover);
  };

  const handleFormChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleCoverChange = (field) => (e) => {
    setCoverForm(c => ({ ...c, [field]: e.target.value }));
  };

  const addCover = () => {
    const { coverId, coverName } = coverForm;
    if (!coverId.trim() || !coverName.trim()) {
      setSnackbar({ open: true, message: 'Cover ID and Cover Name are required', severity: 'error' });
      return;
    }
    if (form.covers.some(c => c.coverId === coverId.trim())) {
      setSnackbar({ open: true, message: 'Cover ID must be unique', severity: 'error' });
      return;
    }
    setForm(f => ({
      ...f,
      covers: [...f.covers, {
        coverId: coverId.trim(),
        coverName: coverName.trim(),
        description: coverForm.description.trim(),
        coverAmount: coverForm.coverAmount.trim(),
      }]
    }));
    setCoverForm(emptyCover);
    setSnackbar({ open: true, message: 'Cover added', severity: 'success' });
  };

  const removeCover = (coverId) => {
    setForm(f => ({
      ...f,
      covers: f.covers.filter(c => c.coverId !== coverId),
    }));
    setSnackbar({ open: true, message: 'Cover removed', severity: 'info' });
  };

  const handleSave = async () => {
    const { title, amount, validity } = form;
    if (!title.trim()) {
      setSnackbar({ open: true, message: 'Title is required', severity: 'error' });
      return;
    }
    if (!amount.trim() || isNaN(amount)) {
      setSnackbar({ open: true, message: 'Amount must be a number', severity: 'error' });
      return;
    }
    if (!validity.trim()) {
      setSnackbar({ open: true, message: 'Validity date is required', severity: 'error' });
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        id: form.id || undefined,
        title: form.title.trim(),
        amount: parseInt(form.amount, 10),
        validity: new Date(form.validity).toISOString(),
        exclusion: form.exclusion.trim(),
        covers: form.covers.map(c => ({
          coverId: parseInt(c.coverId, 10),
          coverName: c.coverName,
          description: c.description,
          coverAmount: c.coverAmount,
        })),
      };

      if (editPlanTitle) {
        await updateInsurancePlanByTitle(editPlanTitle, payload);
        setSnackbar({ open: true, message: 'Insurance plan updated successfully', severity: 'success' });
      } else {
        await createInsurancePlan(payload);
        setSnackbar({ open: true, message: 'Insurance plan created successfully', severity: 'success' });
      }
      closeDialog();
      loadPlans();
    } catch (e) {
      setSnackbar({ open: true, message: e.message || 'Failed to save insurance plan', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Show popover for delete confirm
  const handleDeleteClick = (event, title) => {
    setDeleteAnchorEl(event.currentTarget);
    setDeleteTargetTitle(title);
  };

  // Confirm deletion in popover
  const handleDeleteConfirm = async () => {
    if (!deleteTargetTitle) return;
    setDeleteAnchorEl(null);
    try {
      await deleteInsurancePlanByTitle(deleteTargetTitle);
      setSnackbar({ open: true, message: 'Insurance plan deleted successfully', severity: 'success' });
      if (editPlanTitle === deleteTargetTitle) closeDialog();
      loadPlans();
    } catch (e) {
      setSnackbar({ open: true, message: e.message || 'Failed to delete insurance plan', severity: 'error' });
    } finally {
      setDeleteTargetTitle(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteAnchorEl(null);
    setDeleteTargetTitle(null);
  };

  const handleSnackbarClose = () => setSnackbar(s => ({ ...s, open: false }));

  const filteredPlans = plans.filter(plan =>
    plan.title?.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const paginatedPlans = filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        Insurance Plans Management
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search by Title"
        variant="outlined"
        value={searchTitle}
        onChange={e => setSearchTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: providerColor }} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small" aria-label="insurance-plans-table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: providerColor,
                  }}
                >
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Validity</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Covers</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Exclusion</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No insurance plans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPlans.map((plan) => (
                    <TableRow key={plan.title}>
                      <TableCell>{plan.id || '-'}</TableCell>
                      <TableCell>{plan.title}</TableCell>
                      <TableCell>{plan.amount != null ? plan.amount.toLocaleString() : '-'}</TableCell>
                      <TableCell>{formatDate(plan.validity)}</TableCell>
                      <TableCell>
                        {plan.covers && plan.covers.length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {plan.covers.map(c => (
                              <li key={c.coverId}>
                                <strong>{c.coverName}</strong>: {c.description} ({c.coverAmount})
                              </li>
                            ))}
                          </ul>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{plan.exclusion || '-'}</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton
                          aria-label="edit"
                          onClick={() => openEditDialog(plan)}
                          sx={{ color: doctorColor }}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => handleDeleteClick(e, plan.title)}
                          sx={{ color: 'red' }}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={filteredPlans.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

          {/* Add Plan button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              aria-label="Add Insurance Plan"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              sx={{
                background: richGradient,
                color: 'white',
                '&:hover': { background: doctorColor },
              }}
            >
              Add Insurance Plan
            </Button>
          </Box>
        </>
      )}

      {/* Dialog for Add/Edit Plan */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editPlanTitle ? `Edit Insurance Plan: ${editPlanTitle}` : 'Create New Insurance Plan'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>

            <TextField
              label="ID"
              value={form.id}
              onChange={handleFormChange('id')}
              fullWidth
              placeholder="Optional ID"
              disabled={!!editPlanTitle}
            />
            <TextField
              label="Title"
              value={form.title}
              onChange={handleFormChange('title')}
              fullWidth
              required
              disabled={!!editPlanTitle} // title used as unique id - disallow edit
            />
            <TextField
              label="Amount"
              type="number"
              inputProps={{ min: 0 }}
              value={form.amount}
              onChange={handleFormChange('amount')}
              fullWidth
              required
            />
            <TextField
              label="Validity"
              type="date"
              value={form.validity}
              onChange={handleFormChange('validity')}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Exclusion"
              value={form.exclusion}
              onChange={handleFormChange('exclusion')}
              fullWidth
              multiline
              rows={2}
              placeholder="Optional exclusions, comma-separated or description..."
            />

            {/* Covers Section */}
            <Typography variant="h6" sx={{ mt: 3 }}>Covers</Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mb={2}>
              <TextField
                label="Cover ID"
                value={coverForm.coverId}
                onChange={handleCoverChange('coverId')}
                type="number"
                inputProps={{ min: 0 }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Cover Name"
                value={coverForm.coverName}
                onChange={handleCoverChange('coverName')}
                sx={{ flex: 3 }}
              />
              <TextField
                label="Description"
                value={coverForm.description}
                onChange={handleCoverChange('description')}
                sx={{ flex: 5 }}
              />
              <TextField
                label="Cover Amount"
                value={coverForm.coverAmount}
                onChange={handleCoverChange('coverAmount')}
                sx={{ flex: 2 }}
              />
              <Button
                variant="contained"
                onClick={addCover}
                sx={{ alignSelf: 'center' }}
              >
                Add
              </Button>
            </Stack>

            {/* Covers List Table */}
            {form.covers.length === 0 ? (
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                No covers added yet.
              </Typography>
            ) : (
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Cover ID</TableCell>
                    <TableCell>Cover Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.covers.map((c) => (
                    <TableRow key={c.coverId}>
                      <TableCell>{c.coverId}</TableCell>
                      <TableCell>{c.coverName}</TableCell>
                      <TableCell>{c.description}</TableCell>
                      <TableCell>{c.coverAmount}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeCover(c.coverId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="contained"
            sx={{ background: richGradient, '&:hover': { background: doctorColor } }}
          >
            {saving ? <CircularProgress size={22} color="inherit" /> : editPlanTitle ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popover Delete Confirmation */}
      <Popover
        open={deletePopoverOpen}
        anchorEl={deleteAnchorEl}
        onClose={handleDeleteCancel}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: { p: 2, maxWidth: 300 } }}
      >
        <Typography sx={{ mb: 1 }}>
          Are you sure you want to delete <strong>{deleteTargetTitle}</strong>?
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" onClick={handleDeleteCancel}>Cancel</Button>
          <Button size="small" color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </Stack>
      </Popover>

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
