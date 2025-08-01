// src/components/InsurancePage.jsx
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
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import {
  fetchAllInsurancePlans,
  fetchAllInsurerCustomers,
} from "../../../api/insuranceTeam"; // Adjust import path as needed


// Brand palette based on your ProvidersPage colors
const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

export default function InsurancePage() {
  const theme = useTheme();
  const CARD_WIDTH = 260;
  const CARD_HEIGHT = 175;

  const [insurancePlans, setInsurancePlans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plans, customers] = await Promise.all([
          fetchAllInsurancePlans(),
          fetchAllInsurerCustomers(),
        ]);
        setInsurancePlans(plans);
        setCustomers(customers);
      } catch (err) {
        console.error("Error loading insurance data:", err);
        setInsurancePlans([]);
        setCustomers([]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Calculate customer status counts (assuming customer.status exists)
  const statusCounts = {
    active: 0,
    inactive: 0,
    pending: 0,
  };
  customers.forEach((c) => {
    const stat = (c.status || "").toLowerCase();
    if (stat === "active") statusCounts.active++;
    else if (stat === "inactive") statusCounts.inactive++;
    else if (stat === "pending") statusCounts.pending++;
  });

  // Cards for overall main data: insurance plans & customers count
  const mainCardData = [
    {
      label: "Insurance Plans",
      value: insurancePlans.length,
      icon: <AssignmentIcon sx={{ color: doctorColor, fontSize: 40 }} />,
      accent: doctorColor,
    },
    {
      label: "Total Customers",
      value: customers.length,
      icon: <PeopleIcon sx={{ color: providerColor, fontSize: 40 }} />,
      accent: providerColor,
    },
  ];

  // Customer status cards
  const customerStatusCards = [
    {
      label: "Active Customers",
      value: statusCounts.active,
      icon: <CheckCircleIcon sx={{ color: doctorColor, fontSize: 36 }} />,
      accent: doctorColor,
    },
    {
      label: "Inactive Customers",
      value: statusCounts.inactive,
      icon: <CancelIcon sx={{ color: "#d32f2f", fontSize: 36 }} />,
      accent: "#d32f2f",
    },
    {
      label: "Pending Customers",
      value: statusCounts.pending,
      icon: <HourglassEmptyIcon sx={{ color: providerColor, fontSize: 36 }} />,
      accent: providerColor,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : richGradient,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
        Insurance Dashboard Overview
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
                background:
                  theme.palette.mode === "dark"
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
                    color: "#fff",
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

        {customerStatusCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <Card
              sx={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                background:
                  theme.palette.mode === "dark"
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
                    color: "#fff",
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mt: 0.3,
                    color: "#fff",
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
