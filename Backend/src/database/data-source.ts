import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv"
import "reflect-metadata";
dotenv.config()
export const dbdataSource: DataSourceOptions = {
    type: 'postgres',
    database: process.env.DB_NAME || 'jobportalorm',
    entities: ['src/**/*.entity.{js,ts}'],
    migrations: ['src/database/migrations/*.{js,ts}'],
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    synchronize: false,
    logging: true,
  };
  const dataSource = new DataSource(dbdataSource);
  export default dataSource;
  
