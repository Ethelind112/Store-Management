import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Pagination,
} from "@mui/material";
import TopSearchBar from "../../components/TopSearchBar";
import { useProducts } from "./hooks";

const PAGE_SIZE = 6;

function truncate(text, max = 100) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
}

export default function ProductPage() {
  const [search, setSearch] = useState("");
  // const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [draftSortBy, setDraftSortBy] = useState("");
  
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  
  const [page, setPage] = useState(1);
  const hasActiveFilters = minPrice !== "" || maxPrice !== "" || sortBy !== "";
  
  const {
    data,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    category,
    setCategory,
  } = useProducts();

  // const filtered = useMemo(() => {
  //   let result = products.filter((p) => {
  //     const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
  //     const matchesCategory = category === "All" || p.category === category;
  //     const matchesMin = minPrice === "" || p.price >= Number(minPrice);
  //     const matchesMax = maxPrice === "" || p.price <= Number(maxPrice);
  //     return matchesSearch && matchesCategory && matchesMin && matchesMax;
  //   });

  //   switch (sortBy) {
  //     case "name-asc":
  //       result.sort((a, b) => a.name.localeCompare(b.name));
  //       break;
  //     case "name-desc":
  //       result.sort((a, b) => b.name.localeCompare(a.name));
  //       break;
  //     case "price-asc":
  //       result.sort((a, b) => a.price - b.price);
  //       break;
  //     case "price-desc":
  //       result.sort((a, b) => b.price - a.price);
  //       break;
  //     default:
  //       break;
  //   }
  //   return result;
  // }, [products, search, category, sortBy, minPrice, maxPrice]);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleApplyFilters = (category) => {
    setSortBy(draftSortBy);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setPage(1);
    setCategory(category);
  };

  const handleClearFilters = () => {
    setCategory(null);
    setSortBy("");
    setDraftSortBy("");
    setMinPrice("");
    setMaxPrice("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setPage(1);
    setCategory(null);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Container disableGutters sx={{ display: "grid", gap: 4, py: 2.5, px: 5 }} >
        
        <TopSearchBar
            title="Produk"
            description="Cari dan telusuri produk"
            search={search}
            onSearchChange = {handleSearchChange}
            hasActiveFilters = {hasActiveFilters}
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
        
        <Grid container spacing={3}>
            {data.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                    component="img"
                    height="180"
                    // image={product.image}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" sx={{ mb: 1, justifyContent: "space-between", alignItems:"flex-start" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                    </Typography>
                    <Chip label={product.category} size="small" color="secondary" variant="outlined" />
                    </Stack>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    ${product.max_price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {truncate(product.description, 100)}
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
