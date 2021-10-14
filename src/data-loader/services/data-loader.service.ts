import { Injectable } from '@nestjs/common';
import { ArticleModel } from '../../database/models/article.model';
import { ProductContentModel } from '../..//database/models/product-content.model';
import { ProductModel } from '../..//database/models/product.model';
import { ArticlesRepository } from '../..//database/repositories/articles.repository';
import { ProductsRepository } from '../..//database/repositories/products.repository';
import { ArticleDto } from '../dto/inventory/article.dto';
import { ProductDto } from '../dto/products/product.dto';
import { ProductInsertDto } from '../dto/product-insert.dto';

@Injectable()
export class DataLoaderService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async uploadArticles(articlesDto: Array<ArticleDto>) {
    const articles = articlesDto.map((dto) => {
      const article = new ArticleModel();
      article.id = dto.art_id;
      article.name = dto.name;
      article.stock = dto.stock;

      return article;
    });

    await this.articlesRepository.upsert(articles);
  }

  async uploadProducts(productsDto: Array<ProductDto>) {
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

    await this.productsRepository.insert(data);
  }
}
