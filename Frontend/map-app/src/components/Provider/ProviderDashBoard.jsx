import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import PaidIcon from '@mui/icons-material/Paid';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

import ProviderReviews from './pages/ProviderRewiews';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import Popover from '@mui/material/Popover';
import ProvidersPage from './pages/ProvidersPage';
import Handshake from '@mui/icons-material/Handshake';
import ProviderChart from './pages/ProviderChart';

import { ThemeProvider } from '@mui/material/styles';
import theme from '../Theme'; // Adjust path as needed
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
// Define placeholders for all the pages used in DemoPageContent
function DashBoardPages() {
  return <div style={{ padding: 20 }}>Provider Dashboard Home Page</div>;
}
function Cashless() {
  return <div style={{ padding: 20 }}>Cashless Page</div>;
}
function CashlessStatsPage() {
  return <div style={{ padding: 20 }}>Cashless Stats Page</div>;
}
function DefaultPage() {
  return <div style={{ padding: 20 }}>Page Not Found</div>;
}

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'review', title: 'Reviews', icon: <CreditCardOffIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Analytics' },
  {
    segment: 'reports',
    title: 'Stats',
    icon: <BarChartIcon />,
    children: [
      { segment: 'cashlessstats', title: 'Status', icon: <DescriptionIcon /> }
    ],
  },
];

function stringAvatar(name) {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0][0].toUpperCase();
  return `${names[0][0]}${names[1][0]}`.toUpperCase();
}

function DemoPageContent({ pathname }) {
  switch (pathname) {
    case '/dashboard':
      return <ProvidersPage />;
    case '/review':
      return <ProviderReviews />;
    case '/reports/cashlessstats':
      return <ProviderChart />;
    default:
      return <DefaultPage />;
  }
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const BrandLogo = () => (
  <HealthAndSafetyIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
);

function ProviderDashboard() {
  const router = useDemoRouter('/dashboard');

  // Load provider info from localStorage or fallback
  const [provider, setProvider] = React.useState(() => {
    const pStr = localStorage.getItem('provider');
    let p = pStr ? JSON.parse(pStr) : null;
    if (!p) {
      p = {
        hospitalName: 'Unknown Provider',
        email: 'unknown@provider.com',
        address: '',
        avatar: '',
      };
    }
    return p;
  });

  const [avatar, setAvatar] = React.useState(() => {
    return provider.avatar || localStorage.getItem('profile_avatar') || '';
  });

  React.useEffect(() => {
    const handleStorage = () => {
      const pStr = localStorage.getItem('provider');
      if (pStr) setProvider(JSON.parse(pStr));
      const avatarStorage = localStorage.getItem('profile_avatar');
      if (avatarStorage) setAvatar(avatarStorage);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarData = e.target.result;
      setAvatar(avatarData);
      const updatedProvider = { ...provider, avatar: avatarData };
      setProvider(updatedProvider);
      localStorage.setItem('provider', JSON.stringify(updatedProvider));
      localStorage.setItem('profile_avatar', avatarData);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const updatedProvider = { ...provider };
    delete updatedProvider.avatar;
    setProvider(updatedProvider);
    setAvatar('');
    localStorage.setItem('provider', JSON.stringify(updatedProvider));
    localStorage.removeItem('profile_avatar');
  };

  const handleLogout = () => {
    localStorage.removeItem('provider');
    localStorage.removeItem('profile_avatar');
    window.location.href = '/official';
  };

  const displayAvatar = avatar || '';

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        branding={{
          title: 'Provider Dashboard',
          logo: <BrandLogo />,
        }}
      >
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <DashboardLayout>
            <DemoPageContent pathname={router.pathname} />
          </DashboardLayout>

          {/* Avatar with popover at bottom left */}
          <Box
            sx={{
              position: 'fixed',
              left: 0,
              bottom: 0,
              width: 80,
              height: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1301,
            }}
          >
            <IconButton size="large" onClick={handleAvatarClick}>
              <Avatar
                src={displayAvatar}
                sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  fontSize: 22,
                }}
              >
                {!displayAvatar && stringAvatar(provider.hospitalName || 'P')}
              </Avatar>
            </IconButton>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              PaperProps={{ sx: { p: 2, minWidth: 260 } }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Avatar
                  src={displayAvatar}
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                  }}
                >
                  {!displayAvatar && stringAvatar(provider.hospitalName || 'P')}
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <label htmlFor="upload-avatar">
                  <input
                    accept="image/*"
                    id="upload-avatar"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <Button variant="outlined" component="span" size="small">
                    Upload
                  </Button>
                </label>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleRemoveImage}
                  disabled={!displayAvatar}
                >
                  Remove
                </Button>
              </Box>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Hospital Name: {provider.hospitalName || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Hospital ID: {provider.hospitalId || provider.hosId || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Speciality: {provider.speciality || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Location: {provider.location || provider.address || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Insurance Plans:
                </Typography>
                {/* Insurance plans: if an array, join by commas, else show N/A */}
                <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                  {Array.isArray(provider.insurancePlans)
                    ? provider.insurancePlans.join(', ')
                    : provider.insurancePlans || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Role: Provider
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />
              <Button
                startIcon={<LogoutIcon />}
                color="error"
                fullWidth
                onClick={handleLogout}
                size="small"
                variant="outlined"
              >
                Logout
              </Button>
            </Popover>
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default ProviderDashboard;
