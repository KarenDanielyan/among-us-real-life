import { Injectable } from '@nestjs/common';
import { Connection, getConnection, createConnection, getManager } from 'typeorm';


async function createPostgreSQLConnection() {
  const manager = getManager();

  const query = manager.createQueryBuilder()
  .insert()
  .into('gago')
  .values([
      { mek: 1 },
      { mek:2 },
  ])
  
  console.log('-----------------------------------',{rawSql: query.getSql()});
  const answer = query.execute();
  console.log({answer}, '------------------------------------');
  
  console.log('PostgreSQL connection created');
  return answer
}

@Injectable()
export class UserService {
    private connection :Connection;
    constructor() {
        //this.connection = getConnection('usertwo');
      }
    
      async getData(): Promise<any> {
        const res = await createPostgreSQLConnection();
          // const res =await this.connection.query('SELECT * FROM channels'); 
          return JSON.stringify(res);
      }
/*   async findAll() {
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    return users;
  } */
}