import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import { Consts } from './Const.js';

class DatabaseManager {
    inventory = null; 

    static async init() {
        try {
            console.log(Consts.DATABASE_URI)
            if (!mongoose.connection.readyState) {
                mongoose.connect(Consts.DATABASE_URI).then(() => {
                    this.setupSchema();
                    console.log('Database connected')

                }).catch((err) => {
                    console.log("Failed to connect MongoDB!");
                    console.error(err);
                });
            } else
                this.setupSchema();

        } catch (ex) {
            console.log("Failed to connect MongoDB!");
            throw ex;
        }
    }
    static setupSchema() {
        this.inventory = Inventory.init()
    }
}


export default DatabaseManager