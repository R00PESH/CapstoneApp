// src/components/Admin/AdminDashBoard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import ApartmentIcon from "@mui/icons-material/Apartment";

import { fetchAllDoctors, fetchAllProviders } from "../../../api/admin"; // Adjust path accordingly

// Colors & gradient
const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";
const availableColor = "#4caf50";

export default function AdminPage() {
  const theme = useTheme();
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 175;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProviders: 0,
    availableProviders: 0,
    totalDoctors: 0,
    availableDoctors: 0,
    combinedSpecializationsCount: 0,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const providers = await fetchAllProviders();
        const doctors = await fetchAllDoctors();

        const availableProviders = providers.filter(
          (p) => p.availabilityStatus?.toLowerCase() === "available"
        ).length;

        const availableDoctors = doctors.filter(
          (d) => d.availabilityStatus?.toLowerCase() === "available"
        ).length;

        // Combine specializations from both providers and doctors, count unique specializations
        const specSet = new Set();
        providers.forEach((p) => p.speciality && specSet.add(p.speciality.trim()));
        doctors.forEach((d) => d.specialization && specSet.add(d.specialization.trim()));

        setStats({
          totalProviders: providers.length,
          availableProviders,
          totalDoctors: doctors.length,
          availableDoctors,
          combinedSpecializationsCount: specSet.size,
        });
      } catch (err) {
        console.error("Error loading data:", err);
        setStats({
          totalProviders: 0,
          availableProviders: 0,
          totalDoctors: 0,
          availableDoctors: 0,
          combinedSpecializationsCount: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cardData = [
    {
      label: "Total Hospitals",
      value: stats.totalProviders,
      icon: <ApartmentIcon sx={{ color: providerColor, fontSize: 40 }} />,
      accent: providerColor,
    },
    {
      label: "Available Hospitals",
      value: stats.availableProviders,
      icon: <CheckCircleIcon sx={{ color: availableColor, fontSize: 40 }} />,
      accent: availableColor,
    },
    {
      label: "Total Doctors",
      value: stats.totalDoctors,
      icon: <LocalHospitalIcon sx={{ color: doctorColor, fontSize: 40 }} />,
      accent: doctorColor,
    },
    {
      label: "Available Doctors",
      value: stats.availableDoctors,
      icon: <CheckCircleIcon sx={{ color: availableColor, fontSize: 40 }} />,
      accent: availableColor,
    },
    {
      label: "Total Specializations",
      value: stats.combinedSpecializationsCount,
      icon: <AccessibilityNewIcon sx={{ color: "#8e24aa", fontSize: 40 }} />,
      accent: "#8e24aa",
    },
  ];

  const renderCard = (card) => (
    <Card
      sx={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        background: theme.palette.mode === "dark" ? theme.palette.background.paper : richGradient,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: 4,
        borderRadius: 3,
        transition: "transform 0.22s, box-shadow 0.22s",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-7px) scale(1.03)",
          boxShadow: 8,
        },
      }}
      key={card.label}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          p: 2,
        }}
      >
        {card.icon}
        <Typography variant="h6" sx={{ mt: 1, mb: 0.4, fontWeight: 500, textAlign: "center" }}>
          {card.label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", color: "#fff" }}>
          {loading ? <CircularProgress size={28} sx={{ color: card.accent }} /> : card.value ?? 0}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: theme.palette.mode === "dark" ? theme.palette.background.default : richGradient,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Admin Dashboard Summary
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            {renderCard(card)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
