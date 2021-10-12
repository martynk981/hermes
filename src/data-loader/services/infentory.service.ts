import { Injectable } from '@nestjs/common';
import { ArticleModel } from 'src/database/models/article.model';
import { ArticleRepository } from 'src/database/repositories/article.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  addArticle(article: ArticleModel) {
    this.articleRepository.upsertArticle(article);
  }

  async addArticles(articles: Array<ArticleModel>) {
    this.articleRepository.batchInsert(articles);
  }
}
