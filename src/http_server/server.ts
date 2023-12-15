// Import necessary modules
import * as http from 'http';
import {Client} from "pg";

// Configure the HTTP server to respond with "Hello, World!" to all requests.
const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Set up JSON responses
  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'OPTIONS'){
    res.writeHead(200);
    res.end();
    return;
  }
   const products =  await getProducts();
   console.log(req.url);
   if (req.url=="/products")
   {
    res.writeHead(200, {'Content-Type': 'application/json'
  });
    res.end((JSON.stringify(products)));

    return;
   }
   res.writeHead(404, {'Content-Type': 'text/plain'});
   res.end("Page not Found");
});
// Set up the server to listen on port 3000 and IP address 127.0.0.1.
const PORT: number = 3000;
const IP: string = '127.0.0.1';
server.listen(PORT, IP, () => {
  console.log(`Server running at http://${IP}:${PORT}/`);
});

async function getProducts()
{


    const dbOptions = {
        user: "postgres",
        host: "shopdatabe.cibsgi0q6iii.us-east-1.rds.amazonaws.com",
        database: "shop",
        password: "SamandFrodoareaCouple!125",
        port: 5432,
        ssl: {
          rejectUnauthorized: false,
        }
        };
      const client = new Client(dbOptions)
      try {
        await client.connect(); // Connect to the PostgreSQL database
    
        // Execute a sample query
        const res = await client.query('SELECT * FROM products');
        const data = res.rows;
    
        return data;

      } 
      catch (error) {
        console.error(error)
      } finally {
        await client.end(); // Close the database connection
    }
    
}