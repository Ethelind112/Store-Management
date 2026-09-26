import { Chip, Stack } from "@mui/material";

const CATEGORIES = ["All", "Electronics", "Clothing", "Home", "Books", "Toys"];

interface CategoryChipsProps {
    handleCategoryClick: (cat: string) => void;
    category: string;
}

function CategoryChip({handleCategoryClick, category}: CategoryChipsProps) {
    return (
        <>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, overflowX: "auto" }}>
                {CATEGORIES.map((cat) => (
                <Chip
                    key={cat}
                    label={cat}
                    color={category === cat ? "primary" : "default"}
                    variant={category === cat ? "filled" : "outlined"}
                    onClick={() => handleCategoryClick(cat)}
                    clickable
                />
                ))}
            </Stack>
        </>
    )
}

export default CategoryChip;