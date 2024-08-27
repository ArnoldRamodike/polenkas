import * as express from 'express';
import * as cors from 'cors'
import {createConnection} from "typeorm"
import { Request, Response } from 'express';
import { Product } from './entity/product';
import * as amqp from 'amqplib/callback_api'

createConnection().then(db  => {
    const productRepository = db.getRepository(Product);

    amqp.connect(process.env.RABBITMQ_CONNECTION,  (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error0;
            }

            console.log("Connection:");
            

            const app = express();

            app.use(cors({
                origin: ["http://localhost:3000","http://localhost:8000","http://localhost:4200", "http://localhost:8001", ]
            }));
        
            app.use(express.json());
        
            app.get("/api/products", async (req: Request, res: Response ) => {
                const products = await productRepository.find();
                channel.sendToQueue("product_gets", Buffer.from(JSON.stringify(products)));
                res.json(products)
            })
        
            app.post("/api/products",  async  (req: Request, res: Response ) => {
                const product = await productRepository.create(req.body);
                const result = await productRepository.save(product);
                channel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));
                return res.send(result);
            } );
        
            app.get("/api/products/:id", async (req: Request, res: Response ) => {
                const product = await productRepository.findOneById(req.params.id!);
        
                return res.json(product)
            })
            app.put("/api/products/:id", async (req: Request, res: Response ) => {
                const product = await productRepository.findOneById( req.params.id);
                productRepository.merge(product, req.body);
                const result = await productRepository.save(product);
                channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)));
                return res.json(result)
            })
            app.delete("/api/products/:id", async (req: Request, res: Response ) => {
                const result = await productRepository.delete(req.params.id);
                channel.sendToQueue("product_deleted", Buffer.from(req.params.id));
                return res.json(result)
            })
        
            app.post("/api/products/:id/like",  async  (req: Request, res: Response ) => {
                const product = await productRepository.findOneById( req.params.id);
                product.likes++;
             
                const result = await productRepository.save(product);
                channel.sendToQueue("product_liked", Buffer.from(JSON.stringify(result)));
                return res.send(result);
            } );
        
            console.log('server runnning on port 8000');
        
            app.listen( 8000);
            process.on('beforeExit', () => {
                console.log("closing");
                connection.close();
            })
        })
    });
});
