# Sample BookingGo Techincal Test Submission

## Setup

For the console app: 
1. Open Visual Studio Code. Open the folder called console_app.  

2. The following dependencies need to be installed via the npm install --save command:
* abort-controller
* node-fetch

3. Finally in order to run the console app, enter the following command: node app.js {pickup location} {dropoff location} {supplier id} {number of passengers}. The two last parameters are optional. One example command would hence look like the following: node app.js 51.470020,-0.454295 51.00000,1.0000 dave 6. 


For the API: 
1. Open Visual Studio Code. Open the folder called rest_api.  

2. The following dependencies need to be installed via the npm install --save command:
* abort-controller
* node-fetch
* express
* http
* nodemon

3. Finally in order to run the API, enter the following command: npm start. This should trigger nodemon and output in the console: 
* [nodemon] restarting due to changes...
* [nodemon] starting node server.js
At that point, the server should be up. Then the following link needs to be put in a web browser: http://localhost:3000/{route}/{supplier_id}/{pickup location}/{drop-off location}/{number of passengers}
The order of the parameters depends on the route chosen.


## Part 1

### Console application to print the search results for Dave's Taxis

* node app.js 51.470020,-0.454295 51.00000,1.0000 dave 

### Console application to filter by number of passengers

* node app.js 51.470020,-0.454295 51.00000,1.0000 dave 6 (to get for dave only and 6 passengers) 
* node app.js 51.470020,-0.454295 51.00000,1.0000 6 (to get for all suppliers combined and 6 passengers) 

## Part 2
Instructions on how to start the API detailed above. 
Sample requests listed below. 
* http://localhost:3000/singleSupplier/dave/51.470020,-0.454295/51.00000,1.0000 (to get all taxis for dave, no passengers limit)
* http://localhost:3000/singleSupplier/dave/51.470020,-0.454295/51.00000,1.0000 (to get all taxis for dave and 6 passengers)
* http://localhost:3000/allSuppliers/51.470020,-0.454295/51.00000,1.0000 (to get all taxis for all suppliers combined and no passengers limit)
* http://localhost:3000/allSuppliers/51.470020,-0.454295/51.00000,1.0000/6 (to get all taxis for all suppliers combined and 6 passengers limit)

