import inventoryCtrl from "../controllers/inventoryController.js";

const inventoryRoutes = (fastify, opts, done) => {
    fastify.get("/", inventoryCtrl.getAllInventoryItems);
    fastify.get("/:id", inventoryCtrl.getInventoryItemById);
    fastify.get("/product/:id", inventoryCtrl.getInventoryByProduct);

    fastify.post("/", inventoryCtrl.createInventory);

    fastify.put("/:id", inventoryCtrl.updateInventoryItemById);

    fastify.delete("/:id", inventoryCtrl.deletedInventoryItemById);

    done();
};

export default inventoryRoutes;