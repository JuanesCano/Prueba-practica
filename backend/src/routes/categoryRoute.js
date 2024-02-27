import categoryCtrl from "../controllers/categoryController.js";

const categoryRoutes = (fastify, opts, done) => {
    fastify.get("/", categoryCtrl.getAllCategories);
    fastify.get("/:id", categoryCtrl.getCategoryById);

    fastify.post("/", categoryCtrl.createCategory);

    fastify.put("/:id", categoryCtrl.updateCategoryById);

    fastify.delete("/:id", categoryCtrl.deleteCategoryById);

    done();
};

export default categoryRoutes;