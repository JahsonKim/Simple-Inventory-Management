
import { Router, json } from 'express';
var router = Router();
import bodyParser from "body-parser";
import _ from 'lodash';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import ejs from 'ejs'
import InventoryHandler from './InventoryHandler.js';

export function init(app, express) {
    var self = this;

    app.use(json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    /**
     * ejs views
     */

    app.use(express.static(path.join(__dirname, '/../public')));
    const viewsPath = path.join(__dirname, '/../views');
    app.set('view engine', 'ejs');
    app.set('views', viewsPath);

    app.use(function (req, res, next) {
        //This line allows cross-site access from authorised headers
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,accept, Content-Type,access-token,Authorization");
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');

        next();
    });

    router.use("/inventory", InventoryHandler);
    app.use("/", router);
    //Load the default page
    router.get('/', function (req, res) {
        res.render('index')
    });

    app.use((err, req, res, next) => {
        console.log("Error 500 " + err.message);
        res.status(err.status || 500);
        res.send({
            status: 500,
            title: "Internal Server Error",
            message: 'An error occurred trying to process your request ' + err.message
        });
        return;

    });

} 