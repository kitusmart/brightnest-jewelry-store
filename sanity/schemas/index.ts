// sanity/schemas/index.ts

import { categoryType } from "./categoryType";
import { customerType } from "./customerType";
import { orderType } from "./orderType";
import { productType } from "./productType";
// 1. Import the review schema you created
import { reviewType } from "./reviewType";
import address from "./address";

// This is a NAMED export
export const schemaTypes = [
  categoryType,
  customerType,
  orderType,
  productType,
  reviewType, // 2. Add it here to the array
  address,
];
