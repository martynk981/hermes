## Description

Simple warehouse service

## Running the app

```bash
$ docker-compose up -d
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```


## OpenAPI:
[open-api.yml](open-api.yml)
## Tech details

Storage: PostgresDB
APP framework: NestJs
Language: NodeJS+TypeScript


Application consists of two modules:
 *[data-loader](src/data-loader): to upload the data from files 
 *[shop](src/shop): to review and to sell the products
