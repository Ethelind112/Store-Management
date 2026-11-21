import { useState } from "react";
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
  Stack,
} from "@mui/material";
import TopSearchBar from "../../components/TopSearchBar";
import { useProducts } from "./hooks";
import { LoadingPage } from "../../components/Loading";
import { ErrorPage } from "../../components/Error";
import { FilterMenuOptions } from "../../components/FilterMenu/constant";
import { Category } from "../../types/category";
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

function truncate(text?: string, max = 20) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
}

export default function ProductPage() {
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

  const [draftSortBy, setDraftSortBy] = useState<string>("");
  const [draftMinPrice, setDraftMinPrice] = useState<string>("");
  const [draftMaxPrice, setDraftMaxPrice] = useState<string>("");

  const hasActiveFilters = Boolean(minPrice !== "" || maxPrice !== "" || sort !== null);

  const handleCategoryClick = (cat: Category | null) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleApplyFilters = (cat?: Category | null) => {
    const selectedOption = FilterMenuOptions.find((opt) => opt.key === draftSortBy);
    if (selectedOption) {
      setSort({ sortBy: selectedOption.field, order: selectedOption.order });
    } else {
      setSort(null);
    }
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    if (cat !== undefined) {
      setCategory(cat);
    }
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

  if (error) {
    return <ErrorPage onRetry={refetch} isRetrying={isRefetching} />;
  }

  return (
    <Container disableGutters sx={{ display: "grid", gap: 4, py: 2.5, px: 5 }}>
      <TopSearchBar
        title="Produk"
        description="Cari dan telusuri produk"
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

      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Grid container spacing={3}>
            {data.map((product) => (
              <Grid size={{ xs: 12, sm: 4, md: 3 }} key={product.id}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {product.image ? (
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                        color: 'text.secondary',
                      }}
                    >
                      <HideImageOutlinedIcon sx={{ fontSize: 40 }} />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Chip label={product.category.name || "Uncategorized"} size="small" color="secondary" variant="outlined" />
                      <Chip
                        label={product.quantity <= 0 ? "Habis" : `Stok: ${product.quantity}`}
                        size="small"
                        variant="outlined"
                        color={product.quantity <= 0 ? "error" : product.quantity <= 5 ? "warning" : "default"}
                        sx={{ fontSize: "0.75rem", height: 24, fontWeight: 500 }}
                      />
                    </Stack>

                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                      {truncate(product.name)}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                        height: '3em',
                        mt: 0.5,
                      }}
                    >
                      {product.description || "-"}
                    </Typography>

                    <Typography variant="body1" color="primary" sx={{ mt: 1.5 }}>
                      Rp{product.min_price != null ? product.min_price.toFixed(2) : "0.00"} - Rp{product.max_price != null ? product.max_price.toFixed(2) : "0.00"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {data.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 6 }}>
                  No products match your filters.
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}

      {data.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
