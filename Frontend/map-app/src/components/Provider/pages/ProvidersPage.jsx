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
import CancelIcon from "@mui/icons-material/Cancel";
import BadgeIcon from "@mui/icons-material/Badge";

// Brand palette
const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

// API
const API_BASE = "http://localhost:9090";
export async function fetchDoctorById(id) {
  try {
    const res = await fetch(`${API_BASE}/doctors/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (e) {
    console.error("Error fetching doctor:", id, e);
    return null;
  }
}

export default function DashBoardPages() {
  const theme = useTheme();
  const CARD_WIDTH = 260;
  const CARD_HEIGHT = 175;

  const [doctorStats, setDoctorStats] = useState({
    totalDoctors: 0,
    available: 0,
    unavailable: 0,
    specializations: {},
  });

  const [loading, setLoading] = useState(true);

  const fetchConnectedDoctors = async (doctorIds) => {
    setLoading(true);
    try {
      const doctorPromises = doctorIds.map((id) => fetchDoctorById(id));
      const doctors = await Promise.all(doctorPromises);
      const validDoctors = doctors.filter((d) => d != null);

      const totalDoctors = validDoctors.length;
      const available = validDoctors.filter(
        (d) =>
          d.availabilityStatus &&
          d.availabilityStatus.toLowerCase() === "available"
      ).length;
      const unavailable = totalDoctors - available;

      const specializationCounts = {};
      validDoctors.forEach((d) => {
        if (d.specialization) {
          const spec = d.specialization.trim();
          specializationCounts[spec] = (specializationCounts[spec] || 0) + 1;
        }
      });

      setDoctorStats({
        totalDoctors,
        available,
        unavailable,
        specializations: specializationCounts,
      });
    } catch (err) {
      console.error("Error fetching connected doctors:", err);
      setDoctorStats({
        totalDoctors: 0,
        available: 0,
        unavailable: 0,
        specializations: {},
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const providerStr = localStorage.getItem("provider");
    if (!providerStr || providerStr.trim() === "") {
      setLoading(false);
      return;
    }
    try {
      const provider = JSON.parse(providerStr);
      const doctorIds = provider.docId || [];
      if (!Array.isArray(doctorIds) || doctorIds.length === 0) {
        setLoading(false);
        return;
      }
      fetchConnectedDoctors(doctorIds);
    } catch (err) {
      console.error("Error parsing provider JSON:", err);
      setLoading(false);
    }
  }, []);

  // STATS CARDS: USE richGradient and designated icons/colors
  const mainCardData = [
    {
      label: "Connected Doctors",
      value: doctorStats.totalDoctors,
      icon: <LocalHospitalIcon sx={{ color: doctorColor, fontSize: 40 }} />,
      accent: doctorColor,
    },
    {
      label: "Available Doctors",
      value: doctorStats.available,
      icon: <CheckCircleIcon sx={{ color: providerColor, fontSize: 40 }} />,
      accent: providerColor,
    },
    {
      label: "Unavailable Doctors",
      value: doctorStats.unavailable,
      icon: <CancelIcon sx={{ color: "#d32f2f", fontSize: 40 }} />,
      accent: "#d32f2f",
    },
  ];

  // SPECIALIZATIONS: USE SAME CARD SIZE & GRADIENT, unique icon color
  const specializationCards = Object.entries(doctorStats.specializations).map(
    ([specialization, count]) => ({
      label: specialization,
      value: count,
      icon: <BadgeIcon sx={{ color: doctorColor, fontSize: 36 }} />,
      accent: providerColor,
    })
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: theme.palette.mode === "dark"
  ? theme.palette.background.paper
  : richGradient, minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Connected Doctors Overview
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress sx={{ color: providerColor }} />
        </Box>
      )}

      <Grid container spacing={3} justifyContent="center">
        {mainCardData.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <Card
              sx={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                background: theme.palette.mode === "dark"
  ? theme.palette.background.paper
  : richGradient,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: 4,
                borderRadius: 3,
                transition: "transform 0.22s, box-shadow 0.22s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-7px) scale(1.03)",
                  boxShadow: 8,
                },
              }}
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
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    mb: 0.4,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  {loading ? <CircularProgress size={28} /> : card.value ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {specializationCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <Card
              sx={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                background: theme.palette.mode === "dark"
  ? theme.palette.background.paper
  : richGradient,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: 2,
                borderRadius: 3,
                mt: 2,
                transition: "transform 0.22s, box-shadow 0.22s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-7px) scale(1.03)",
                  boxShadow: 8,
                },
              }}
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
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mt: 0.3,
                    //color: "#fff",
                  }}
                >
                  {loading ? <CircularProgress size={22} /> : card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
