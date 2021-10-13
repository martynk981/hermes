import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { ArticleModel } from '../models/article.model';

@Injectable()
export class ArticlesRepository {
  private tableName = 'articles';

  constructor(@InjectKnex() private readonly knex: Knex) {}

  batchInsert(articles: Array<ArticleModel>): Promise<number[]> {
    return this.knex<ArticleModel>(this.tableName)
      .returning('id')
      .insert(articles)
      .onConflict('id')
      .merge();
  }
}
