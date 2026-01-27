// sanity/schemas/index.ts

import { categoryType } from "./categoryType";
import { customerType } from "./customerType";
import { orderType } from "./orderType";
import { productType } from "./productType";

// This is a NAMED export
export const schemaTypes = [categoryType, customerType, orderType, productType];
