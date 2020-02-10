const express = require('express');
const app = express();
/**
 * Two routes are defined: 
 * singleSupplier for all taxi queries for a single supplier.
 * allSuppliers for all taxi queries combining all suppliers and returning the cheapest supplier for each car type. 
 */ 

const singleSupplier = require('./api/routes/singleSupplier');
const allSuppliers = require('./api/routes/allSuppliers');
app.use('/singleSupplier',singleSupplier);
app.use('/allSuppliers',allSuppliers);

// In case an invalid link is typed. 
app.use((req,res,next)=> {
    const error = new Error("Invalid link");
    error.status = 404;
    next(error);
}) 

// Other error such as 500 status code.
app.use((error,req,res,next)=> {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
}); 

module.exports = app;