import React from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  Stack,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  PointOfSale as PointOfSaleIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  ReceiptLong as ReceiptLongIcon,
  Inventory as InventoryIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE } from '../../constants/route';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'register';
  title: string;
  subtitle: string;
}

const features = [
  {
    icon: <PointOfSaleIcon fontSize="small" sx={{ color: '#90caf9' }} />,
    title: 'Transaksi Kasir Cepat',
    desc: 'Proses pembayaran tunai, QRIS, dan debit secara instan.',
  },
  {
    icon: <InventoryIcon fontSize="small" sx={{ color: '#90caf9' }} />,
    title: 'Manajemen Produk & Stok',
    desc: 'Pengelompokan kategori dan monitoring stok barang akurat.',
  },
  {
    icon: <ReceiptLongIcon fontSize="small" sx={{ color: '#90caf9' }} />,
    title: 'Cetak Struk Otomatis',
    desc: 'Format struk cetak siap pakai dengan rincian transaksi lengkap.',
  },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  mode,
  title,
  subtitle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'login') {
      navigate(ROUTE.LOGIN, { state: location.state });
    } else {
      navigate(ROUTE.REGISTER, { state: location.state });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f4f6f8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 3, sm: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg" sx={{ p: 0 }}>
        {/* Top Back Navigation */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTE.CASHIER)}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
              },
            }}
          >
            Kembali ke Kasir
          </Button>
        </Box>

        {/* Main Auth Card Container */}
        <Card
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            bgcolor: '#ffffff',
            minHeight: { md: 620 },
          }}
        >
          {/* Left Hero / Brand Panel */}
          <Box
            sx={{
              flex: { md: '0 0 45%' },
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
              color: 'white',
              p: { xs: 4, sm: 5, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle decorative background circles */}
            <Box
              sx={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -40,
                left: -40,
                width: 180,
                height: 180,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                pointerEvents: 'none',
              }}
            />

            {/* Brand Header */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    p: 1.2,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <PointOfSaleIcon sx={{ fontSize: 32, color: '#ffffff' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  Bright Print
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  mb: 4,
                }}
              >
                Aplikasi Kasir & Point of Sale Cerdas
              </Typography>

              {!isMobile && (
                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      fontSize: '1.15rem',
                      color: '#ffffff',
                    }}
                  >
                    Kelola Penjualan Toko Lebih Efisien
                  </Typography>

                  <Stack spacing={2.5}>
                    {features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            mt: 0.25,
                            bgcolor: 'rgba(255, 255, 255, 0.12)',
                            borderRadius: '50%',
                            p: 0.75,
                            display: 'flex',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: '#ffffff' }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.3 }}
                          >
                            {feature.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Bottom Tagline / Security Note */}
            <Box sx={{ mt: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.12)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  width: 'fit-content',
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#81c784' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Akses aman terenkripsi JWT token
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Form Panel */}
          <Box
            sx={{
              flex: { md: '0 0 55%' },
              p: { xs: 3, sm: 5, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: '#ffffff',
            }}
          >
            {/* Top Navigation Tabs */}
            <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={mode}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    py: 1.5,
                  },
                }}
              >
                <Tab label="Masuk (Login)" value="login" />
                <Tab label="Daftar Akun Baru" value="register" />
              </Tabs>
            </Box>

            {/* Form Title & Subtitle */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: -0.3,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            </Box>

            {/* Main Form Content */}
            {children}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};
