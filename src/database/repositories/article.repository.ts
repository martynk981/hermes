import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { ArticleModel } from '../models/article.model';

@Injectable()
export class ArticleRepository {
  private tableName = 'articles';
  private chunkSize = 10;

  constructor(@InjectKnex() private readonly knex: Knex) {}

  upsertArticle(article: ArticleModel) {
    return this.knex(this.tableName).insert(article).onConflict('id').merge();
  }

  batchInsert(articles: Array<ArticleModel>) {
    this.knex.batchInsert(this.tableName, articles, this.chunkSize);
  }
}
