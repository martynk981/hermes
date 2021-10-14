import { ProductContentDto } from './product-content.dto';

export type ProductDto = {
  name: string;

  contain_articles: Array<ProductContentDto>;
};
