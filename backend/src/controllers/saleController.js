import { response } from "../helpers/response.js";
import { clientModel } from "../models/clientModel.js";
import { productModel } from "../models/productModel.js";
import { saleModel } from "../models/saleModel.js";

const saleCtrl = {};

//crear venta
saleCtrl.createSale = async (req, reply) => {
    const { product, client, amount } = req.body;

    try {
        //verificar si el cliente existe
        const clientExist = await clientModel.findById(client);
        if (!clientExist) {
            return response(reply, 404, false, "", "cliente no encontrado")
        };

        //verificar si el  producto existe y calcular el total
        const productExist = await productModel.findById({ _id: product });

        if (!productExist) {
            return response(reply, 404, false, "", "El producto no fue encontrado")
        };

        if (amount == 0) {
            return response(reply, 400, false, "", `no se puede realizar la compra con 0 cantidades`)
        };

        //verificar si hay stock
        if (productExist.stock < amount) {
            return response(reply, 400, false, "", `El producto no tiene suficiente stock, actualmente tiene ${productExist.stock} unidades disponibles`)
        };


        const saleTotal = productExist.price * amount;

        //crear y actualizar stock
        const newSale = await saleModel.create({
            product, client, amount, total: saleTotal
        });

        // actualziar el stock
        await productExist.updateOne({ stock: productExist.stock - amount })

        response(reply, 201, true, newSale, "Venta creada")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener todas las ventas
saleCtrl.getAllSales = async (req, reply) => {
    try {
        const sales = await saleModel.find().populate("product").populate("client").sort({ createdAt: "desc" })

        response(reply, 200, true, sales, "Lista de ventas")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener ventas por id
saleCtrl.getSaleById = async (req, reply) => {
    const saleId = req.params.id

    try {
        const sale = await saleModel.findById(saleId).populate("products.product").populate("client");

        if (!sale) {
            return response(reply, 404, false, "", "venta no encontrada")
        };

        response(reply, 200, true, sale, "Venta encontrada")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

// EXPLICAR EN EL VIDEO PORQUE NO SE USAN ESTOS CONTROLLERS

// saleCtrl.updateSaleById = async (req, reply) => {
//     const saleId = req.params.id
//     const { products, client, total } = req.body;

//     try {
//         //verificar si el cliente existe
//         const clientExist = await clientModel.findById(client);
//         if (!clientExist) {
//             return response(reply, 404, false, "", "cliente no encontrado")
//         };

//         const saleExist = await saleModel.findById(saleId);
//         if (!saleExist) {
//             return response(reply, 404, false, "", "venta no encontrada")
//         };

//         //restaurar stock original
//         await restoreStockOnSale(saleExist.products);

//         let saleTotal = 0;
//         const productPromises = products.map(async (product) => {
//             const productExist = await productModel.findById(product.producto);

//             if (!productExist) {
//                 return response(reply, 404, false, "", "uno de los productos no fue encontrado")
//             };

//             //verificar si hay stock
//             if (productExist.stock < product.amount) {
//                 return response(reply, 400, false, "", "Insuficiente stock para uno de los productos")
//             };

//             saleTotal += productExist.price * product.amount;
//         })

//         await Promise.all(productPromises);

//         //atualizar la venta y el stock
//         const updateSale = await saleModel.findByIdAndUpdate(
//             saleId,
//             { products, client, total: saleTotal },
//             { new: true }
//         );

//         await updateStockOnSale(products);

//         response(reply, 200, true, updateSale, "Venta actualizada")
//     } catch (error) {
//         response(reply, 500, false, "", error.message)
//     }
// };

//eliminar venta por id
// saleCtrl.deleteSaleById = async (req, reply) => {
//     const saleId = req.params.id

//     try {
//         //obtener la venta
//         const saleExist = await saleModel.findById(saleId);
//         if (!saleExist) {
//             return response(reply, 404, false, "", "venta no encontrada")
//         };

//         //restaurar el stock original antes de eliminar
//         await restoreStockOnSale(saleExist.products);

//         //eliminar la venta y actualizar stock
//         const deletedSale = await saleModel.findByIdAndDelete(saleId);
//         if (!deletedSale) {
//             return response(reply, 404, false, "", "venta no encontrada")
//         };

//         response(reply, 200, true, "", "Venta eliminada")
//     } catch (error) {
//         response(reply, 500, false, "", error.message)
//     }
// };

//actualizar stock despues de una venta o actualizacion
// export const updateStockOnSale = async (products) => {
//     const productPromises = products.map(async (product) => {
//         const productExist = await productModel.findById(product.product);
//         if (productExist) {
//             //si la cantidad en la actualizacion es menor, devolvemos el stock
//             if (product.amount < product.originalAmount) {
//                 const returnedStock = product.originalAmount - product.amount;
//                 productExist.stock += returnedStock
//             } else {
//                 productExist.stock -= product.amount;
//             }

//             await productExist.save();
//         }
//     });

//     await Promise.all(productPromises);
// };

// //restaurar el stock antes de una actualizacion o eliminacion
// export const restoreStockOnSale = async (products) => {
//     const productPromises = products.map(async (product) => {
//         const productExist = await productModel.findById(product.product);
//         if (productExist) {
//             //si la cantidad en la actualizacion es menor, devolvemos el stock
//             productExist.stock += product.amount - (product.amount - product.originalAmount || 0);

//             await productExist.save();
//         }
//     });

//     await Promise.all(productPromises);
// };

export default saleCtrl;