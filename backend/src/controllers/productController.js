import { response } from "../helpers/response.js";
import { categoryModel } from "../models/categoryModel.js"
import { productModel } from "../models/productModel.js";

const productCtrl = {}

//crear producto
productCtrl.createProduct = async (req, reply) => {
    const { name, category, description, price } = req.body;

    try {
        //verificar si la categoria existe
        const categoryExist = await categoryModel.findById(category);
        if (!categoryExist) {
            return response(reply, 404, false, "", "categoria no encontrada")
        };

        const newProduct = await productModel.create({
            name, category,
            description, price
        })

        response(reply, 201, true, newProduct, "Producto creado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener todos los productos
productCtrl.getAllProducts = async (req, reply) => {
    try {
        const products = await productModel.find().populate("category").sort({ createdAt: "desc" })

        response(reply, 200, true, products, "Porducts")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener producto por id
productCtrl.getProductById = async (req, reply) => {
    const productId = req.params.id

    try {
        const product = await productModel.findById(productId).populate("category")

        if (!product) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        response(reply, 200, true, product, "Producto encontrado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//actualizar producto por id
productCtrl.updateProductById = async (req, reply) => {
    const productId = req.params.id
    const { name, category, description, price } = req.body;

    try {
        //verificar si la categoria existe
        const categoryExist = await categoryModel.findById(category);
        if (!categoryExist) {
            return response(reply, 404, false, "", "categoria no encontrada")
        };

        const updateProduct = await productModel.findByIdAndUpdate(
            productId,
            {name, category, description, price },
            {new: true}
        );

        if (!updateProduct) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        response(reply, 200, true, updateProduct, "Producto actualizado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//eliminar producto por id
productCtrl.deleteProductById = async (req, reply) => {
    const productId = req.params.id
    
    try {
        const deletedProduct = await productModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return response(reply, 404, false, "", "producto no encontrado")
        };

        response(reply, 200, true, "", "Producto eliminado")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

export default productCtrl;