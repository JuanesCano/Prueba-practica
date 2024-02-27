import { response } from "../helpers/response.js";
import { inventoryModel } from "../models/inventoryModel.js";
import { productModel } from "../models/productModel.js"

const inventoryCtrl = {}

//crear inventario
inventoryCtrl.createInventory = async (req, reply) => {
    const { product, amount } = req.body

    try {
        //verificamos si el producto existe
        const productExist = await productModel.findById(product);

        if (!productExist) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        const newInventaryItem = await inventoryModel.create({ product, amount });

        productExist.stock += amount,
            await productExist.save();

        response(reply, 201, true, newInventaryItem, "Registro de inventario creado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener todos los items del inventario
inventoryCtrl.getAllInventoryItems = async (req, reply) => {
    try {
        const inventoryItems = await inventoryModel.find().populate({
            path: "product",
            populate: {
                path: "category",
            },
        }).sort({ createdAt: "desc" });

        response(reply, 200, true, inventoryItems, "Registros de inventario")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener un registro de inventario por id
inventoryCtrl.getInventoryItemById = async (req, reply) => {
    const inventoryItemId = req.params.id

    try {
        const inventoryItem = await inventoryModel.findById(inventoryItemId).populate("product");

        if (!inventoryItem) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        response(reply, 200, true, inventoryItem, "Registro de inventario")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener inventario por id de producto
inventoryCtrl.getInventoryByProduct = async (req, reply) => {
    const productId = req.params.id;

    try {
        //verificar si el producto existe
        const productExist = await inventoryModel.find({ product: productId }).populate("product");

        if (!productExist) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        response(reply, 200, true, productExist, "Inventario del producto")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//actualizar inventario por su id
inventoryCtrl.updateInventoryItemById = async (req, reply) => {
    const inventoryItemId = req.params.id;
    const { product, amount } = req.body;

    try {
        //verificar si el producto existe
        const productExist = await inventoryModel.find({ product: product}).populate("product");

        if (!productExist) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        //obtener el registro de inventario antes de la actualizacion
        const existingInventoryItem = await inventoryModel.findById(inventoryItemId);

        if (!existingInventoryItem) {
            return response(reply, 404, false, "", "inventario no encontrado")
        };

        //restaurar el stock original antes de la actualizacion
        productExist.stock -= existingInventoryItem.amount;
        await productExist.save();

        //actualizar registro del inventario y stock
        const updateInventoryItem = await inventoryModel.findByIdAndUpdate(
            inventoryItemId,
            {
                product,
                amount
            },
            {
                new: true
            }
        )

        productExist.stock += amount;
        await productExist.save();

        response(reply, 200, true, updateInventoryItem, "Inventario actualizado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//eliminar inventario por su id
inventoryCtrl.deletedInventoryItemById = async(req, reply) => {
    const inventoryItemId = req.params.id

    try {
        //obtener inventario antes de la eliminacion
        const existingInventoryItem = await inventoryModel.findById(inventoryItemId);

        if (!existingInventoryItem) {
            return response(reply, 404, false, "", "inventario no encontrado")
        };

        //restaurar stock original ants de la eliminacion
        const productExist = await productModel.findById(existingInventoryItem.product);

        productExist.stock -= existingInventoryItem.amount;
        await productExist.save();

        //eliminar el inventario
        const deletedInventoryItem = await inventoryModel.findByIdAndDelete(inventoryItemId);

        if (!deletedInventoryItem) {
            return response(reply, 404, false, "", "inventario no encontrado")
        };

        response(reply, 200, true, "", "Registro no encontrado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

export default inventoryCtrl;