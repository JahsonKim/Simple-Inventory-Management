
import async from 'async'
import Utils from '../lib/Utils.js';
import DatabaseManager from '../lib/DatabaseManager.js';
import Inventory from '../models/Inventory.js';

class InventoryLogic {
    static create(body, callback) {
        async.waterfall([
            function (done) {

                if (Utils.isEmpty(body.name)) {
                    done("Name is required")
                    return
                }

                if (Utils.isEmpty(body.quantityInStock)) {
                    done("quantity In Stock is required")
                    return
                }
                if (Utils.isEmpty(body.price)) {
                    done("Price is required")
                    return
                }
                if (Utils.isEmpty(body.taxRate)) {
                    done("Tax Rate is required")
                    return
                }
                if (Utils.isEmpty(body.category)) {
                    done("Category is required")
                    return
                }
                if (Utils.isEmpty(body.stockStatus)) {
                    done("Stock status is required")
                    return
                }

                done(null)

            },
            function (done) {
                Inventory.findOne({ name: body.name }, function (err, data) {
                    if (!Utils.isEmpty(data)) {
                        done(`Inventory item with ${body.name} already exists`)
                        return
                    }
                    done(null)
                })
            },
            function (done) {
                DatabaseManager.inventory({
                    productID: Utils.randomString(32),
                    name: body.name,
                    description: body.description,
                    brand: body.brand,
                    quantityInStock: body.quantityInStock,
                    price: body.price,
                    taxRate: body.taxRate,
                    batchNumber: body.batchNumber,
                    expiresOn: body.expiresOn,
                    category: body.category,
                    stockStatus: body.stockStatus,
                    createdAt: Utils.now()
                }).save().then((data) => {
                    done(null, data)
                }).catch((err) => {
                    console.log(err)
                    done(`An error has occurred while creating inventory item. Please try again ${err}`, null)
                })
            }

        ], function (err, data) {
            if (err)
                return callback({
                    status: 500,
                    message: err
                })
            return callback({
                status: 200,
                message: "Inventory item created successfully",
                data: data
            })

        })
    }
    static list(body, callback) {
        async.waterfall([
            function (done) {
                DatabaseManager.inventory.countDocuments({})
                    .then((result) => {
                        done(null, result)
                    }).catch((err) => {
                        done(err, null)
                    })
            },
            function (numberOfRecords, done) { 
                var query = {}
                if (body.search) {
                    if (body.search.value != '') {
                        query['$or'] = [
                            { 'name': { $regex: body.search.value, $options: "i" } },
                            { 'category': { $regex: body.search.value, $options: "i" } },
                            { 'stockStatus': { $regex: body.search.value, $options: "i" } },
                        ]
                    }
                }
                var sort = {}
                if (body.order) {
                    var columns = ['name', 'category', 'price', 'taxRate', 'stockStatus']
                    sort[`${columns[parseInt(body.order[0].column) - 1]}`] = body.order[0].dir == 'desc' ? -1 : 1

                }
                // order: [ { column: '0', dir: 'desc' } ],
                // console.log(sort)
                var options = {
                    size: 10,
                    page: body.start ? parseInt(body.start) : 0,
                    sort: sort
                }
                //page 
                Inventory.findAll(query, options, function (err, data) {

                    done(err, numberOfRecords, data)
                })

            },
        ], function (err, numberOfRecords, data) {

            if (err)
                return callback({
                    status: 500,
                    message: "Unable to fetch records",
                    data: []
                })
            return callback({
                status: 200,
                data: data,
                recordsFiltered: numberOfRecords,
                recordsTotal: numberOfRecords
            })

        })
    }
    //update the user details
    static update(body, callback) {
        async.waterfall([
            function (done) {
                if (Utils.isEmpty(body.productID)) {
                    done("Inventory ID is required")
                    return
                }
                if (Utils.isEmpty(body.name)) {
                    done("Name is required")
                    return
                }
                if (Utils.isEmpty(body.quantityInStock)) {
                    done("quantity In Stock is required")
                    return
                }
                if (Utils.isEmpty(body.price)) {
                    done("Price is required")
                    return
                }
                if (Utils.isEmpty(body.taxRate)) {
                    done("Tax Rate is required")
                    return
                }
                if (Utils.isEmpty(body.category)) {
                    done("Category is required")
                    return
                }
                if (Utils.isEmpty(body.stockStatus)) {
                    done("Stock status is required")
                    return
                }
                done(null)
            },
            function (done) {
                Inventory.update({ productID: body.productID },
                    {
                        name: body.name,
                        description: body.description,
                        brand: body.brand,
                        quantityInStock: body.quantityInStock,
                        price: body.price,
                        taxRate: body.taxRate,
                        batchNumber: body.batchNumber,
                        expiresOn: body.expiresOn,
                        category: body.category,
                        stockStatus: body.stockStatus,
                        updatedAt: Utils.now(),

                    }, function (err, data) {
                        if (err) {
                            done(err)
                            return
                        }

                        done(err, data)
                    })
            }
        ], function (err, data) {
            if (err)
                return callback({
                    status: 500,
                    message: err
                })
            return callback({
                status: 200,
                message: `${body.name} - Inventory  successfully updated`,
                data: data
            })

        })
    }
    static delete(productID, callback) {

        async.waterfall([
            function (done) {
                if (Utils.isEmpty(productID)) {
                    done("Inventory ID is required")
                    return
                }
                done(null)
            },
            function (done) {
                Inventory.update({ productID: productID },
                    {
                        isDeleted: true,
                        deletedOn: Utils.now()
                    }, function (err, data) {
                        if (err) {
                            done(err)
                            return
                        }
                        if (Utils.isEmpty(data)) {
                            done('Inventory item was not found.')
                            return
                        }
                        done(null, data)

                    });
            }
        ], function (err, data) {
            if (err)
                return callback({
                    status: 500,
                    message: err,
                })
            return callback({
                status: 200,
                message: `${data.name} has been deleted`
            })

        })
    }

}


export default InventoryLogic