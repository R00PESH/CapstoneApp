// src/components/UnifiedLoginPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  fetchProviderByIdAdmin,
} from '../api/providersApi';
// No doctor API import since Doctor tab is removed

const tabConfigs = [
  { label: "Hospital/Provider", value: "provider" },
  { label: "Insurance Team", value: "insurer" },
  { label: "Admin", value: "admin" },
];

export default function UnifiedLoginPage() {
  const [tab, setTab] = useState(0);
  const [input, setInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes for any field
  function handleInput(field, val) {
    setInput(prev => ({ ...prev, [field]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Provider/Hospital
      if (tab === 0) {
        const { hosId, hospitalName } = input;
        if (!hosId || !hospitalName) {
          setError("Both Hospital ID and Name are required.");
          setLoading(false);
          return;
        }
        const provider = await fetchProviderByIdAdmin(hosId);
        if (!provider) {
          setError("Provider not found.");
          setLoading(false);
          return;
        }
        if (
          provider.hospital_Name &&
          provider.hospital_Name.toLowerCase() !== hospitalName.trim().toLowerCase()
        ) {
          setError("Hospital name does not match.");
          setLoading(false);
          return;
        }
        localStorage.setItem('provider', JSON.stringify(provider));
        navigate('/Provider', { state: { provider } });
        return;
      }

      // Insurance Team
      if (tab === 1) {
        const { insurer_id, password } = input;
        if (!insurer_id || !password) {
          setError("Both Insurer ID and Password are required.");
          setLoading(false);
          return;
        }
        // Simply save input to localStorage without validation
        localStorage.setItem('insurer', JSON.stringify(input));
        navigate('/insurance', { state: { insurer: input } });
        return;
      }

      // Admin
      if (tab === 2) {
        const { id, password } = input;
        if (!id || !password) {
          setError("Both Admin ID and Password are required.");
          setLoading(false);
          return;
        }
        // Store raw input object as admin in localStorage directly
        localStorage.setItem('admin', JSON.stringify(input));
        navigate('/admin', { state: { admin: input } });
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Login error. Please check your info or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Render form fields based on selected tab
  function renderFields() {
    if (tab === 0) {
      return (
        <>
          <TextField
            required
            label="Hospital ID"
            fullWidth
            margin="normal"
            value={input.hosId || ""}
            onChange={e => handleInput('hosId', e.target.value)}
          />
          <TextField
            required
            label="Hospital Name"
            fullWidth
            margin="normal"
            value={input.hospitalName || ""}
            onChange={e => handleInput('hospitalName', e.target.value)}
          />
        </>
      );
    }
    if (tab === 1) {
      return (
        <>
          <TextField
            required
            label="Insurer ID"
            fullWidth
            margin="normal"
            value={input.insurer_id || ""}
            onChange={e => handleInput('insurer_id', e.target.value)}
          />
          <TextField
            required
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={input.password || ""}
            onChange={e => handleInput('password', e.target.value)}
          />
        </>
      );
    }
    if (tab === 2) {
      return (
        <>
          <TextField
            required
            label="Admin ID"
            fullWidth
            margin="normal"
            value={input.id || ""}
            onChange={e => handleInput('id', e.target.value)}
          />
          <TextField
            required
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={input.password || ""}
            onChange={e => handleInput('password', e.target.value)}
          />
        </>
      );
    }
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        width: { xs: '100vw', sm: 470 },
        p: { xs: 1, sm: 4 }
      }}>
        <Box
          sx={{
            background: 'rgba(255,255,255,0.18)',
            borderRadius: 5,
            boxShadow: '0 8px 40px 0 rgba(30,60,120,0.30)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            p: { xs: 2, sm: 4 }
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: '#fff', fontWeight: 700, textShadow: '0 2px 14px #1976d2', mb: 1 }}
          >
            Unified Team Login
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setInput({}); setError(''); }}
            centered
            sx={{
              '& .MuiTab-root': { color: '#fff', fontWeight: 600, fontSize: '1rem' },
              '& .Mui-selected': { color: '#fff', textShadow: '0 2px 8px #1976d2' },
              mb: 2,
            }}
          >
            {tabConfigs.map((t) => <Tab key={t.value} label={t.label} />)}
          </Tabs>
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={1.5}>
              {renderFields()}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ fontWeight: 700, fontSize: '1.08rem', py: 1, borderRadius: 3, letterSpacing: 0.5 }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(10,30,80,0.55)',
        zIndex: 1,
      }} />
    </Box>
  );
}
