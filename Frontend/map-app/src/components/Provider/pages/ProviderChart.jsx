import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { fetchAllProvidersAdmin } from "../../../api/providersApi";

// Brand colors
const doctorColor = "#01988f";
const providerColor = "#294fab";

export default function ProviderChart() {
  const theme = useTheme();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInProviderId, setLoggedInProviderId] = useState(null);

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        const data = await fetchAllProvidersAdmin();
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setProviders(data);
      } catch (error) {
        console.error(error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();

    const pStr = localStorage.getItem("provider");
    if (pStr) {
      try {
        const p = JSON.parse(pStr);
        setLoggedInProviderId(p.id || p.hosId || null);
      } catch {}
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: providerColor }} />
      </Box>
    );
  }

  if (!providers.length) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        No providers found.
      </Typography>
    );
  }

  const data = providers.map((p) => ({
    name: p.hospitalName || p.id || "Unknown",
    rating: Number(p.rating) || 0,
    id: p.id || p.hosId,
  }));

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "60vh",
        bgcolor: theme.palette.background.default, // Uses theme (no manual background)
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: providerColor }}>
        Providers Rating Comparison
      </Typography>
      <Box sx={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 15, bottom: 48 }}
            barCategoryGap={10}
          >
            <CartesianGrid strokeDasharray="2 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={80}
              stroke={providerColor}
              tick={{ fill: providerColor, fontSize: 12 }}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              stroke={doctorColor}
              tick={{ fill: doctorColor, fontSize: 11 }}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 9000 }}
              contentStyle={{
                background: "#fff",
                border: `1px solid ${providerColor}`,
                color: providerColor,
                fontWeight: 500
              }}
              labelStyle={{ color: providerColor }}
              cursor={{ fill: "rgba(1,152,143,0.06)" }}
            />
            <Bar dataKey="rating" barSize={30} radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={
                    entry.id === loggedInProviderId
                      ? doctorColor
                      : providerColor
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
