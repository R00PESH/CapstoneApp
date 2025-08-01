import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Avatar,
  Rating, Chip, Stack, CircularProgress, useTheme,
  Popover, ButtonBase, FormControlLabel, Tooltip, Switch
} from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { fetchInsurancePlanByTitle } from "../../../api/insuranceTeam";
import { updateProvider } from "../../../api/providersApi";

// COLORS ONLY FROM YOUR REQUIREMENT
const richGradient = "linear-gradient(135deg, #00c3ad 0%, #57aaff 67%, #234ba2 100%)";
const doctorColor = "#01988f";
const providerColor = "#294fab";

// Toggle styled
const ColoredSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 2,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": { backgroundColor: providerColor, opacity: 1 },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px rgb(0 35 11 / 0.2)", width: 24, height: 24,
  },
  "& .MuiSwitch-track": {
    borderRadius: 15,
    backgroundColor: doctorColor,
    opacity: 1,
    transition: theme.transitions.create(["background-color"], { duration: 500 }),
  },
}));

export default function ProviderReviewsAndPlans() {
  const theme = useTheme();
  const cardDims = { width: 340, height: 190 };

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [popover, setPopover] = useState({ anchorEl: null, data: null, type: null });
  const [activityStatus, setActivityStatus] = useState("Available");
  const [isUpdating, setIsUpdating] = useState(false);

  // Data init
  useEffect(() => {
    const stored = localStorage.getItem("provider");
    if (!stored) {
      setLoading(false); setPlansLoading(false);
      return;
    }
    try {
      const prov = JSON.parse(stored);
      setProvider(prov);
      setReviews(prov.reviews || []);
      setActivityStatus(prov.activeStatus || prov.activityStatus || "Available");
      const plansList = prov.insurancePlans || prov.insurance_Plans || [];
      if (plansList.length > 0) {
        setPlansLoading(true);
        Promise.all(plansList.map((title) => fetchInsurancePlanByTitle(title)))
          .then((plans) => {
            setInsurancePlans(plans.filter(Boolean));
            setPlansLoading(false); setLoading(false);
          })
          .catch(() => { setInsurancePlans([]); setPlansLoading(false); setLoading(false); });
      } else { setInsurancePlans([]); setPlansLoading(false); setLoading(false);}
    } catch { setLoading(false); setPlansLoading(false);}
  }, []);

  // Status toggle
  const handleUpdateStatus = async (newStatus) => {
    if (!provider?.hosId || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateProvider(provider.hosId, { activeStatus: newStatus });
      setActivityStatus(newStatus);
      setProvider((p) => ({ ...p, activeStatus: newStatus }));
    } catch (error) { console.error("Failed to update provider status", error); }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 5, display: "flex", justifyContent: "center", minHeight: "70vh" }}>
        <CircularProgress sx={{ color: providerColor }} />
      </Box>
    );
  }
  if (!provider) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">Provider information not found.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{
      p: { xs: 2, md: 5 },
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: 6,
      // bgcolor: "#f7fafc",
    }}>
      {/* Reviews SECTION */}
      <Box sx={{ flex: 1, maxWidth: 520, minWidth: 320 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <StarIcon sx={{ color: "#fbc02d", fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: doctorColor }}>Reviews</Typography>
        </Stack>
        <Stack spacing={3}>
          {reviews.length === 0 ? (
            <Typography color="text.secondary">No reviews available.</Typography>
          ) : (reviews.map((review, idx) => (
            <ButtonBase
              key={review.customerEmail || idx}
              sx={{ 
                width: cardDims.width,
                 borderRadius: 3
                 }}
              onClick={(e) => setPopover({ anchorEl: e.currentTarget, data: review, type: "review" })}
            >
              <Card sx={{
                height:cardDims.height,
                minHeight: 120,
                borderRadius: 3,
                background: richGradient,
                color: "#fff",
                display: "flex", flexDirection: "column", justifyContent: "center",
                boxShadow: theme.shadows[3],
                "&:hover": {
                  boxShadow: theme.shadows[7],
                  background: "linear-gradient(135deg, #00b099 0%, #4a97ff 67%, #1e3f99 100%)"
                },
              }}>
                <CardContent sx={{ pb: "5px!important" }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Avatar sx={{ bgcolor: doctorColor, width: 42, height: 42, fontWeight: "bold", fontSize: 18 }}>
                      {(review.customerName || "U").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {review.customerName || "Anonymous"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#f8ffe5" }}>
                        {new Date(review.review_given_time).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box ml="auto">
                      <Rating value={review.rating} precision={0.5} readOnly size="medium" sx={{ color: "#fbc02d" }} />
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{
                    mb: 1, height: 40, overflow: "hidden", textOverflow: "ellipsis", color: "#e6f2ff"
                  }}>
                    {review.review}
                  </Typography>
                  {review.customerEmail && (
                    <Chip
                      label={review.customerEmail}
                      icon={<VerifiedUserIcon />}
                      size="small"
                      sx={{
                        fontWeight: 600, fontSize: "0.75rem",
                        bgcolor: "#fff", color: doctorColor,
                        mt: 1,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </ButtonBase>
          )))}
        </Stack>
      </Box>

      {/* INSURANCE Section: header with TOGGLE */}
      <Box sx={{ flex: 1, maxWidth: 540, minWidth: 320 }}>
        {/* header & toggle in a row, sectioned above the cards */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: providerColor }}>
            Insurance Plans
          </Typography>
          <Tooltip title="Toggle provider status">
            <FormControlLabel
              control={
                <ColoredSwitch
                  checked={activityStatus === "Available"}
                  onChange={(e) => {
                    const newStatus = e.target.checked ? "Available" : "unAvailable";
                    handleUpdateStatus(newStatus);
                  }}
                  disabled={isUpdating}
                  inputProps={{ "aria-label": "provider activity status toggle" }}
                />
              }
              label={activityStatus === "Available" ? "Available" : "unAvailable"}
              labelPlacement="start"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontWeight: 600,
                  color: activityStatus === "Available" ? providerColor : doctorColor,
                }
              }}
            />
          </Tooltip>
        </Stack>
        {/* Insurance cards - vertical stack, gap as in your image */}
        {plansLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : insurancePlans.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No insurance plans found.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {insurancePlans.map((plan, idx) => (
              <ButtonBase
                key={plan.id ?? plan.title ?? idx}
                sx={{ width: cardDims.width, borderRadius: 3 }}
                onClick={e => setPopover({ anchorEl: e.currentTarget, data: plan, type: "plan" })}
              >
                <Card
                  sx={{
                    ...cardDims,
                    minHeight: 110,
                    borderRadius: 3,
                    boxShadow: theme.shadows[2],
                    background: richGradient,
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    "&:hover": {
                      boxShadow: theme.shadows[8],
                      background: "linear-gradient(110deg, #294fab 0%, #02a59c 100%)",
                    },
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", mb: 0.5 }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Policy:</strong> {plan.amount ?? plan.policy ?? "—"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Validity:</strong> {plan.validity
                        ? new Date(plan.validity).toLocaleDateString(undefined, {
                          year: "numeric", month: "short", day: "numeric"
                        }) : "—"}
                    </Typography>
                    {/* If you want the three dot avatars as in your design: */}
                    <Box sx={{ pt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      
                      {/* Covers */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {plan.covers && plan.covers.length > 0 ? (
                          plan.covers.map((cover, cidx) => (
                            <Chip
                              size="small"
                              key={cover.cover_id ?? cover.cover_name ?? cidx}
                              label={cover.cover_name}
                              sx={{
                                bgcolor: "#fff",
                                color: providerColor,
                                fontWeight: 500,
                              }}
                            />
                          ))
                        ) : (
                          <Chip size="small" label="No covers" sx={{ bgcolor: "#fff", color: providerColor }} />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </ButtonBase>
            ))}
          </Stack>
        )}
      </Box>

      {/* Popover for detail view */}
      <Popover
        open={!!popover.data}
        anchorEl={popover.anchorEl}
        onClose={() => setPopover({ anchorEl: null, data: null, type: null })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: { minWidth: 300, maxWidth: 400, p: 2 } }}
      >
        {popover.type === "plan" && popover.data && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: providerColor }}>
              {popover.data.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Policy Amount:</strong> {popover.data.amount ?? popover.data.policy ?? "—"}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Validity:</strong>{" "}
              {popover.data.validity
                ? new Date(popover.data.validity).toLocaleDateString(undefined, {
                  year: "numeric", month: "short", day: "numeric"
                }) : "—"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Covers:
            </Typography>
            {Array.isArray(popover.data.covers) && popover.data.covers.length > 0 ? (
              <Box component="ul" sx={{ pl: 2, m: 0, mb: 1 }}>
                {popover.data.covers.map((cover) => (
                  <Typography
                    key={cover.cover_id ?? cover.cover_name}
                    component="li"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    <strong>{cover.cover_name}</strong>: {cover.description} <em>({cover.cover_amount})</em>
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mb: 1 }}>
                No covers info
              </Typography>
            )}
            {popover.data.exclusion && (
              <>
                <Typography variant="body2" sx={{ color: theme.palette.error.main, fontWeight: 700 }}>
                  Exclusions:
                </Typography>
                <Typography variant="body2">{popover.data.exclusion}</Typography>
              </>
            )}
          </Box>
        )}
        {popover.type === "review" && popover.data && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <Avatar sx={{ bgcolor: doctorColor, width: 42, height: 42, fontWeight: 700, fontSize: 18 }}>
                {(popover.data.customerName || "U").charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: providerColor }}>
                  {popover.data.customerName || "Anonymous"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#444" }}>
                  {new Date(popover.data.review_given_time).toLocaleDateString(undefined, {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </Typography>
              </Box>
              <Box ml="auto">
                <Rating value={popover.data.rating} precision={0.5} readOnly size="medium" sx={{ color: "#fbc02d" }} />
              </Box>
            </Stack>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {popover.data.review}
            </Typography>
            {popover.data.customerEmail && (
              <Chip
                label={popover.data.customerEmail}
                icon={<VerifiedUserIcon />}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  bgcolor: "#e3f1fd",
                  color: providerColor,
                }}
              />
            )}
          </Box>
        )}
      </Popover>
    </Box>
    </ThemeProvider>
  );
}
