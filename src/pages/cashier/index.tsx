import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardMedia,
  CardContent,
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
  CircularProgress,
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
  HideImageOutlined as HideImageOutlinedIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import TopSearchBar from "../../components/TopSearchBar";
import { Category } from "../../types/category";
import { Product } from "../../types/product";
import { useProducts } from "../product/hooks";
import { FilterMenuOptions } from "../../components/FilterMenu/constant";
import { LoadingPage } from "../../components/Loading";
import { ErrorPage } from "../../components/Error";
import { useCreateTransaction } from "./hooks";
import { CreateTransactionPayload } from "../../types/transaction";
import { printReceipt, ReceiptData } from "../../utils/printReceipt";

const STATIC_ADMIN_ID = "0071665c-eb86-4738-a1ab-d230226b8dda";

// Cart item references the API Product type
export interface CartItem {
  product: Product;
  quantity: number;
}

function truncate(text?: string, max = 20) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
}

interface QuantityStepperProps {
  quantity: number;
  maxQuantity: number;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
  inputWidth?: string | number;
}

function QuantityStepper({
  quantity,
  maxQuantity,
  onUpdate,
  onRemove,
  inputWidth = "38px",
}: QuantityStepperProps) {
  const [localVal, setLocalVal] = useState<string>(String(quantity));

  useEffect(() => {
    setLocalVal(String(quantity));
  }, [quantity]);

  const isAtMax = maxQuantity > 0 && quantity >= maxQuantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow user to completely erase the field without resetting to 0 or disappearing
    if (raw === "") {
      setLocalVal("");
      return;
    }

    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      if (parsed <= 0) {
        setLocalVal(raw);
        return;
      }
      // Cannot exceed max quantity of the product
      const clamped = maxQuantity > 0 ? Math.min(parsed, maxQuantity) : parsed;
      setLocalVal(String(clamped));
      onUpdate(clamped);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(localVal, 10);
    if (isNaN(parsed) || parsed <= 0) {
      // If left empty or invalid, fallback to 1 instead of deleting or disappearing
      setLocalVal("1");
      onUpdate(1);
    } else {
      const clamped = maxQuantity > 0 ? Math.min(parsed, maxQuantity) : parsed;
      setLocalVal(String(clamped));
      onUpdate(clamped);
    }
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      onRemove();
    } else {
      onUpdate(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (!isAtMax) {
      onUpdate(quantity + 1);
    }
  };

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <Tooltip title={quantity === 1 ? "Hapus dari keranjang" : "Kurangi kuantitas"}>
        <span>
          <IconButton
            size="small"
            color={quantity === 1 ? "error" : "primary"}
            onClick={handleDecrement}
            aria-label={quantity === 1 ? "Hapus dari keranjang" : "Kurangi kuantitas"}
            sx={{
              border: "1px solid",
              borderColor: quantity === 1 ? "error.light" : "divider",
              borderRadius: 1.5,
              p: 0.4,
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {quantity === 1 ? (
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            ) : (
              <RemoveIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <TextField
        size="small"
        type="number"
        value={localVal}
        onChange={handleInputChange}
        onBlur={handleBlur}
        slotProps={{
          htmlInput: {
            min: 1,
            max: maxQuantity > 0 ? maxQuantity : undefined,
            style: {
              textAlign: "center",
              padding: "4px 2px",
              width: inputWidth,
              fontSize: "0.875rem",
              fontWeight: "bold",
            },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            bgcolor: "background.paper",
          },
        }}
      />

      <Tooltip title={isAtMax ? "Kuantitas maksimal tercapai" : "Tambah kuantitas"}>
        <span>
          <IconButton
            size="small"
            color="primary"
            onClick={handleIncrement}
            disabled={isAtMax}
            aria-label="Tambah kuantitas"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              p: 0.4,
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "action.hover" },
              "&.Mui-disabled": {
                opacity: 0.4,
                borderColor: "divider",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

export default function CashierPage() {
  // ─── API data via shared hook (same endpoint as ProductPage) ───────────────
  const {
    data,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    category,
    setCategory,
    sort,
    setSort,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    search,
    setSearch,
    refetch,
    isRefetching,
  } = useProducts();

  // Draft filter state (applied on "Apply" click, same pattern as ProductPage)
  const [draftSortBy, setDraftSortBy] = useState<string>("");
  const [draftMinPrice, setDraftMinPrice] = useState<string>("");
  const [draftMaxPrice, setDraftMaxPrice] = useState<string>("");

  const hasActiveFilters = Boolean(minPrice !== "" || maxPrice !== "" || sort !== null);

  // ─── Cart state (keyed by product id string, storing full CartItem) ──────
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  // ─── Checkout dialog state ─────────────────────────────────────────────────
  const createTransaction = useCreateTransaction();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"confirm" | "success">("confirm");
  const [completedTransaction, setCompletedTransaction] = useState<ReceiptData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─── Cart derived values (independent of active search query/filters) ──────
  const cartItems: CartItem[] = useMemo(() => {
    return Object.values(cart);
  }, [cart]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  // Use max_price as unit price (fallback to min_price)
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) =>
          acc + item.quantity * (item.product.max_price ?? item.product.min_price ?? 0),
        0
      ),
    [cartItems]
  );

  // ─── Cart actions ──────────────────────────────────────────────────────────
  const handleAddToCart = (product: Product) => {
    const maxQty = product.quantity ?? Infinity;
    if (maxQty <= 0) return;
    setCart((prev) => ({ ...prev, [product.id]: { product, quantity: 1 } }));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else if (next[productId]) {
        const maxQty = next[productId].product.quantity ?? Infinity;
        next[productId] = {
          ...next[productId],
          quantity: maxQty > 0 ? Math.min(quantity, maxQty) : quantity,
        };
      }
      return next;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const handleClearCart = () => setCart({});

  // ─── Filter / search handlers ──────────────────────────────────────────────
  const handleCategoryClick = (cat: Category | null) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleApplyFilters = (cat?: Category | null) => {
    const selectedOption = FilterMenuOptions.find((opt) => opt.key === draftSortBy);
    setSort(selectedOption ? { sortBy: selectedOption.field, order: selectedOption.order } : null);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    if (cat !== undefined) setCategory(cat);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setCategory(null);
    setSort(null);
    setDraftSortBy("");
    setMinPrice("");
    setMaxPrice("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setCurrentPage(1);
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  // ─── Checkout handlers ─────────────────────────────────────────────────────
  const handleOpenCheckout = () => {
    setErrorMessage(null);
    setCheckoutStep("confirm");
    setCompletedTransaction(null);
    setCashReceived(totalPrice.toLocaleString("id-ID"));
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    if (!createTransaction.isPending) {
      setIsCheckoutOpen(false);
      setErrorMessage(null);
      setCheckoutStep("confirm");
      setCompletedTransaction(null);
    }
  };

  const handlePrintReceipt = () => {
    if (completedTransaction) {
      printReceipt(completedTransaction);
    }
  };

  const handleConfirmCheckout = () => {
    setErrorMessage(null);
    const parsedCash = Number(cashReceived.replace(/\./g, "").replace(",", "."));
    const receiptSnapshot: ReceiptData = {
      transactionId: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      items: cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.max_price ?? item.product.min_price ?? 0,
      })),
      totalQuantity,
      totalPrice,
      paymentMethod,
      cashReceived: paymentMethod === "cash" && !isNaN(parsedCash) ? parsedCash : undefined,
      cashChange: paymentMethod === "cash" && !isNaN(cashChange) ? Math.max(0, cashChange) : undefined,
    };

    const payload: CreateTransactionPayload = {
      admin_id: STATIC_ADMIN_ID,
      payment_method: paymentMethod,
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.max_price ?? item.product.min_price ?? 0,
      })),
    };

    createTransaction.mutate(payload, {
      onSuccess: (res) => {
        if (res?.data?.id) {
          receiptSnapshot.transactionId = res.data.id;
        }
        setCompletedTransaction(receiptSnapshot);
        setCart({});
        setCheckoutStep("success");
        setSuccessSnackbar(true);
      },
      onError: (err: any) => {
        setErrorMessage(err.message || "Gagal memproses transaksi. Silakan coba lagi.");
      },
    });
  };

  const cashChange = Number(cashReceived.replace(/\./g, "").replace(",", ".")) - totalPrice;
  const isCashSufficient =
    paymentMethod !== "cash" || (!isNaN(cashChange) && cashChange >= 0);

  // ─── Early returns ─────────────────────────────────────────────────────────
  if (error) {
    return <ErrorPage onRetry={refetch} isRetrying={isRefetching} fullScreen={false} />;
  }

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={3}>
        {/* =====================================================================
            LEFT SIDE: Product Catalog
            ===================================================================== */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Search & Filter Bar */}
            <TopSearchBar
              title="Kasir"
              description="Pilih produk dan tambahkan ke keranjang"
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

            {/* Product Grid */}
            {isLoading ? (
              <LoadingPage fullScreen={false} />
            ) : (
              <>
                <Grid container spacing={2.5}>
                  {data.map((product) => {
                    const currentQty = cart[product.id]?.quantity || 0;
                    const isInCart = currentQty > 0;
                    const maxStock = product.quantity ?? Infinity;
                    const isOutOfStock = typeof product.quantity === "number" && product.quantity <= 0;

                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                        {/* Card matches product page exactly: plain outlined, no custom border/shadow */}
                        <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

                          {/* Image — 180px, with no-image fallback + in-cart badge overlay */}
                          {product.image ? (
                            <CardMedia
                              component="img"
                              height="180"
                              image={product.image}
                              alt={product.name}
                              sx={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: 180,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "grey.100",
                                color: "text.secondary",
                              }}
                            >
                              <HideImageOutlinedIcon sx={{ fontSize: 40 }} />
                            </Box>
                          )}

                          {/* Content — order exactly as product page: chip → name → description → price row */}
                          <CardContent sx={{ flexGrow: 1 }}>
                            {/* Category & Stock row */}
                            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                              <Chip
                                label={product.category?.name || "Uncategorized"}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                              <Chip
                                label={product.quantity <= 0 ? "Habis" : `Stok: ${product.quantity}`}
                                size="small"
                                variant="outlined"
                                color={product.quantity <= 0 ? "error" : product.quantity <= 5 ? "warning" : "default"}
                                sx={{ fontSize: "0.75rem", height: 24, fontWeight: 500 }}
                              />
                            </Stack>

                            {/* Name */}
                            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 0.5 }}>
                              {truncate(product.name)}
                            </Typography>

                            {/* Description — 2-line clamp */}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.5,
                                height: "3em",
                                mt: 0.5,
                              }}
                            >
                              {product.description || "–"}
                            </Typography>

                            {/* Price row: max_price on left, cart control on right */}
                            <Stack
                              direction="row"
                              sx={{
                                mt: 1.5,
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="body1" color="primary">
                                Rp
                                {product.max_price != null
                                  ? product.max_price.toLocaleString("id-ID")
                                  : "0"}
                              </Typography>

                              {/* Right side: add button OR compact stepper */}
                              {!isInCart ? (
                                <Tooltip title={isOutOfStock ? "Stok habis" : "Tambah ke Keranjang"}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleAddToCart(product)}
                                      disabled={isOutOfStock}
                                      aria-label={isOutOfStock ? "Stok habis" : "Tambah ke Keranjang"}
                                      sx={{
                                        border: "1px solid",
                                        borderColor: "primary.main",
                                        borderRadius: 1.5,
                                        "&.Mui-disabled": {
                                          opacity: 0.4,
                                          borderColor: "divider",
                                        },
                                      }}
                                    >
                                      <AddShoppingCartIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              ) : (
                                <QuantityStepper
                                  quantity={currentQty}
                                  maxQuantity={maxStock}
                                  onUpdate={(qty) => handleUpdateQuantity(product.id, qty)}
                                  onRemove={() => handleRemoveFromCart(product.id)}
                                  inputWidth="38px"
                                />
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}

                  {data.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          Tidak ada produk yang cocok dengan pencarian / filter Anda.
                        </Typography>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={handleClearFilters}
                          sx={{ mt: 1 }}
                        >
                          Reset Filter
                        </Button>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                {/* Pagination */}
                {totalPages > 0 && (
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, value) => setCurrentPage(value)}
                      color="primary"
                      shape="rounded"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Grid>

        {/* =====================================================================
            RIGHT SIDE: Cart / Order Summary
            ===================================================================== */}
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
                  <Chip
                    label={`${totalQuantity} item`}
                    size="small"
                    color="primary"
                    variant="filled"
                  />
                  <Tooltip title="Kosongkan keranjang">
                    <IconButton size="small" color="error" onClick={handleClearCart}>
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>

            {/* Cart Item List */}
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
                  <ShoppingCartOutlinedIcon
                    sx={{ fontSize: 56, mb: 1.5, color: "text.disabled" }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    Keranjang Masih Kosong
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ maxWidth: 220, mt: 0.5, textAlign: "center" }}
                  >
                    Pilih produk di sebelah kiri dan klik "Tambah ke Keranjang" untuk memulai.
                  </Typography>
                </Box>
              ) : (
                cartItems.map((item) => {
                  const unitPrice = item.product.max_price ?? item.product.min_price ?? 0;
                  const itemTotal = item.quantity * unitPrice;

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
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      {/* Product info row */}
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar
                          src={item.product.image}
                          alt={item.product.name}
                          variant="rounded"
                          sx={{ width: 44, height: 44 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ fontWeight: "bold" }}
                          >
                            {item.product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Rp{unitPrice.toLocaleString("id-ID")} / pcs
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

                      {/* Quantity controls & item total */}
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", alignItems: "center" }}
                      >
                        <QuantityStepper
                          quantity={item.quantity}
                          maxQuantity={item.product.quantity ?? Infinity}
                          onUpdate={(qty) => handleUpdateQuantity(item.product.id, qty)}
                          onRemove={() => handleRemoveFromCart(item.product.id)}
                          inputWidth="42px"
                        />

                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                          >
                            Rp{itemTotal.toLocaleString("id-ID")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.quantity} × Rp{unitPrice.toLocaleString("id-ID")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  );
                })
              )}
            </Box>

            {/* Cart Footer */}
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

              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Total Belanja
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: "bold" }}>
                  Rp{totalPrice.toLocaleString("id-ID")}
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
                Checkout (Rp{totalPrice.toLocaleString("id-ID")})
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* ======================================================================
          CHECKOUT & SUCCESS DIALOG
          ====================================================================== */}
      <Dialog
        open={isCheckoutOpen}
        onClose={handleCloseCheckout}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: checkoutStep === "success" ? "success.main" : "text.primary",
          }}
        >
          {checkoutStep === "confirm" ? (
            <>
              <PaymentIcon color="primary" />
              Konfirmasi Pembayaran
            </>
          ) : (
            <>
              <CheckCircleOutlineIcon color="success" />
              Transaksi Berhasil!
            </>
          )}
        </DialogTitle>

        <DialogContent dividers>
          {checkoutStep === "confirm" ? (
            <Stack spacing={2.5}>
              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage(null)}>
                  {errorMessage}
                </Alert>
              )}
              {/* Order summary */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Ringkasan Pesanan ({totalQuantity} item)
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, maxHeight: 160, overflowY: "auto" }}
                >
                  {cartItems.map((item) => (
                    <Stack
                      key={item.product.id}
                      direction="row"
                      sx={{
                        py: 0.5,
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {item.product.name} <b>× {item.quantity}</b>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        Rp
                        {(
                          item.quantity *
                          (item.product.max_price ?? item.product.min_price ?? 0)
                        ).toLocaleString("id-ID")}
                      </Typography>
                    </Stack>
                  ))}
                </Paper>
              </Box>

              {/* Total bill */}
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
                  Rp{totalPrice.toLocaleString("id-ID")}
                </Typography>
              </Stack>

              {/* Payment method */}
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
                  {[
                    { value: "cash", icon: <LocalAtmIcon fontSize="small" />, label: "Tunai" },
                    { value: "qris", icon: <QrCode2Icon fontSize="small" />, label: "QRIS" },
                    {
                      value: "card",
                      icon: <CreditCardIcon fontSize="small" />,
                      label: "Kartu Debit/Kredit",
                    },
                  ].map((opt) => (
                    <Paper
                      key={opt.value}
                      variant="outlined"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        borderColor:
                          paymentMethod === opt.value ? "primary.main" : "divider",
                        bgcolor:
                          paymentMethod === opt.value ? "action.hover" : "transparent",
                      }}
                    >
                      <FormControlLabel
                        value={opt.value}
                        control={<Radio size="small" />}
                        label={
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ alignItems: "center" }}
                          >
                            {opt.icon}
                            <Typography variant="body2">{opt.label}</Typography>
                          </Stack>
                        }
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </Box>

              {/* Cash calculations */}
              {paymentMethod === "cash" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Uang Tunai Diterima (Rp)"
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    size="small"
                    error={!isCashSufficient}
                    helperText={
                      !isCashSufficient
                        ? "Nominal uang diterima kurang dari total belanja"
                        : ""
                    }
                  />

                  {/* Quick amount chips */}
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    {[
                      totalPrice,
                      Math.ceil(totalPrice / 10000) * 10000,
                      50000,
                      100000,
                      200000,
                    ]
                      .filter(
                        (val, idx, arr) => val >= totalPrice && arr.indexOf(val) === idx
                      )
                      .map((val) => (
                        <Chip
                          key={val}
                          label={`Rp${val.toLocaleString("id-ID")}`}
                          onClick={() => setCashReceived(String(val))}
                          clickable
                          variant="outlined"
                          size="small"
                        />
                      ))}
                  </Stack>

                  <Stack
                    direction="row"
                    sx={{ pt: 1, justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Kembalian:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color={cashChange >= 0 ? "success.main" : "error.main"}
                      sx={{ fontWeight: "bold" }}
                    >
                      Rp{cashChange >= 0 ? cashChange.toLocaleString("id-ID") : "0"}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          ) : (
            /* Phase 2: Transaction Success & Receipt View */
            <Stack spacing={2.5} sx={{ py: 1 }}>
              {/* Highlight change if payment was cash */}
              {completedTransaction?.paymentMethod === "cash" && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "success.50",
                    border: "2px dashed",
                    borderColor: "success.main",
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Kembalian untuk Pelanggan:
                  </Typography>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 800, my: 0.5 }}>
                    Rp{(completedTransaction.cashChange ?? 0).toLocaleString("id-ID")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Uang Diterima: Rp{(completedTransaction.cashReceived ?? 0).toLocaleString("id-ID")} • Total Tagihan: Rp{completedTransaction.totalPrice.toLocaleString("id-ID")}
                  </Typography>
                </Paper>
              )}

              {completedTransaction?.paymentMethod !== "cash" && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "success.50",
                    border: "1px solid",
                    borderColor: "success.light",
                    borderRadius: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Pembayaran Berhasil Diterima via{" "}
                    {completedTransaction?.paymentMethod === "qris" ? "QRIS" : "Kartu Debit/Kredit"}
                  </Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold", mt: 0.5 }}>
                    Rp{(completedTransaction?.totalPrice ?? 0).toLocaleString("id-ID")}
                  </Typography>
                </Paper>
              )}

              {/* Transaction details card */}
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={1.2}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      No. Transaksi
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {completedTransaction?.transactionId}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Waktu Transaksi
                    </Typography>
                    <Typography variant="body2">
                      {completedTransaction?.date}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Item
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {completedTransaction?.totalQuantity} pcs
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Metode Pembayaran
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {completedTransaction?.paymentMethod === "cash"
                        ? "Tunai"
                        : completedTransaction?.paymentMethod === "qris"
                        ? "QRIS"
                        : "Kartu Debit/Kredit"}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          {checkoutStep === "confirm" ? (
            <Stack direction="row" spacing={1.5} sx={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={handleCloseCheckout}
                color="inherit"
                disabled={createTransaction.isPending}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!isCashSufficient || createTransaction.isPending}
                onClick={handleConfirmCheckout}
                startIcon={
                  createTransaction.isPending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CheckCircleOutlineIcon />
                  )
                }
              >
                {createTransaction.isPending ? "Memproses..." : "Bayar & Selesaikan"}
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePrintReceipt}
                startIcon={<PrintIcon />}
                sx={{ borderRadius: 2 }}
              >
                Cetak Struk
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseCheckout}
                startIcon={<CheckCircleOutlineIcon />}
                sx={{ borderRadius: 2 }}
              >
                Selesai
              </Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>

      {/* Success snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          Transaksi berhasil diselesaikan!
        </Alert>
      </Snackbar>
    </Container>
  );
}
