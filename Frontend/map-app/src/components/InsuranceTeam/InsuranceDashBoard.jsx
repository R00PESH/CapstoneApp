import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HandShake from '@mui/icons-material/Handshake';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';



import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import Popover from '@mui/material/Popover';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { AppProvider } from '@toolpad/core/AppProvider';
import InsurancePage from './Pages/InsurancePage';
import CreatePlans from './Pages/CreateCovers';
import CreateCustomers from './Pages/CreateCustomers';

import { ThemeProvider } from '@mui/material/styles';
import theme from '../../components/Theme'; // Adjust path as needed


// Define placeholders for all the pages used in DemoPageContent
function DashBoardPages() {
  return <div style={{ padding: 20 }}>Insurer Dashboard Home Page</div>;
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
  { segment: 'insurer', title: 'Insurer', icon: <SupportAgentIcon /> },
   { segment: 'customer', title: 'customer', icon: <FamilyRestroomIcon /> },
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
      return <InsurancePage />;
    case '/insurer':
      return <CreatePlans/>;
    case '/customer':
      return <CreateCustomers />;
    default:
      return <DefaultPage />;
  }
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const BrandLogo = () => (
  <HandShake sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
);

function InsuranceDashBoard() {
  const router = useDemoRouter('/dashboard');

  // Load insurer info from localStorage or fallback
  const [insurer, setinsurer] = React.useState(() => {
    const pStr = localStorage.getItem('insurer');
    let p = pStr ? JSON.parse(pStr) : null;
    if (!p) {
      p = {
        name: 'Unknown insurer',
        email: 'unknown@insurer.com',
        active_status: '',
        avatar: '',
      };
    }
    return p;
  });

  const [avatar, setAvatar] = React.useState(() => {
    return insurer.avatar || localStorage.getItem('profile_avatar') || '';
  });

  React.useEffect(() => {
    const handleStorage = () => {
      const pStr = localStorage.getItem('insurer');
      if (pStr) setinsurer(JSON.parse(pStr));
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
      const updatedInsurer = { ...insurer, avatar: avatarData };
      setInsurer(updatedInsurer);
      localStorage.setItem('insurer', JSON.stringify(updatedInsurer));
      localStorage.setItem('profile_avatar', avatarData);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const updatedInsurer = { ...insurer };
    delete updatedInsurer.avatar;
    setInsurer(updatedInsurer);
    setAvatar('');
    localStorage.setItem('insurer', JSON.stringify(updatedInsurer));
    localStorage.removeItem('profile_avatar');
  };

  const handleLogout = () => {
    localStorage.removeItem('insurer');
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
          title: 'Insurance Dashboard',
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
                {!displayAvatar && stringAvatar(insurer.name || 'P')}
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
                  {!displayAvatar && stringAvatar(insurer.name || 'P')}
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
                  Insurer ID: {insurer.insurer_Id || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Insurer Name: {insurer.name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Email: {insurer.email || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Role: Insurer
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

export default InsuranceDashBoard;
