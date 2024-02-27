import clientCtrl from "../controllers/clientController.js";

const clientRoutes = (fastify, opts, done) => {
    fastify.get("/", clientCtrl.getAllClient);
    fastify.get("/:id", clientCtrl.getClientById);

    fastify.post("/", clientCtrl.createClient);

    fastify.put("/:id", clientCtrl.updateClientById);

    fastify.delete("/:id", clientCtrl.deleteClientById);

    done();
};

export default clientRoutes;