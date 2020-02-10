const express = require('express');
const apiManager = require('../api_manager');
const router = express.Router();




/**
 * Route which returns the taxis, for all the suppliers combined together, for the given pickup and drop-off locations. 
 */  
router.get('/:pickupLocation/:dropoffLocation', async function(req, res, next) {
  var taxis = await apiManager.allSuppliersTaxis(req.params.pickupLocation,req.params.dropoffLocation);
  res.send(taxis);
})



/**
 * Route which returns the taxis, for all the suppliers combined together, for the given pickup and drop-off locations and for the given number of passengers.  
 */  
router.get('/:pickupLocation/:dropoffLocation/:numberOfPassengers', async function(req, res, next) {
    var taxis = await apiManager.allSuppliersTaxis(req.params.pickupLocation,req.params.dropoffLocation,req.params.numberOfPassengers);
    res.send(taxis);
  })


module.exports = router;