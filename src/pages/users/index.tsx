import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Snackbar,
  Skeleton,
  Pagination,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  PersonOutlined as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  Group as GroupIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthFormErrors, RegisterFormValues } from '../../types/auth';
import { useUsers, useCreateUser } from './hooks';
import { ErrorPage } from '../../components/Error';

// ─── Role Helpers ─────────────────────────────────────────────────────────────

function getRoleLabel(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'super_admin':
      return 'Super Admin';
    case 'ADMIN':
    case 'admin':
      return 'Admin';
    default:
      return 'Kasir';
  }
}

function getRoleColor(role: string): 'error' | 'warning' | 'primary' | 'default' {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'super_admin':
      return 'error';
    case 'ADMIN':
    case 'admin':
      return 'warning';
    default:
      return 'primary';
  }
}

// ─── Add User Dialog with Success Popup ───────────────────────────────────────

interface CreatedUserInfo {
  username: string;
  role: string;
  createdAt: string;
}

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onClose, onSuccess }) => {
  const currentUser = useAuthStore((state) => state.user);
  const createUser = useCreateUser();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdUser, setCreatedUser] = useState<CreatedUserInfo | null>(null);

  const [formValues, setFormValues] = useState<RegisterFormValues>({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'cashier',
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setFormValues({ username: '', password: '', confirmPassword: '', role: 'cashier' });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setStep('form');
    setCreatedUser(null);
  };

  const handleClose = () => {
    if (createUser.isPending) return;
    resetForm();
    onClose();
  };

  const handleResetToForm = () => {
    resetForm();
  };

  const handleChange = (field: keyof RegisterFormValues) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (errors.general) setErrors((prev) => ({ ...prev, general: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: AuthFormErrors = {};
    if (!formValues.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formValues.username.trim().length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }
    if (!formValues.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formValues.password.length < 4) {
      newErrors.password = 'Password minimal 4 karakter';
    }
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Password dan konfirmasi tidak cocok';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createUser.mutate(
      {
        username: formValues.username.trim(),
        password: formValues.password,
        role: formValues.role,
      },
      {
        onSuccess: () => {
          const registeredUser: CreatedUserInfo = {
            username: formValues.username.trim(),
            role: formValues.role,
            createdAt: new Date().toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
          };
          setCreatedUser(registeredUser);
          setStep('success');
          onSuccess(formValues.username.trim());
        },
        onError: (err: unknown) => {
          const errorMsg =
            err instanceof Error ? err.message : 'Gagal mendaftarkan pengguna. Silakan coba lagi.';
          setErrors({ general: errorMsg });
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
    >
      {/* ── Dialog Header ── */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          fontWeight: 700,
          fontSize: '1.1rem',
          color: step === 'success' ? 'success.main' : 'text.primary',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {step === 'form' ? (
            <>
              <PersonAddIcon color="primary" />
              <span>Tambah Pengguna Baru</span>
            </>
          ) : (
            <>
              <CheckCircleOutlineIcon color="success" />
              <span>Pengguna Berhasil Ditambahkan!</span>
            </>
          )}
        </Box>
        <IconButton size="small" onClick={handleClose} disabled={createUser.isPending}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Dialog Content: Form Step ── */}
      {step === 'form' ? (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DialogContent dividers sx={{ pt: 2, pb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Operator saat ini:{' '}
              <strong>{currentUser?.username}</strong> (Peran: <em>{getRoleLabel(currentUser?.role ?? '')}</em>)
            </Typography>

            {errors.general && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {errors.general}
              </Alert>
            )}

            <Stack spacing={2.5}>
              {/* Username Field */}
              <TextField
                fullWidth
                label="Username Pengguna"
                variant="outlined"
                size="small"
                value={formValues.username}
                onChange={handleChange('username')}
                error={Boolean(errors.username)}
                helperText={errors.username}
                disabled={createUser.isPending}
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" color={errors.username ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password Akun"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                size="small"
                value={formValues.password}
                onChange={handleChange('password')}
                error={Boolean(errors.password)}
                helperText={errors.password}
                disabled={createUser.isPending}
                autoComplete="new-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" color={errors.password ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Konfirmasi Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                size="small"
                value={formValues.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                disabled={createUser.isPending}
                autoComplete="new-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" color={errors.confirmPassword ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Role Selection */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <FormControl component="fieldset">
                  <FormLabel
                    component="legend"
                    sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.primary', mb: 1 }}
                  >
                    Peran Pengguna (Role)
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formValues.role}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, role: e.target.value }))}
                  >
                    <FormControlLabel
                      value="cashier"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            Kasir
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Akses transaksi
                          </Typography>
                        </Box>
                      }
                      disabled={createUser.isPending}
                      sx={{ mr: 2 }}
                    />
                    <FormControlLabel
                      value="admin"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            Admin
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Kelola produk
                          </Typography>
                        </Box>
                      }
                      disabled={createUser.isPending}
                      sx={{ mr: 2 }}
                    />
                    <FormControlLabel
                      value="super_admin"
                      control={<Radio size="small" />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            Super Admin
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Akses penuh
                          </Typography>
                        </Box>
                      }
                      disabled={createUser.isPending}
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={createUser.isPending}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createUser.isPending}
              startIcon={
                createUser.isPending ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />
              }
              sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
            >
              {createUser.isPending ? 'Mendaftarkan...' : 'Daftarkan Pengguna'}
            </Button>
          </DialogActions>
        </Box>
      ) : (
        /* ── Dialog Content: Success Step (Matching Cashier Checkout Popup UX) ── */
        <Box>
          <DialogContent dividers sx={{ pt: 2.5, pb: 3 }}>
            <Stack spacing={2.5}>
              {/* Highlight Banner */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: 'rgba(46, 125, 50, 0.08)',
                  border: '1px solid',
                  borderColor: 'success.light',
                  borderRadius: 3,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Akun Pengguna Baru Berhasil Dibuat
                </Typography>
                <Typography variant="h5" color="success.main" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {createdUser?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Pengguna dapat langsung menggunakan akun untuk masuk ke sistem
                </Typography>
              </Paper>

              {/* Account Details Card */}
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Peran (Role)
                    </Typography>
                    <Chip
                      label={getRoleLabel(createdUser?.role || '')}
                      size="small"
                      color={getRoleColor(createdUser?.role || '')}
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </Stack>
                  <Divider />
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status Akun
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                      ● Aktif
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Didaftarkan Oleh
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {currentUser?.username || 'Super Admin'}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Waktu Pendaftaran
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {createdUser?.createdAt}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </DialogContent>

          {/* Success Step Actions */}
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetToForm}
                startIcon={<PersonAddIcon />}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Tambah Pengguna Lain
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                startIcon={<CheckCircleOutlineIcon />}
                sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
              >
                Selesai
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

// ─── User Management Page ─────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    data,
    isLoading,
    error,
    totalPages,
    totalData,
    refetch,
    isRefetching,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    handleDeleteUser,
  } = useUsers();

  const handleUserAdded = (username: string) => {
    setSnackbarMessage(`Pengguna "${username}" berhasil ditambahkan ke dalam sistem!`);
    setSuccessSnackbar(true);
  };

  if (error) {
    return <ErrorPage onRetry={refetch} isRetrying={isRefetching} />;
  }

  return (
    <Container disableGutters sx={{ display: 'grid', gap: 4, py: 2.5, px: 5 }}>
      {/* ── Top Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
              Manajemen Pengguna
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'gray', mt: 0.5, display: 'block' }}>
            Kelola seluruh akun pengguna sistem
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Field (Activates on Enter) */}
          <TextField
            size="small"
            placeholder="Cari pengguna..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(searchInput.trim());
              }
            }}
            sx={{
              width: 240,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                background: 'white',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Add User Button */}
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
            }}
          >
            Tambah Pengguna
          </Button>
        </Box>
      </Box>

      {/* ── Users Table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    width: 80,
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                // Skeletons while loading
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={32} height={32} sx={{ mx: 'auto' }} />
                    </TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <GroupIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {search
                        ? 'Tidak ada pengguna yang sesuai dengan pencarian.'
                        : 'Belum ada data pengguna.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user, index) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      bgcolor: index % 2 === 0 ? 'white' : 'rgba(0,0,0,0.015)',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}
                      >
                        {user.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            flexShrink: 0,
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        size="small"
                        color={getRoleColor(user.role)}
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Hapus pengguna (endpoint belum tersedia)" arrow>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                            sx={{
                              color: 'text.disabled',
                              cursor: 'not-allowed',
                              '&:hover': { color: 'text.disabled', bgcolor: 'transparent' },
                            }}
                            aria-label={`Hapus ${user.username}`}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Table Footer Meta Info ── */}
        {!isLoading && data.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Menampilkan <strong>{data.length}</strong> dari <strong>{totalData}</strong> pengguna
              {search && ` (filter: "${search}")`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Halaman <strong>{currentPage}</strong> dari <strong>{totalPages || 1}</strong>
            </Typography>
          </Box>
        )}
      </Paper>

      {/* ── Pagination Component ── */}
      {totalPages > 0 && data.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* ── Add User Dialog with Success Popup ── */}
      <AddUserDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={handleUserAdded}
      />

      {/* ── Success Notification Snackbar ── */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
