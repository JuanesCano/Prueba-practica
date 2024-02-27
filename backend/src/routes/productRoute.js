import productCtrl from "../controllers/productController.js";

const productRoutes = (fastify, opts, done) => {
    fastify.get("/", productCtrl.getAllProducts);
    fastify.get("/:id", productCtrl.getProductById);

    fastify.post("/", productCtrl.createProduct);

    fastify.put("/:id", productCtrl.updateProductById);

    fastify.delete("/:id", productCtrl.deleteProductById);

    done();
};

export default productRoutes;