import { response } from "../helpers/response.js"
import { categoryModel } from "../models/categoryModel.js";
import { productModel } from "../models/productModel.js";

const categoryCtrl = {}

//crear categoria
categoryCtrl.createCategory = async (req, reply) => {
    const { name, description } = req.body;
    try {
        const newCategory = await categoryModel.create({ name, description });

        response(reply, 201, true, newCategory, "Categoria creada")
    } catch (error) {
        if (error.code === 11000) {
            response(reply, 400, false, "", "Ya existe una categoria con el mismo nombre")
        }
        response(reply, 500, false, "", error.message)
    }
};

//obtener todas las categorias
categoryCtrl.getAllCategories = async (req, reply) => {
    try {
        const categories = await categoryModel.find().sort({ createdAt: "desc" })

        response(reply, 200, true, categories, "Lista de categorias")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//obtener categorias por id
categoryCtrl.getCategoryById = async (req, reply) => {
    const categoryId = req.params.id;

    try {
        const category = await categoryModel.findById(categoryId);

        if (!category) {
            return response(reply, 404, false, "", "Categoria no encontrada")
        };

        response(reply, 200, true, category, "Categoria encontrada")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//actualizar categorias por id
categoryCtrl.updateCategoryById = async (req, reply) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true });

        if (!updatedCategory) {
            return response(reply, 404, false, "", "Categoria no encontrada")
        };

        response(reply, 200, true, updatedCategory, "Categoria actualizada");
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

//eliminar categorias por id
categoryCtrl.deleteCategoryById = async (req, reply) => {
    const categoryId = req.params.id;

    try {
        const deletedCategory = await categoryModel.findById({_id: categoryId});

        if (!deletedCategory) {
            return response(reply, 404, false, "", "Categoria no encontrada")
        };

        //verificamos si la categoria tiene productos
        const productInCategory = await productModel.find({
            category: categoryId
        });

        if(productInCategory.length > 0){
            return response(reply, 400, false, "", "No se puede eliminar la categoria si tiene productos asociados")
        }

        await deletedCategory.deleteOne();

        response(reply, 200, true, "", "Categoria eliminada")
    } catch (error) {
        response(reply, 500, false, "", error.message)
    }
};

export default categoryCtrl;