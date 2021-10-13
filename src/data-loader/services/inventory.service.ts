import { Injectable } from '@nestjs/common';
import { ArticleModel } from 'src/database/models/article.model';
import { ProductContentModel } from 'src/database/models/product-content.model';
import { ProductModel } from 'src/database/models/product.model';
import { ArticlesRepository } from 'src/database/repositories/articles.repository';
import { ProductsRepository } from 'src/database/repositories/products.repository';
import { ArticleDto } from '../dto/article.dto';
import { ProductDto } from '../dto/product.dto';
import { ProductInsertDto } from '../dto/products/product-insert.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async loadInventory(articlesDto: Array<ArticleDto>) {
    const articles = articlesDto.map((dto) => {
      const article = new ArticleModel();
      article.id = dto.art_id;
      article.name = dto.name;
      article.stock = dto.stock;

      return article;
    });
    await this.articlesRepository.batchInsert(articles);
  }

  loadProducts(productsDto: Array<ProductDto>): Promise<number[]> {
    const data: ProductInsertDto = productsDto.reduce(
      (acc, dto) => {
        const product = new ProductModel();
        product.name = dto.name;

        const productContent = dto.contain_articles.map((contentDto) => {
          const contentModel = new ProductContentModel();
          contentModel.article_id = contentDto.art_id;
          contentModel.quantity = contentDto.amount_of;
          return contentModel;
        });

        acc.products.push(product);
        acc.productsContent.push(productContent);
        return acc;
      },
      {
        products: [],
        productsContent: [],
      },
    );

    return this.productsRepository.insertProducts(data);
  }
}
