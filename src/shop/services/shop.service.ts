import { Injectable } from '@nestjs/common';

import { ProductAvailabilityDto } from '../../database/dto/product-availability.dto';
import { SellArticleDto } from '../../database/dto/sell-article.dto';
import { ProductContentModel } from '../../database/models/product-content.model';
import { ProductsRepository } from '../../database/repositories/products.repository';
import { ArticlesRepository } from '../../database/repositories/articles.repository';
import { SellProductDto } from '../dto/sell-product.dto';

@Injectable()
export class ShopService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly articleRepository: ArticlesRepository,
  ) {}

  async getProductList(): Promise<ProductAvailabilityDto[]> {
    return await this.productsRepository.getProductsAvailability();
  }

  async getProductContent(productId: number): Promise<ProductContentModel[]> {
    return await this.productsRepository.getProductContent(productId);
  }

  async isProductAvailable({ productId, sellQuantity }: SellProductDto) {
    const productAvailability = await this.productsRepository.getProductsAvailability(productId);
    if (productAvailability && productAvailability.length) {
      return productAvailability[0].quantity >= sellQuantity;
    }

    return false;
  }

  async sellProduct({ productId, sellQuantity }: SellProductDto) {
    const productContent = await this.getProductContent(productId);
    const sellArticles: SellArticleDto[] = productContent.map((pc) => {
      const sellArticle = new SellArticleDto();
      sellArticle.id = pc.article_id;
      sellArticle.sellQuantity = pc.quantity * sellQuantity;

      return sellArticle;
    });

    await this.articleRepository.sellArticle(sellArticles);
  }
}
