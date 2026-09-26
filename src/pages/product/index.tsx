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

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 59.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/1/400/300",
    description:
      "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and a comfortable memory foam cushion for all-day listening.",
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 15.5,
    category: "Clothing",
    image: "https://picsum.photos/seed/2/400/300",
    description: "Soft, breathable 100% cotton t-shirt available in multiple colors.",
  },
  {
    id: 3,
    name: "Ceramic Coffee Mug",
    price: 9.99,
    category: "Home",
    image: "https://picsum.photos/seed/3/400/300",
    description: "Microwave and dishwasher safe ceramic mug, holds 12oz of your favorite drink.",
  },
  {
    id: 4,
    name: "Mystery Novel: The Silent Hour",
    price: 12.0,
    category: "Books",
    image: "https://picsum.photos/seed/4/400/300",
    description:
      "A gripping mystery novel following detective Anna Reyes as she unravels a decades-old disappearance in a small coastal town where nothing is as it seems.",
  },
  {
    id: 5,
    name: "Building Blocks Set",
    price: 24.99,
    category: "Toys",
    image: "https://picsum.photos/seed/5/400/300",
    description: "500-piece creative building block set compatible with major brands.",
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 129.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/6/400/300",
    description:
      "Track your heart rate, sleep, and workouts with this waterproof smart watch featuring a vibrant AMOLED display and 7-day battery life.",
  },
  {
    id: 7,
    name: "Denim Jacket",
    price: 45.0,
    category: "Clothing",
    image: "https://picsum.photos/seed/7/400/300",
    description: "Classic denim jacket with a relaxed fit, perfect for layering in any season.",
  },
  {
    id: 8,
    name: "Table Lamp",
    price: 34.5,
    category: "Home",
    image: "https://picsum.photos/seed/8/400/300",
    description: "Minimalist table lamp with adjustable brightness and warm LED lighting.",
  },
  {
    id: 9,
    name: "Cook Book: Everyday Flavors",
    price: 19.99,
    category: "Books",
    image: "https://picsum.photos/seed/9/400/300",
    description: "100 easy recipes for busy weeknights, from quick pastas to one-pan dinners.",
  },
  {
    id: 10,
    name: "Remote Control Car",
    price: 39.99,
    category: "Toys",
    image: "https://picsum.photos/seed/10/400/300",
    description: "High-speed RC car with rechargeable battery and all-terrain tires.",
  },
  {
    id: 11,
    name: "Bluetooth Speaker",
    price: 49.0,
    category: "Electronics",
    image: "https://picsum.photos/seed/11/400/300",
    description: "Portable waterproof speaker with rich bass and 12-hour playtime.",
  },
  {
    id: 12,
    name: "Running Shoes",
    price: 89.99,
    category: "Clothing",
    image: "https://picsum.photos/seed/12/400/300",
    description:
      "Lightweight running shoes with responsive cushioning, breathable mesh upper, and a durable rubber outsole built for long-distance comfort.",
  },
];

const PAGE_SIZE = 6;

function truncate(text, max = 100) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "..." : text;
}

export default function ProductPage({ products = SAMPLE_PRODUCTS }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [draftSortBy, setDraftSortBy] = useState("");
  
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  
  const [page, setPage] = useState(1);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);
  const hasActiveFilters = minPrice !== "" || maxPrice !== "" || sortBy !== "";
  

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

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setSortBy(draftSortBy);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setPage(1);
    setFilterMenuAnchor(null);
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
    setFilterMenuAnchor(null);
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
            {paginated.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
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
                    ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {truncate(product.description, 100)}
                    </Typography>
                </CardContent>
                </Card>
            </Grid>
            ))}

            {paginated.length === 0 && (
            <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 6 }}>
                No products match your filters.
                </Typography>
            </Grid>
            )}
        </Grid>

        {filtered.length > 0 && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Pagination
                count={pageCount}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
            />
            </Box>
        )}
        </Container>
    );
}
