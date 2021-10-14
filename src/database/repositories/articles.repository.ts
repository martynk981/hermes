import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { SellArticleDto } from '../dto/sell-article.dto';
import { ArticleModel } from '../models/article.model';

@Injectable()
export class ArticlesRepository {
  private tableName = 'articles';

  constructor(@InjectKnex() private readonly dbClient: Knex) {}

  async upsert(articles: Array<ArticleModel>): Promise<void> {
    await this.dbClient.transaction((trx) => {
      return this.dbClient(this.tableName)
        .transacting(trx)
        .returning('id')
        .insert(articles)
        .onConflict('id')
        .merge()
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }

  async sellArticle(sellArticles: SellArticleDto[]) {
    return this.dbClient.transaction((trx) => {
      const queries = [];
      sellArticles.forEach((sellArticle) => {
        const query = this.dbClient(this.tableName)
          .where('id', sellArticle.id)
          .update({
            stock: this.dbClient.raw(`?? - ${sellArticle.sellQuantity}`, ['stock']),
          })
          .transacting(trx);
        queries.push(query);
      });

      Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });
  }
}
