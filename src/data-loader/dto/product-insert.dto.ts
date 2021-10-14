import { ProductModel } from '../../database/models/product.model';
import { ProductContentModel } from '../../database/models/product-content.model';

export type ProductInsertDto = {
  products: ProductModel[];
  productsContent: ProductContentModel[][];
};
