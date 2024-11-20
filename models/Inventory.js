import mongoose from 'mongoose';
class Inventory {

    static init() {
        var schema = new mongoose.Schema({
            productID: { type: String, index: true },
            name: String,
            description: String,
            brand: String,
            quantityInStock: Number,
            price: Number,
            taxRate: Number,
            batchNumber: String,
            expiresOn: String,
            category: {
                type: String,
                enum: ['Electronics', 'Clothing', 'Furniture', 'Toys','Food Stuffs'],
                required: true
            },
            stockStatus: {
                type: String,
                enum: ['In Stock', 'Out of Stock', 'Backordered'],
                default: 'In Stock'
            },
            createdAt: Number,
            updatedAt: Number,
            isDeleted: { type: Boolean, default: false },
            deletedOn: String
        });
        this.model = mongoose.model(`shop_inventory`, schema);
        return this.model;

    }

    static findOne(query, callback) {
        query.isDeleted = false
        this.model.findOne(query)
            .then((result) => {
                return callback(null, result)
            }).catch((err) => {
                return callback(err)
            })
    }

    static update(filter, body, callBack) {
        this.model.findOneAndUpdate(filter, body).then((user) => {
            return callBack(null, user);
        }).catch((err) => {
            return callBack(err);
        });

    }
    static findAll(query, options, callback) {
        query.isDeleted = false
        // console.log(JSON.stringify(query))
        this.model.find(query)
            .limit(options.size)
            .skip(options.page)
            .sort(options.sort)
            .then((result) => {
                return callback(null, result)
            }).catch((err) => {
                return callback(err)
            })
    }
}


export default Inventory