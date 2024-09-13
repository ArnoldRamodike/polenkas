import  express from 'express';
import  cors from 'cors'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// import axios from 'axios';


const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'hhttp://localhost:4200', 'http://localhost:5000']
}))

const prefix = (host: string) => {
    return host.split(".")[0];
}

app.get("/", (req, res) => {

    
    res.send("We are running baby!")
})

app.get("/api/products", async(req, res) => {
    console.log(req.headers.host);
    const products = await prisma[`${prefix(req.headers.host)}Product`].findMany()

    res.send(products)
})
app.post("/api/products", async (req, res) => {
  const product = await prisma[`${prefix(req.headers.host)}Product`].create({
    data:{
        title: req.body.title,
        price: req.body.price
    }
  });

  res.send(product);
})

// app.get("api/products", async(req, res) => {
//     const products = await prisma.shop2Product.findMany({
        
//     })

//     res.send(products)
// })
// app.post("api/products", async (req, res) => {
//   const product = await prisma.shop2Product.create({
//     data:{
//         title: req.body.title,
//         price: req.body.price
//     }
//   });

//   res.send(product);
// })


app.listen( 8000, () => {
    console.log('server runnning on port 8000');
});