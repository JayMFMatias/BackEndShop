import { APIGatewayProxyHandler } from 'aws-lambda';
import {Client} from "pg";

export const handler: APIGatewayProxyHandler = async (event, _context) => {

    // Your Lambda function logic goes here
    
    const dbOptions = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      };
      const client = new Client(dbOptions)
      try {
        await client.connect(); // Connect to the PostgreSQL database
    
        // Execute a sample query
        const res = await client.query('SELECT * FROM your_table');
        const data = res.rows;
    
        return {
          statusCode: 200,
          body: JSON.stringify({ data }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error occurred', error: (error as Error).message }),
        };
      } finally {
        await client.end(); // Close the database connection
      }
}

