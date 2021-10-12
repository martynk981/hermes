#!/bin/bash
set -e
export PGPASSWORD=$POSTGRES_PASSWORD;
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';
  CREATE DATABASE $APP_DB_NAME;
  GRANT ALL PRIVILEGES ON DATABASE $APP_DB_NAME TO $APP_DB_USER;
  \connect $APP_DB_NAME $APP_DB_USER
  BEGIN;
    CREATE TABLE IF NOT EXISTS products (
      id   SERIAL NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id    BIGINT NOT NULL PRIMARY KEY,
      name  VARCHAR(255) NOT NULL,
      stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0)
    );

    CREATE TABLE IF NOT EXISTS products_articles (
      product_id BIGINT NOT NULL,
      article_id BIGINT NOT NULL,
      amount_of  INT NOT NULL CHECK (amount_of >= 0),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (article_id) REFERENCES articles(id)
    );
  COMMIT;
EOSQL