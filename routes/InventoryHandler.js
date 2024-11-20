
import { Router } from 'express';
var InventoryHandler = Router(); 
import InventoryLogic from '../logic/Inventory.js';



InventoryHandler.get('/list', function (req, res) {
    InventoryLogic.list(req.query, function (result) {
        res.json(result)
    });
}); 
InventoryHandler.post('/create', function (req, res) {
    InventoryLogic.create(req.body, function (result) {
        res.json(result)
    });
});

InventoryHandler.post('/update', function (req, res) {
    InventoryLogic.update(req.body,  function (result) {
        res.json(result)
    });
});
InventoryHandler.delete('/delete', function (req, res) {
    InventoryLogic.delete(req.body.productID,  function (result) {
        res.json(result)
    });
});
 
   
export default InventoryHandler

