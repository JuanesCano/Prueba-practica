import saleCtrl from "../controllers/saleController.js";

const saleRoutes = (fastify, opts, done) => {
    fastify.get("/", saleCtrl.getAllSales);
    fastify.get("/:id", saleCtrl.getSaleById);

    fastify.post("/", saleCtrl.createSale);

    // fastify.put("/:id", saleCtrl.updateSaleById);

    // fastify.delete("/:id", saleCtrl.deleteSaleById);

    done();
};

export default saleRoutes;