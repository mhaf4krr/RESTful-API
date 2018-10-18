/*  Mosh Hamadani NodeJS Tutorial */

const express = require('express');


/* JOI is used for validating API requests here */
const joi = require('joi');

const app = express();

/* Acts as a middleware and a body parser for POST requests , we can also use another package called body-parser */
app.use(express.json());

/* Creates an empty array for testing Purpose */
let products = [];

/* General Functions */

ValidateUID = (uid) =>{
   return products.findIndex((product)=>{
       return product.productUID === uid
    })
}

CheckIfAlreadyExists = (uid) => {
    console.log(uid)
   if(ValidateUID(uid) != -1)
   {
       return true;
   }

   else return false;
}


/* Routing Starts from this point */

app.get('/api/products/:uid',(req,res)=>{
    console.log(req.params.uid)
    let index = ValidateUID(req.params.uid);
    if(index == -1)
    {
        res.send('No such Product Exists');
    }

    else {
        res.send(products[index])
    }
})

app.post('/api/products',(req,res)=>{
    /* Create a schema for JOI to validate */
    const schema = {
        productUID : joi.string().min(5).required(),
        sellerUID : joi.string().min(5).required(),
        productName : joi.string(),
        sellerName : joi.string()
    }

    /*  Make JOI validate request according to the Schema */

    const result = joi.validate(req.body,schema);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }

    else {
        if(!CheckIfAlreadyExists(req.body.productUID))
       { products.push(req.body);
        res.status(200).send('Product has been Added to the List');
       }
        else {
            res.send('Product already Exists in the List')
        }
    }
})


app.put('/api/products/:uid',(req,res)=>{
    let index = ValidateUID(req.params.uid);
    if(index == -1)
    {
        res.send('No such Product Exists');
    }

    else {
        products[index]=req.body;
        res.send('Item has been Modified');
    }

})

app.listen(3000)
