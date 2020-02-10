
const fetch = require('node-fetch')
const abortController = require('abort-controller');
const suppliers =["jeff","eric","dave"];

/**
 * Returns the taxis, provided by the given supplier, for the given pickup location, drop-off location and number of passengers. 
 * @param {String} pickupLocation specified as latitude, longitude (i.e. 51.470020,-0.454295)
 * @param {String} dropoffLocation specified as latitude, longitude (i.e. 51.470020,-0.454295)
 * @param {String} supplierId dave,jeff or eric
 * @param {Number} numberOfPassengers default value equal to 4
 * @return {[String]} list of taxis: for each of them, the car type and the price are returned. 
 */
async function oneSupplierTaxis(pickupLocation,dropoffLocation,supplierId, numberOfPassengers=4)
{
let taxis = await extractTaxisForOneSupplier(pickupLocation,dropoffLocation,supplierId, numberOfPassengers);
let finalOutput = taxis.length == 0  ?  [] :  sortAndReturnTaxis(taxis);
return finalOutput;
}


/**
 * For each car type, returns the taxi with the cheapest supplier, for the given pickup location, drop-off location and number of passengers. 
 * @param {String} pickupLocation specified as latitude, longitude (i.e. 51.470020,-0.454295).
 * @param {String} dropoffLocation specified as latitude, longitude (i.e. 51.470020,-0.454295).
 * @param {Number} numberOfPassengers default value equal to 4.
 * @return {[String]} list of taxis: for each of them, the car type, the price and the supplier are returned. 
 */
async function allSuppliersTaxis(pickupLocation, dropoffLocation, numberOfPassengers=4)
{
let taxis = await extractTaxisForAllSuppliers(pickupLocation, dropoffLocation,suppliers,numberOfPassengers);
if(taxis.length == 0) return [];
let sortedTaxis = sortTaxisList(taxis,priceAndCarTypeOrder);
let finalTaxis = getFinalTaxis(sortedTaxis);
let finalOutput = finalStringOutput(finalTaxis,outputAllSuppliersTaxis);
return finalOutput;
}

/**
 * Sorts a list of taxis by decreasing price order and returns the final output.
 * @param {[[[String,Number],String]]} initialTaxis list of taxis where first element is a list that stores the car type and the price. The second element is the supplier id.
 * @return {[String]} list of taxis: for each of them, the car type and the price are returned.  
 */
function sortAndReturnTaxis(initialTaxis)
{
  sortedTaxis = sortTaxisList(initialTaxis,decreasingPriceOrder);
  finalOutput = finalStringOutput(sortedTaxis,outputOneSupplierTaxi);
  return finalOutput;
}


/**
 * Stores and returns a map, which entries are of the following format: (car type, passenger capacity). 
 * @return {Map<String,Number>} a map associating car types to maximum passengers capacity. 
 */
function vehicleCapacities() {
  let vehiclesPassengerCapacities = new Map();
  vehiclesPassengerCapacities.set("STANDARD", 4);
  vehiclesPassengerCapacities.set("EXECUTIVE", 4);
  vehiclesPassengerCapacities.set("LUXURY", 4);
  vehiclesPassengerCapacities.set("PEOPLE_CARRIER", 6);
  vehiclesPassengerCapacities.set("LUXURY_PEOPLE_CARRIER", 6);
  vehiclesPassengerCapacities.set("MINIBUS", 16);
  return vehiclesPassengerCapacities;
}


/**
 * Queries the Rides platform API via an HTTP GET request and returns an unsorted list of taxis provided by the supplier. 
 * @param {String} pickupLocation specified as latitude, longitude (i.e. 51.470020,-0.454295)
 * @param {String} dropoffLocation specified as latitude, longitude (i.e. 51.470020,-0.454295)
 * @param {String} supplierId dave,jeff or eric
 * @param {Number} numberOfPassengers default value equal to 4
 * @return a list of the extracted taxis from the given supplier
 */
async function extractTaxisForOneSupplier(pickupLocation, dropoffLocation, supplierId, numberOfPassengers = 4) {
  // A timeout of 2 seconds is enforced. If no response is received within that time frame, the supplier will be ignored.  
    const controller = new abortController();
    const timeout = setTimeout(
      () => { controller.abort(); },
      2000,
    );
    
  var vehiclesPassengerCapacities = vehicleCapacities();
  let url = 'https://techtest.rideways.com/' + supplierId + '?pickup=' + pickupLocation + '&dropoff=' + dropoffLocation;
  // The HTTP request is executed via the fetch module. 
  let res = await fetch(url,{ signal: controller.signal })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          var supplier = data.supplier_id;
          // Filters out the vehicle types that do not have enough passenger capacity for the required number of passengers. 
          let enoughCapacity = function (vehicle) {
          return vehiclesPassengerCapacities.get(vehicle.car_type) >= numberOfPassengers;
          }
      
          // Stores the taxi in the following format : [[car type, price], supplier]
          let information = function (vehicle) {
          return [vehicle,supplier];
          }

          if(data.options)
          {
          taxis = data.options.filter(enoughCapacity).map(information);
          return taxis;
          }
          else return [];
        
          
    })
      .catch(err => {
          return [];
    })
      .finally(() => {
          clearTimeout(timeout); 
    });
      return res;
}

/**
 * Queries the Rides platform API via an HTTP GET request and returns an unsorted list of taxis provided by all suppliers. 
 * @param {String} pickupLocation specified as latitude, longitude (i.e. 51.470020,-0.454295)
 * @param {String} dropoffLocation specified as latitude, longitude (i.e. 51.470020,-0.454295)
 * @param {String} supplierId dave,jeff or eric
 * @param {Number} numberOfPassengers default value equal to 4
 * @return {[[[String,Number],String]]} a list of the extracted taxis from the all the suppliers combined together. 
 */
async function extractTaxisForAllSuppliers(pickupLocation, dropoffLocation, suppliers, numberOfPassengers=4) {
  var allTaxis = [];
  for (var i=0; i<suppliers.length; i++) {
    var supplier = suppliers[i];
    taxi = await extractTaxisForOneSupplier(pickupLocation, dropoffLocation, supplier, numberOfPassengers);
    allTaxis =allTaxis.concat(taxi);  
  }
  return allTaxis;
}

/**
 * Sorting function used to sort taxis by decreasing price order.
 * @param {[[String,Number],String]} a taxi 1
 * @param {[[String,Number],String]} b taxi 2
 * @return {Number} -1, 0 or 1 indicating the order between the two taxis.   
 */
function decreasingPriceOrder(a,b)
{
  return a[0].price < b[0].price ? 1 : -1;
}

/**
 * Sorting function used to sort taxis by car_type and increasing price order.
 * @param {[[String,Number],String]} a taxi 1
 * @param {[[String,Number],String]} b taxi
 * @return {Number} -1, 0 or 1 indicating the order between the two taxis.   
 */
function priceAndCarTypeOrder(a,b)
{
   var stringComparison = a[0].car_type.localeCompare(b[0].car_type);
   if(stringComparison == 0) return a[0].price < b[0].price ? -1 : 1;
   else return stringComparison;
}

/**
 * Sorts the list of taxis according to the given sorting function. 
 * @param {[[[String,Number], String]]} taxisList list of taxis.
 * @param {([[String,Number],String], [[String,Number],String]) => Number} sortingFunction  function used to sort the list.
 * @return {[[[String,Number], String]]}  sorted list of taxis. 
 */
function sortTaxisList(taxisList, sortingFunction)
{
taxisList.sort((a, b) => sortingFunction(a,b));
return taxisList;
}

/**
 * Extracts the taxi with the cheapest supplier, from the sorted taxis list, for each car type. 
 * @param {[[[String,Number],String]]} taxisList sorted list of taxis
 * @return {[[[String,Number],String]]} final list of taxis to be returned.   
 */
function getFinalTaxis(taxisList)
{
var current_car_type = taxisList[0][0].car_type;
var final_taxis = [taxisList[0]];
// Takes the first taxi for each car type since it is sorted by car type and increasing price order.
for(let i = 1; i< taxisList.length; i++)
{
    var taxi = taxisList[i];
    if(current_car_type.localeCompare(taxi[0].car_type) != 0) {
      final_taxis.push(taxi); 
      current_car_type = taxi[0].car_type;
  } 
}
return final_taxis;
}

/**
 * Stores in a list, the string outputs according to a printFunction.
 * @param {[[[String,Number],String]]} taxis 
 * @param {([[String,Number],String], [[String,Number],String])} printFunction function which will add the string outputs to the final list. 
 * @return {[String]} the string list
 */  
function finalStringOutput(taxis, printFunction)
{
var final_output = []; 
taxis.forEach(taxi => printFunction(final_output,taxi));
return final_output;
}


/**
 * Returns a list of strings. Each string is the output for a given taxi in the following format: {car type} - {supplier} - {price}. 
 * @param {[String]} final_output string list
 * @param {[[String,Number],String]} taxi each taxi of the taxis list
 * @return {[String]} the string list
 */ 
function outputAllSuppliersTaxis(final_output, taxi)
{
final_output.push(taxi[0].car_type + " - " + taxi[1] + " - " + taxi[0].price);
}

/**
 * Returns a list of strings. Each string is the output for a given taxi in the following format: {car type} - {price}. 
 * @param {[String]} final_output string list
 * @param {[[String,Number],String]} taxi each taxi of the taxis list
 * @return {[String]} the string list
 */ 
function outputOneSupplierTaxi(final_output, taxi)
{
final_output.push(taxi[0].car_type + " - " + taxi[0].price);
}

exports.oneSupplierTaxis = oneSupplierTaxis;
exports.allSuppliersTaxis = allSuppliersTaxis;