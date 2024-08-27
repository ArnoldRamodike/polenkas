import * as express from 'express';
import * as cors from 'cors'
import {createConnection} from "typeorm"
import { Request, Response } from 'express';
import * as amqp from 'amqplib/callback_api'
import { Product } from './entity/product';
import axios from 'axios';

createConnection().then(db  => {
   const productRepository = db.getMongoRepository(Product);

    amqp.connect(process.env.RABBITMQ_CONNECTION,  (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error0;
            }

            channel.assertQueue("product_gets", {durable: false} )
            channel.assertQueue("product_created", {durable: false} )
            channel.assertQueue("product_updated", {durable: false} )
            channel.assertQueue("product_liked", {durable: false} )
            channel.assertQueue("product_deleted", {durable: false} )


        
    const app = express();

    app.use(cors({
        origin: ["http://localhost:3000","http://localhost:8000","http://localhost:8001","http://localhost:4200", ]
    }));

    app.use(express.json());

    channel.consume("product_created", async (msg) =>{
        const eventroduct: Product = JSON.parse(msg.content.toString());

        const product = new Product();
        product.admin_id = parseInt(eventroduct.id);
        product.title = eventroduct.title
        product.likes = eventroduct.likes

        await productRepository.save(product);
        console.log("Product Created");

        console.log(msg.content.toString());
        
    }, {noAck: true});

    channel.consume("product_gets", async (msg) =>{
        
        console.log("Product Displays all here");

        
    }, {noAck: true});
    
    channel.consume("product_liked", async (msg) =>{  
        console.log("Admin liked successfully");
        
    }, {noAck: true});

    channel.consume("product_updated", async (msg) =>{
        const eventroduct: Product = JSON.parse(msg.content.toString());

        const product = await productRepository.findOneById(parseInt(eventroduct.id));

        productRepository.merge(product, {
        title : eventroduct.title,
        image: eventroduct.image,
        likes : eventroduct.likes,
        })
   

        await productRepository.save(product);
        console.log("Product Updated");

        console.log(msg.content.toString());
        
    }, {noAck: true});
    
    channel.consume("product_deleted", async (msg) =>{
        const admin_id = parseInt(msg.content.toString());


        await productRepository.delete(admin_id);

        console.log("Product deleted successfully");
        
    }, {noAck: true});




    app.get("/api/products", async (req: Request, res: Response ) => {
        const products = await productRepository.find();

        return res.send(products);
    });

    app.get("/api/products/:id", async (req: Request, res: Response ) => {
        const product = await productRepository.findOneById(req.params.id);

        return res.send(product);
    });

    app.post("/api/products/:id/like",  async  (req: Request, res: Response ) => {
        const product = await productRepository.findOneById( req.params.id);
        await axios.post(`http://localhost:8000/api/products/${product.admin_id}/like`, {})
        product.likes++;
        const result = await productRepository.save(product);
        return res.send(result);
    } );


    console.log('server runnning on port 8001');

    app.listen( 8001);
    process.on('beforeExit', () => {
        console.log("closing");
        connection.close();
    })
})
    })

});
