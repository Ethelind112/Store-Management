// Local product model used by the Cashier page (operates on sample/offline data)
export interface CashierProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: CashierProduct;
  quantity: number;
}

export const SAMPLE_PRODUCTS: CashierProduct[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, dan sayuran segar. Cocok untuk makan siang atau malam.",
    price: 25000,
    category: "Makanan",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Indonesian_Nasi_Goreng.jpg/320px-Indonesian_Nasi_Goreng.jpg",
  },
  {
    id: 2,
    name: "Mie Ayam",
    description: "Mie ayam dengan kuah kaldu yang gurih, dilengkapi pangsit goreng dan sayuran.",
    price: 20000,
    category: "Makanan",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Mie_ayam.jpg/320px-Mie_ayam.jpg",
  },
  {
    id: 3,
    name: "Soto Ayam",
    description: "Soto ayam hangat dengan kuah bening yang kaya rempah, lengkap dengan telur dan bihun.",
    price: 22000,
    category: "Makanan",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Soto_Ayam.jpg/320px-Soto_Ayam.jpg",
  },
  {
    id: 4,
    name: "Es Teh Manis",
    description: "Teh manis dingin yang menyegarkan, cocok menemani makanan Anda.",
    price: 5000,
    category: "Minuman",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Indonesia_teh_manis.jpg/320px-Indonesia_teh_manis.jpg",
  },
  {
    id: 5,
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu kental manis, tebal dan lezat.",
    price: 15000,
    category: "Minuman",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Avocado_juice.jpg/320px-Avocado_juice.jpg",
  },
  {
    id: 6,
    name: "Kopi Hitam",
    description: "Kopi hitam murni tanpa gula, diseduh dengan biji kopi pilihan.",
    price: 10000,
    category: "Minuman",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/320px-A_small_cup_of_coffee.JPG",
  },
  {
    id: 7,
    name: "Pisang Goreng",
    description: "Pisang goreng renyah dengan taburan gula dan keju. Camilan favorit semua orang.",
    price: 12000,
    category: "Snack",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Pisang_goreng.jpg/320px-Pisang_goreng.jpg",
  },
  {
    id: 8,
    name: "Risoles Mayones",
    description: "Risoles isi ayam dan mayones, digoreng hingga keemasan dan renyah.",
    price: 8000,
    category: "Snack",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Risoles.jpg/320px-Risoles.jpg",
  },
  {
    id: 9,
    name: "Bakso Kuah",
    description: "Bakso sapi kenyal dengan kuah kaldu bening dan mi, siap memanjakan lidah.",
    price: 18000,
    category: "Makanan",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Bakso_family.jpg/320px-Bakso_family.jpg",
  },
  {
    id: 10,
    name: "Air Mineral",
    description: "Air mineral bersih dan segar dalam botol 600ml.",
    price: 4000,
    category: "Minuman",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mineral_water_bottle.jpg/320px-Mineral_water_bottle.jpg",
  },
  {
    id: 11,
    name: "Tahu Goreng",
    description: "Tahu goreng renyah di luar, lembut di dalam. Disajikan dengan kecap dan cabai rawit.",
    price: 7000,
    category: "Snack",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Tahu_goreng.jpg/320px-Tahu_goreng.jpg",
  },
  {
    id: 12,
    name: "Tempe Mendoan",
    description: "Tempe mendoan setengah matang dengan bumbu khas Banyumas, cocok sebagai camilan.",
    price: 7000,
    category: "Snack",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tempe_mendoan.jpg/320px-Tempe_mendoan.jpg",
  },
];
