import React, { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  fetchAllDoctors,
  fetchAllProviders,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../../api/admin";

const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57caff 67%, #234fab)";
const doctorColor = "#01988f";

function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  } catch {
    return isoString;
  }
}

export default function CreateDoctors() {
  // State for doctors list
  const [doctors, setDoctors] = useState([]);
  // State for hospital providers to populate hospital dropdown
  const [providers, setProviders] = useState([]);
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Snackbar notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Dialog open/close state & selected doctor id (for edit)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  // Delete confirmation dialog state and target id
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteDoctorId, setToDeleteDoctorId] = useState(null);

  // Doctor form state
  const [form, setForm] = useState({
    id: "",
    docId: "",
    hosId: "",
    name: "",
    licenseNumber: "",
    qualification: "",
    specialization: "",
    yearsOfPractice: "",
    availabilityStatus: "",
    joiningDate: "",
    reviews: [],
    rating: "",
  });

  // Review form state
  const [newReview, setNewReview] = useState({
    customerName: "",
    customerEmail: "",
    rating: "",
    comment: "",
  });

  // Load doctors and providers on mount
  useEffect(() => {
    loadDoctors();
    loadProviders();
  }, []);

  async function loadDoctors() {
    setLoading(true);
    setError("");
    try {
      const list = await fetchAllDoctors();
      setDoctors(list);
    } catch (e) {
      setError(e.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }

  async function loadProviders() {
    try {
      const list = await fetchAllProviders();
      setProviders(list);
    } catch {
      setProviders([]);
    }
  }

  // Pagination handlers
  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Open add doctor dialog
  const openAddDialog = () => {
    setSelectedDoctorId(null);
    clearForm();
    setDialogOpen(true);
  };

  // Open edit dialog with pre-filled doctor data
  const openEditDialog = (doctor) => {
    setSelectedDoctorId(doctor.docId || doctor.id || doctor._id);
    setForm({
      id: doctor.id || "",
      docId: doctor.docId || "",
      hosId: doctor.hosId || "",
      name: doctor.name || "",
      licenseNumber: doctor.licenseNumber || "",
      qualification: doctor.qualification || "",
      specialization: doctor.specialization || "",
      yearsOfPractice: doctor.yearsOfPractice?.toString() || "",
      availabilityStatus: doctor.availabilityStatus || "",
      joiningDate: doctor.joiningDate ? doctor.joiningDate.substring(0, 10) : "",
      reviews: doctor.reviews || [],
      rating: doctor.rating?.toString() || "",
    });
    setNewReview({ customerName: "", customerEmail: "", rating: "", comment: "" });
    setDialogOpen(true);
  };

  function clearForm() {
    setForm({
      id: "",
      docId: "",
      hosId: "",
      name: "",
      licenseNumber: "",
      qualification: "",
      specialization: "",
      yearsOfPractice: "",
      availabilityStatus: "",
      joiningDate: "",
      reviews: [],
      rating: "",
    });
    setError("");
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedDoctorId(null);
    clearForm();
    setNewReview({ customerName: "", customerEmail: "", rating: "", comment: "" });
  }

  // Input change handlers
  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNewReviewChange = (field) => (e) => {
    setNewReview((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Add a review to the current doctor's reviews list
  const addReview = () => {
    const { customerName, customerEmail, rating, comment } = newReview;
    if (!customerName || !customerEmail || !rating || !comment) {
      setSnackbar({
        open: true,
        message: "All review fields are required",
        severity: "error",
      });
      return;
    }
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      setSnackbar({
        open: true,
        message: "Rating must be between 0 and 5",
        severity: "error",
      });
      return;
    }

    const reviewObj = {
      customerName,
      customerEmail,
      rating: parsedRating,
      comment,
      date: new Date().toISOString(),
    };

    setForm((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), reviewObj],
    }));

    setNewReview({ customerName: "", customerEmail: "", rating: "", comment: "" });
    setSnackbar({ open: true, message: "Review added", severity: "success" });
  };

  // Save doctor (create or update)
  async function handleSave() {
    const { docId, hosId, name, licenseNumber, qualification, specialization, yearsOfPractice, availabilityStatus, joiningDate, rating } = form;

    if (!docId.trim()) {
      setSnackbar({ open: true, message: "Doctor ID is required", severity: "error" });
      return;
    }
    if (!name.trim()) {
      setSnackbar({ open: true, message: "Doctor Name is required", severity: "error" });
      return;
    }
    if (!hosId.trim()) {
      setSnackbar({ open: true, message: "Hospital ID is required", severity: "error" });
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        id: form.id || undefined,
        docId: docId.trim(),
        hosId: hosId.trim(),
        name: name.trim(),
        licenseNumber: licenseNumber.trim() || undefined,
        qualification: qualification.trim() || undefined,
        specialization: specialization.trim() || undefined,
        yearsOfPractice: yearsOfPractice ? parseFloat(yearsOfPractice) : 0,
        availabilityStatus: availabilityStatus.trim(),
        joiningDate: joiningDate ? new Date(joiningDate).toISOString() : undefined,
        reviews: form.reviews || [],
        rating: rating ? parseFloat(rating) : 0,
      };

      if (selectedDoctorId) {
        await updateDoctor(selectedDoctorId, payload);
        setSnackbar({ open: true, message: "Doctor updated successfully", severity: "success" });
      } else {
        await createDoctor(payload);
        setSnackbar({ open: true, message: "Doctor created successfully", severity: "success" });
      }
      closeDialog();
      loadDoctors();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to save doctor", severity: "error" });
    } finally {
      setSaving(false);
    }
  }

  // Delete handlers
  const handleDeleteClick = (docId) => {
    setDeleteDialogOpen(true);
    setToDeleteDoctorId(docId);
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    if (!toDeleteDoctorId) return;
    try {
      await deleteDoctor(toDeleteDoctorId);
      setSnackbar({ open: true, message: "Doctor deleted successfully", severity: "success" });
      if (selectedDoctorId === toDeleteDoctorId) {
        closeDialog();
      }
      loadDoctors();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to delete doctor", severity: "error" });
    }
    setToDeleteDoctorId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Pagination slice
  const paginatedDoctors = doctors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, position: "relative" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          background: richGradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Doctors Management
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: doctorColor }} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader aria-label="doctors-table">
              <TableHead>
                <TableRow sx={{ backgroundColor: doctorColor }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Doctor ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hospital ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Specialization</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Qualification</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Years of Practice</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Availability</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rating</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No doctors found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDoctors.map((doc) => (
                    <TableRow key={doc.docId || doc.id || doc._id}>
                      <TableCell>{doc.docId || doc.id}</TableCell>
                      <TableCell>{doc.hosId}</TableCell>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>{doc.specialization}</TableCell>
                      <TableCell>{doc.qualification}</TableCell>
                      <TableCell>{doc.yearsOfPractice || doc.yearsOfExp}</TableCell>
                      <TableCell>{doc.availabilityStatus}</TableCell>
                      <TableCell>{doc.rating?.toFixed(1) || 0}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => openEditDialog(doc)}
                          size="small"
                          sx={{ color: doctorColor }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(doc.docId || doc.id)}
                          size="small"
                          sx={{ color: "red" }}
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
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={doctors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              sx={{
                background: richGradient,
                color: "white",
                "&:hover": { backgroundColor: doctorColor },
              }}
            >
              Add Doctor
            </Button>
          </Box>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDoctorId ? `Edit Doctor: ${form.docId}` : "Register New Doctor"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Doctor ID"
              value={form.docId}
              onChange={handleFormChange("docId")}
              fullWidth
              required
              disabled={!!selectedDoctorId} // disable editing docId when editing
            />
            <FormControl fullWidth required>
              <InputLabel id="hos-select-label">Hospital</InputLabel>
              <Select
                labelId="hos-select-label"
                value={form.hosId || ""}
                label="Hospital"
                onChange={handleFormChange("hosId")}
              >
                {providers.map((p) => (
                  <MenuItem key={p.hosId} value={p.hosId}>
                    {p.hosId} - {p.hospitalName || p.Hospital_Name || ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Name"
              value={form.name}
              onChange={handleFormChange("name")}
              fullWidth
              required
            />
            <TextField
              label="License Number"
              value={form.licenseNumber}
              onChange={handleFormChange("licenseNumber")}
              fullWidth
            />
            <TextField
              label="Qualification"
              value={form.qualification}
              onChange={handleFormChange("qualification")}
              fullWidth
            />
            <TextField
              label="Specialization"
              value={form.specialization}
              onChange={handleFormChange("specialization")}
              fullWidth
            />
            <TextField
              label="Years of Practice"
              type="number"
              value={form.yearsOfPractice}
              onChange={handleFormChange("yearsOfPractice")}
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />
            <TextField
              label="Availability"
              value={form.availabilityStatus}
              onChange={handleFormChange("availabilityStatus")}
              fullWidth
              required
            />
            <TextField
              label="Joining Date"
              type="date"
              value={form.joiningDate}
              onChange={handleFormChange("joiningDate")}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Rating"
              type="number"
              value={form.rating}
              onChange={handleFormChange("rating")}
              fullWidth
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />

            {/* Reviews Table */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Reviews
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: doctorColor }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rating</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Comment</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.reviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No reviews found
                      </TableCell>
                    </TableRow>
                  ) : (
                    form.reviews.map((rv, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{rv.customerName || rv.customername}</TableCell>
                        <TableCell>{rv.customerEmail || rv.customeremail}</TableCell>
                        <TableCell>{rv.rating}</TableCell>
                        <TableCell>{rv.comment || ""}</TableCell>
                        <TableCell>{formatDate(rv.date)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add Review Inputs */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Add Review
            </Typography>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <TextField
                label="Customer Name"
                value={newReview.customerName}
                onChange={handleNewReviewChange("customerName")}
                fullWidth
              />
              <TextField
                label="Customer Email"
                value={newReview.customerEmail}
                onChange={handleNewReviewChange("customerEmail")}
                fullWidth
                type="email"
              />
            </Stack>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ mt: 1 }}>
              <TextField
                label="Rating"
                type="number"
                value={newReview.rating}
                onChange={handleNewReviewChange("rating")}
                fullWidth
                inputProps={{ min: 0, max: 5, step: 0.1 }}
              />
              <TextField
                label="Comment"
                value={newReview.comment}
                onChange={handleNewReviewChange("comment")}
                fullWidth
              />
            </Stack>
            <Box mt={1}>
              <Button
                variant="contained"
                size="small"
                onClick={addReview}
                sx={{ backgroundColor: doctorColor, color: "white", "&:hover": { background: richGradient } }}
              >
                Add Review
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="contained"
            sx={{ background: richGradient, color: "white" }}
          >
            {saving ? <CircularProgress size={22} color="inherit" /> : selectedDoctorId ? "Update Doctor" : "Register Doctor"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Do you really want to delete this doctor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
