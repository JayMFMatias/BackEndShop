"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const pg_1 = require("pg");
const handler = (event, _context) => __awaiter(void 0, void 0, void 0, function* () {
    // Your Lambda function logic goes here
    const dbOptions = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        ssl: {
            rejectUnauthorized: false,
        }
    };
    const client = new pg_1.Client(dbOptions);
    try {
        yield client.connect(); // Connect to the PostgreSQL database
        // Execute a sample query
        const res = yield client.query('SELECT * FROM products');
        const data = res.rows;
        return {
            statusCode: 200,
            body: JSON.stringify({ data }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error occurred', error: error.message }),
        };
    }
    finally {
        yield client.end(); // Close the database connection
    }
});
exports.handler = handler;
