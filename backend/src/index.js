import Fastify from 'fastify';
import cors from '@fastify/cors';
import formBody from '@fastify/formbody';

//routes
import categoryRoutes from './routes/categoryRoute.js';
import clientRoutes from './routes/clientRoute.js';
import inventoryRoutes from './routes/inventoryRoute.js';
import productRoutes from './routes/productRoute.js';
import saleRoutes from './routes/saleRoute.js';

//DB
import { connectDB } from './database.js';

const fastify = Fastify({ logger: true });

//conectamos a la base de datos
fastify.register(connectDB);

//habilitamos el cors para porder hacer peticiones al backend desde cualquier ip
fastify.register(cors, { origin: '*' });
fastify.register(formBody);

//registramos rutas
fastify.register(categoryRoutes, {prefix: "category"});
fastify.register(clientRoutes, {prefix: "client"});
fastify.register(inventoryRoutes, {prefix: "inventory"});
fastify.register(productRoutes, {prefix: "product"});
fastify.register(saleRoutes, {prefix: "sale"});

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log('Servidor corriendo correctamente');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();