export const mockEnquiries = [
  { id: 1, supplier: "Steel Corp Ltd", material: "Mild Steel Sheets", quantity: 500, status: "Pending" },
  { id: 2, supplier: "Allied Metals", material: "Aluminum Rods", quantity: 200, status: "Responded" },
  { id: 3, supplier: "RawMat India", material: "Copper Wire", quantity: 1000, status: "Closed" },
  { id: 4, supplier: "Bharat Alloys", material: "Stainless Steel Pipes", quantity: 150, status: "Pending" },
];

export const mockQuotations = [
  { id: 1, supplier: "Steel Corp Ltd", material: "Mild Steel Sheets", price: 45000, leadTime: "7 days", status: "Received" },
  { id: 2, supplier: "Allied Metals", material: "Aluminum Rods", price: 32000, leadTime: "10 days", status: "Under Review" },
  { id: 3, supplier: "RawMat India", material: "Copper Wire", price: 78000, leadTime: "5 days", status: "Approved" },
];

export const mockPurchaseOrders = [
  { id: "PO-2024-001", supplier: "Steel Corp Ltd", material: "Mild Steel Sheets", amount: 225000, status: "Approved" },
  { id: "PO-2024-002", supplier: "Allied Metals", material: "Aluminum Rods", amount: 64000, status: "Pending" },
  { id: "PO-2024-003", supplier: "RawMat India", material: "Copper Wire", amount: 78000, status: "Delivered" },
  { id: "PO-2024-004", supplier: "Bharat Alloys", material: "SS Pipes", amount: 95000, status: "Pending" },
];

export const mockReceipts = [
  { id: 1, poId: "PO-2024-001", material: "Mild Steel Sheets", quantity: 500, receivedDate: "2024-03-15", status: "Inspected" },
  { id: 2, poId: "PO-2024-003", material: "Copper Wire", quantity: 1000, receivedDate: "2024-03-18", status: "Pending Inspection" },
];

export const mockInspections = [
  { id: 1, batchId: "BATCH-001", material: "Mild Steel Sheets", quantity: 500, status: "Accepted", inspectedDate: "2024-03-16" },
  { id: 2, batchId: "BATCH-002", material: "Copper Wire", quantity: 1000, status: "Pending", inspectedDate: "" },
  { id: 3, batchId: "BATCH-003", material: "Aluminum Rods", quantity: 200, status: "Rejected", inspectedDate: "2024-03-17" },
];

export const mockInventory = [
  { id: 1, material: "Mild Steel Sheets", quantity: 450, maxQuantity: 1000, location: "Warehouse A", unit: "pcs" },
  { id: 2, material: "Aluminum Rods", quantity: 180, maxQuantity: 500, location: "Warehouse B", unit: "kg" },
  { id: 3, material: "Copper Wire", quantity: 800, maxQuantity: 1500, location: "Warehouse A", unit: "m" },
  { id: 4, material: "Stainless Steel Pipes", quantity: 50, maxQuantity: 300, location: "Warehouse C", unit: "pcs" },
  { id: 5, material: "Plastic Granules", quantity: 2000, maxQuantity: 5000, location: "Warehouse B", unit: "kg" },
];

export const mockBOMs = [
  { id: 1, product: "Speed Motor 500W", materials: [
    { material: "Mild Steel Sheets", quantity: 5 },
    { material: "Copper Wire", quantity: 50 },
    { material: "Plastic Granules", quantity: 2 },
  ]},
  { id: 2, product: "Speed Motor 1000W", materials: [
    { material: "Mild Steel Sheets", quantity: 8 },
    { material: "Copper Wire", quantity: 100 },
    { material: "Aluminum Rods", quantity: 3 },
  ]},
];

export const mockOrders = [
  { id: "ORD-001", customer: "ABC Industries", product: "Speed Motor 500W", quantity: 50, status: "Confirmed", date: "2024-03-10" },
  { id: "ORD-002", customer: "XYZ Enterprises", product: "Speed Motor 1000W", quantity: 20, status: "Pending", date: "2024-03-12" },
  { id: "ORD-003", customer: "Delta Corp", product: "Speed Motor 500W", quantity: 100, status: "Pending", date: "2024-03-14" },
  { id: "ORD-004", customer: "Global Tech", product: "Speed Motor 1000W", quantity: 30, status: "Confirmed", date: "2024-03-15" },
];
