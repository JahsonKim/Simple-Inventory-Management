

import express from 'express';
import { createServer } from 'http';
const app = express()

var httpServer = createServer(app);
httpServer.listen(3000, function () {
    console.log('Server listening on port 3000!');
});
/*** end of express server init */

/** Database connection */
import DatabaseManager from './lib/DatabaseManager.js'
DatabaseManager.init()
/** end of Database connection */ 

/*** initiate api routes  */
import { init } from './routes/RouteHandler.js';
init(app, express);
 