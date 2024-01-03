// Import necessary modules
import * as http from 'http';
import {Client} from "pg";
import {CreateProductInput} from "./dataTypes/createProductInput";
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
  if(req.method === 'POST')
  {
    let body:string = "";
    let bodyArray: Uint8Array[] =[];
    req.on('data', (chunk) => 
    {
    console.log(chunk)
    bodyArray.push(chunk);
    }).on('end', async () => 
   {
        body = Buffer.concat(bodyArray).toString();
        console.log(body);
        try 
        {
          if (req.url=="/products")
          {
            const productInput: CreateProductInput = JSON.parse(body);
            const result = await createProduct(productInput);
            console.log(result);
            res.writeHead(201);
            res.end(JSON.stringify(result));
            return;
          }
        } catch (error) {
          console.error(error);
          res.writeHead(400, {'Content-Type': 'application/json' });
          res.end(JSON.stringify(error));
          return;
        }

        
        return;
      // at this point, body has the entire request body stored in it as a string
  });
  }
  if (req.method === 'GET')
  {
    const products =  await getProducts();
    console.log(req.url);
    
    if (req.url=="/products")
    {
      res.writeHead(200, {'Content-Type': 'application/json' });
      res.end((JSON.stringify(products)));
      return;
    }
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("Page not Found");
  }
  if(req.method === 'DELETE')
  { const url = req.url!.split("/");
    console.log(req.url);
    console.log(url);
    if(url[1]== "products")
    {
    const id =url[2];
    if (!id)
    {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end("BAD REQUEST");
    } 
    deleteProduct(id);
    res.writeHead(201);
    res.end();
  }
}

});

// Set up the server to listen on port 3000 and IP address 127.0.0.1.
const PORT: number = 3000;
const IP: string = '127.0.0.1';
server.listen(PORT, IP, () => {
  console.log(`Server running at http://${IP}:${PORT}/`);
});
async function createProduct(input:CreateProductInput) 
{
  const client = new Client(dbOptions)
  try {
    await client.connect(); // Connect to the PostgreSQL database

    // Execute a sample query
    const res = await client.query(`INSERT into products (product_name, product_desc, seller, quantity, price)
    VALUES ('${input.productName}','${input.desc}','${input.sellerName}',${input.quantity},${input.price}) 
    returning *;`);
    const data = res.rows;

    return data;

  } 
  catch (error) {
    console.error(error)
  } finally {
    await client.end(); // Close the database connection
}
  
}
async function getProducts()
{
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
async function deleteProduct(id:string)
{
  const client = new Client(dbOptions)
  try {
    await client.connect(); // Connect to the PostgreSQL database

    // Execute a sample query
    const res = await client.query(`DELETE from products where id=${id}; `);
    
    const data = res.rows;

    return data;

  } 
  catch (error) {
    console.error(error)
  } finally {
    await client.end(); // Close the database connection
}
}