import type { AdminProductListItem } from "@/types/adminProduct";

/**
 * Remove when the real `GET` products API is wired (e.g. TanStack Query in AdminProductListPage).
 */
export const MOCK_ADMIN_PRODUCTS: AdminProductListItem[] = [
  {
    id: "1",
    title: "Incremental rotary encoder – 1000 PPR",
    description: "Suitable for CNC feedback; 5V line driver output.",
    price: 12850,
    showInFrontend: true,
    imageUrl: "https://placehold.co/96x64/e2e8f0/64748b?text=Enc",
  },
  {
    id: "2",
    title: "Mean Well SMPS 24V / 10A",
    description: "Closed-frame industrial supply; 2 year warranty.",
    price: 4200,
    showInFrontend: true,
    imageUrl: "https://placehold.co/96x64/dbeafe/1e40af?text=SMPS",
  },
  {
    id: "3",
    title: "Proximity sensor – M18 barrel",
    description: "NPN NO, 3-wire; bulk stock (not on storefront yet).",
    price: 890,
    showInFrontend: false,
    imageUrl: "https://placehold.co/96x64/f1f5f9/64748b?text=Sensor",
  },
  {
    id: "4",
    title: "Limit switch, roller lever",
    description: "OMRON family compatible; internal SKU only for now.",
    price: 345,
    showInFrontend: false,
    imageUrl: "https://placehold.co/96x64/fef3c7/92400e?text=Limit",
  },
  {
    id: "5",
    title: "Encoder cable assembly – 3m",
    description: "Shielded, M12 to flying leads.",
    price: 2100,
    showInFrontend: true,
    imageUrl: "https://placehold.co/96x64/dcfce7/166534?text=Cable",
  },
];
