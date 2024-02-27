import { response } from "../helpers/response.js";
import { clientModel } from "../models/clientModel.js";

const clientCtrl = {}

//crear clientes
clientCtrl.createClient = async (req, reply) => {
    const { name, lastname, cc } = req.body;

    try {
        //verificamos si la cedula esta en uso
        const existingClient = await clientModel.findOne({ cc });

        if (existingClient) {
            return response(reply, 400, false, "", "La cc ya esta registrada")
        };

        const newClient = clientModel.create({ name, lastname, cc });
        response(reply, 201, true, newClient, "Cliente creado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener todos los clientes
clientCtrl.getAllClient = async (req, reply) => {
    try {
        const clients = await clientModel.find().sort({ createdAt: "desc" });
        response(reply, 200, true, clients, "Lista de clientes");
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener clientes por id
clientCtrl.getClientById = async (req, reply) => {
    const clientId = req.params.id;

    try {
        const client = await clientModel.findById(clientId);

        if (!client) {
            return response(reply, 404, false, "", "Cliente no encontrado")
        };

        response(reply, 200, true, client, "Cliente enconrado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//actualizar clientes por id
clientCtrl.updateClientById = async (req, reply) => {
    const clientId = req.params.id;
    const { name, lastname, cc } = req.body;

    try {
        //verificamos si la cedula nueva esta en uso
        const clientExist = await clientModel.findOne({
            cc,
            _id: { $ne: clientId }
        })

        if (clientExist) {
            return response(reply, 404, false, "", "la cedula ya esta registrada")
        };

        const updateClient = await clientModel.findByIdAndUpdate(clientId,
            { name, lastname, cc },
            { new: true });

        if (!updateClient) {
            return response(reply, 404, false, "", "Cliente no encontrado")
        };

        response(reply, 200, true, updateClient, "Cliente actualizado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//eliminar cliente por id
clientCtrl.deleteClientById = async(req, reply) => {
    const clientId = req.params.id;

    try {
        const deletedClient = await clientModel.findByIdAndDelete(clientId);

        
        if (!deletedClient) {
            return response(reply, 404, false, "", "Cliente no encontrado")
        };

        response(reply, 200, true, "", "Cliente eliminado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

export default clientCtrl;