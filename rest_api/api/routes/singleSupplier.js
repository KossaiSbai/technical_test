const apiManager = require('../api_manager');
const express = require('express');
const router = express.Router();
const suppliers = ["jeff","dave","eric"];


/**
 * Checks whether the given string input is a valid supplier id. 
 * @param {String} input string to be verified
 * @return {boolean}  
 */
function validSupplierID(input)
{
  return suppliers.includes(input);
}

/**
 * Route which returns the taxis, for the supplier identified by supplierID, and for the given pickup and drop-off locations. 
 */
router.get('/:supplierID/:pickupLocation/:dropoffLocation/', async function(req, res, next) {
   if(!validSupplierID(req.params.supplierID)) return next(new Error("Invalid supplier ID"));
   var taxis = await apiManager.oneSupplierTaxis(req.params.pickupLocation,req.params.dropoffLocation,req.params.supplierID);
   res.send(taxis);
  })

/**
 * Route which returns the taxis, for the supplier identified by supplierID, for the given pickup and drop-off locations and for the given number of passengers.  
 */  
router.get('/:supplierID/:pickupLocation/:dropoffLocation/:numberOfPassengers', async function(req, res, next) {
  if(!validSupplierID(req.params.supplierID)) return next(new Error("Invalid supplier ID"));
  var taxis = await apiManager.oneSupplierTaxis(req.params.pickupLocation,req.params.dropoffLocation,req.params.supplierID, req.params.numberOfPassengers);
  res.send(taxis);
})




module.exports = router;