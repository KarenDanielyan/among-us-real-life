import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { ProcessEnvOptions } from "child_process";
import { config } from 'dotenv';
config();


const configg :TypeOrmModuleOptions= 
{
    
    type : 'postgres',
    host: process.env.HOST,
    port:5432,
    database: process.env.DATABASE as string,
    username: process.env.USE,
    password:  process.env.PASSWORD as string,
    autoLoadEntities: true,
    synchronize: true,
    entities:['src/**/*.entity.ts'],
    ssl: false,
}

export default configg