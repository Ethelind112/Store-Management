import { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Pagination,
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutlined as DeleteOutlineIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  ReceiptLong as ReceiptLongIcon,
  Payment as PaymentIcon,
  RestartAlt as RestartAltIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  LocalAtm as LocalAtmIcon,
  QrCode2 as QrCode2Icon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import TopSearchBar from "../../components/TopSearchBar";
import { Product, SAMPLE_PRODUCTS } from "../product";

export interface CartItem {
  product: Product;
  quantity: number;
}

const PAGE_SIZE = 6;

function truncate(text: string, max = 80) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
}

export default function CashierPage({ products = SAMPLE_PRODUCTS }: { products?: Product[] }) {
  // --- Filter & Search States ---
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [draftSortBy, setDraftSortBy] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const hasActiveFilters = minPrice !== "" || maxPrice !== "" || sortBy !== "";

  // --- Cart State ---
  const [cart, setCart] = useState<Record<number, number>>({});

  // --- Checkout Dialog State ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  // --- Filter & Sort Logic ---
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesMin = minPrice === "" || p.price >= Number(minPrice);
      const matchesMax = maxPrice === "" || p.price <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [products, search, category, sortBy, minPrice, maxPrice]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // --- Cart Items & Totals ---
  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .map(([idStr, qty]) => {
        const product = products.find((p) => p.id === Number(idStr));
        if (!product || qty <= 0) return null;
        return { product, quantity: qty };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart, products]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  }, [cartItems]);

  // --- Cart Actions ---
  const handleAddToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: 1,
    }));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // --- Filter Handlers ---
  const handleCategoryClick = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setSortBy(draftSortBy);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategory("All");
    setSortBy("");
    setDraftSortBy("");
    setMinPrice("");
    setMaxPrice("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setPage(1);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // --- Checkout Handlers ---
  const handleOpenCheckout = () => {
    setCashReceived(totalPrice.toFixed(2));
    setIsCheckoutOpen(true);
  };

  const handleConfirmCheckout = () => {
    setIsCheckoutOpen(false);
    setSuccessSnackbar(true);
    setCart({});
  };

  const cashChange = Number(cashReceived) - totalPrice;
  const isCashSufficient = paymentMethod !== "cash" || (!isNaN(Number(cashReceived)) && cashChange >= 0);

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={3}>
        {/* =========================================
            LEFT SIDE: Product Catalog (Kasir Menu)
            ========================================= */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Top Search & Filter Bar */}
            <TopSearchBar
              title="Kasir"
              description="Pilih produk dan kelola transaksi pesanan"
              search={search}
              onSearchChange={handleSearchChange}
              hasActiveFilters={hasActiveFilters}
              draftMinPrice={draftMinPrice}
              setDraftMinPrice={setDraftMinPrice}
              draftMaxPrice={draftMaxPrice}
              setDraftMaxPrice={setDraftMaxPrice}
              draftSortBy={draftSortBy}
              setDraftSortBy={setDraftSortBy}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              category={category}
              onCategoryChange={handleCategoryClick}
            />

            {/* Product Cards Grid */}
            <Grid container spacing={2.5}>
              {paginated.map((product) => {
                const currentQty = cart[product.id] || 0;
                const isInCart = currentQty > 0;

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2.5,
                        borderColor: isInCart ? "primary.main" : "divider",
                        borderWidth: isInCart ? "2px" : "1px",
                        boxShadow: isInCart ? "0 4px 12px rgba(25, 118, 210, 0.12)" : "none",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="150"
                          image={product.image}
                          alt={product.name}
                          sx={{ objectFit: "cover" }}
                        />
                        {isInCart && (
                          <Chip
                            label={`${currentQty} di keranjang`}
                            color="primary"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              fontWeight: "bold",
                            }}
                          />
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Stack
                          direction="row"
                          sx={{ mb: 1, justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                            {product.name}
                          </Typography>
                          <Chip label={product.category} size="small" color="secondary" variant="outlined" />
                        </Stack>
                        <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: "bold" }}>
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {truncate(product.description, 70)}
                        </Typography>
                      </CardContent>

                      {/* Card Action: Add To Cart button / Quantity Input Field */}
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        {!isInCart ? (
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => handleAddToCart(product.id)}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              fontWeight: "bold",
                              py: 0.9,
                            }}
                          >
                            Tambah ke Keranjang
                          </Button>
                        ) : (
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", mb: 0.5, display: "block" }}>
                              Jumlah untuk Checkout:
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center", width: "100%" }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleUpdateQuantity(product.id, currentQty - 1)}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 1.5,
                                  bgcolor: "background.paper",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                                aria-label="Kurangi kuantitas"
                              >
                                {currentQty === 1 ? (
                                  <DeleteOutlineIcon fontSize="small" color="error" />
                                ) : (
                                  <RemoveIcon fontSize="small" />
                                )}
                              </IconButton>

                              <TextField
                                size="small"
                                type="number"
                                value={currentQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  handleUpdateQuantity(product.id, isNaN(val) ? 0 : Math.max(0, val));
                                }}
                                slotProps={{
                                  htmlInput: {
                                    min: 0,
                                    style: {
                                      textAlign: "center",
                                      padding: "6px 4px",
                                      fontWeight: "bold",
                                      fontSize: "0.95rem",
                                    },
                                  },
                                }}
                                sx={{
                                  flex: 1,
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                    bgcolor: "background.paper",
                                  },
                                }}
                              />

                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleUpdateQuantity(product.id, currentQty + 1)}
                                sx={{
                                  border: "1px solid",
                                  borderColor: "divider",
                                  borderRadius: 1.5,
                                  bgcolor: "background.paper",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                                aria-label="Tambah kuantitas"
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>

                              <Tooltip title="Hapus dari keranjang">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveFromCart(product.id)}
                                  sx={{
                                    border: "1px solid",
                                    borderColor: "error.light",
                                    borderRadius: 1.5,
                                    p: 0.75,
                                  }}
                                  aria-label="Hapus item"
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}

              {paginated.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Paper variant="outlined" sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Tidak ada produk yang cocok dengan pencarian / filter Anda.
                    </Typography>
                    <Button variant="text" color="primary" onClick={handleClearFilters} sx={{ mt: 1 }}>
                      Reset Filter
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filtered.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </Box>
        </Grid>

        {/* =========================================
            RIGHT SIDE: Cart / Order Summary
            ========================================= */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              position: { lg: "sticky" },
              top: 24,
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            {/* Cart Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <ReceiptLongIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Keranjang Pesanan
                </Typography>
              </Stack>

              {cartItems.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Chip label={`${totalQuantity} item`} size="small" color="primary" variant="filled" />
                  <Tooltip title="Kosongkan keranjang">
                    <IconButton size="small" color="error" onClick={handleClearCart}>
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>

            {/* List of Selected Items */}
            <Box
              sx={{
                py: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                maxHeight: { xs: "none", lg: "calc(100vh - 420px)" },
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {cartItems.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 56, mb: 1.5, color: "text.disabled" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    Keranjang Masih Kosong
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 220, mt: 0.5, textAlign: "center" }}>
                    Pilih produk di sebelah kiri dan klik tombol "Tambah ke Keranjang" untuk memulai.
                  </Typography>
                </Box>
              ) : (
                cartItems.map((item) => {
                  const itemTotal = item.quantity * item.product.price;

                  return (
                    <Box
                      key={item.product.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "grey.50",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        transition: "background-color 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      {/* Product Info Row */}
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar
                          src={item.product.image}
                          alt={item.product.name}
                          variant="rounded"
                          sx={{ width: 44, height: 44 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: "bold" }}>
                            {item.product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${item.product.price.toFixed(2)} / pcs
                          </Typography>
                        </Box>

                        <Tooltip title="Hapus">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            aria-label={`Hapus ${item.product.name}`}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {/* Quantity Controls & Item Total Row */}
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        {/* Quantity Stepper & Field */}
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: "background.paper",
                              p: 0.4,
                            }}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>

                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              handleUpdateQuantity(item.product.id, isNaN(val) ? 0 : Math.max(0, val));
                            }}
                            slotProps={{
                              htmlInput: {
                                min: 1,
                                style: {
                                  textAlign: "center",
                                  padding: "4px 2px",
                                  width: "42px",
                                  fontSize: "0.875rem",
                                  fontWeight: "bold",
                                },
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                                bgcolor: "background.paper",
                              },
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: "background.paper",
                              p: 0.4,
                            }}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Stack>

                        {/* Total price for each item */}
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: "bold" }}>
                            ${itemTotal.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.quantity} × ${item.product.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  );
                })
              )}
            </Box>

            {/* Cart Footer: Summary & Checkout Button */}
            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={1.2}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Total Jenis Produk
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {cartItems.length} produk
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Total Jumlah Item
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {totalQuantity} pcs
                </Typography>
              </Stack>

              <Divider sx={{ my: 0.5 }} />

              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Total Belanja
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: "bold" }}>
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={cartItems.length === 0}
                startIcon={<PaymentIcon />}
                onClick={handleOpenCheckout}
                sx={{
                  mt: 1.5,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Checkout (${totalPrice.toFixed(2)})
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          CHECKOUT CONFIRMATION MODAL
          ========================================= */}
      <Dialog
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <PaymentIcon color="primary" />
          Konfirmasi Pembayaran
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {/* Order Items Review */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ringkasan Pesanan ({totalQuantity} item)
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, maxHeight: 160, overflowY: "auto" }}>
                {cartItems.map((item) => (
                  <Stack
                    key={item.product.id}
                    direction="row"
                    sx={{ py: 0.5, justifyContent: "space-between", alignItems: "center" }}
                  >
                    <Typography variant="body2">
                      {item.product.name} <b>× {item.quantity}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </Typography>
                  </Stack>
                ))}
              </Paper>
            </Box>

            {/* Total */}
            <Stack
              direction="row"
              sx={{
                p: 2,
                bgcolor: "primary.light",
                borderRadius: 2,
                color: "primary.contrastText",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Total Tagihan:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Stack>

            {/* Payment Method Selector */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Metode Pembayaran
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ gap: 1 }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    borderColor: paymentMethod === "cash" ? "primary.main" : "divider",
                    bgcolor: paymentMethod === "cash" ? "action.hover" : "transparent",
                  }}
                >
                  <FormControlLabel
                    value="cash"
                    control={<Radio size="small" />}
                    label={
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <LocalAtmIcon fontSize="small" />
                        <Typography variant="body2">Tunai</Typography>
                      </Stack>
                    }
                  />
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    borderColor: paymentMethod === "qris" ? "primary.main" : "divider",
                    bgcolor: paymentMethod === "qris" ? "action.hover" : "transparent",
                  }}
                >
                  <FormControlLabel
                    value="qris"
                    control={<Radio size="small" />}
                    label={
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <QrCode2Icon fontSize="small" />
                        <Typography variant="body2">QRIS</Typography>
                      </Stack>
                    }
                  />
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    borderColor: paymentMethod === "card" ? "primary.main" : "divider",
                    bgcolor: paymentMethod === "card" ? "action.hover" : "transparent",
                  }}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio size="small" />}
                    label={
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <CreditCardIcon fontSize="small" />
                        <Typography variant="body2">Kartu Debit/Kredit</Typography>
                      </Stack>
                    }
                  />
                </Paper>
              </RadioGroup>
            </Box>

            {/* Cash Payment Calculations */}
            {paymentMethod === "cash" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <TextField
                  fullWidth
                  label="Uang Tunai Diterima ($)"
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  size="small"
                  error={!isCashSufficient}
                  helperText={!isCashSufficient ? "Nominal uang diterima kurang dari total belanja" : ""}
                />

                {/* Quick Cash Buttons */}
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                  {[totalPrice, Math.ceil(totalPrice / 10) * 10, 50, 100, 200]
                    .filter((val, idx, arr) => val >= totalPrice && arr.indexOf(val) === idx)
                    .map((val) => (
                      <Chip
                        key={val}
                        label={`$${val.toFixed(2)}`}
                        onClick={() => setCashReceived(val.toFixed(2))}
                        clickable
                        variant="outlined"
                        size="small"
                      />
                    ))}
                </Stack>

                <Stack direction="row" sx={{ pt: 1, justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Kembalian:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color={cashChange >= 0 ? "success.main" : "error.main"}
                    sx={{ fontWeight: "bold" }}
                  >
                    ${cashChange >= 0 ? cashChange.toFixed(2) : "0.00"}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setIsCheckoutOpen(false)} color="inherit">
            Batal
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isCashSufficient}
            onClick={handleConfirmCheckout}
            startIcon={<CheckCircleOutlineIcon />}
          >
            Selesaikan Transaksi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification Snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success" sx={{ width: "100%", borderRadius: 2 }}>
          Transaksi berhasil diselesaikan!
        </Alert>
      </Snackbar>
    </Container>
  );
}