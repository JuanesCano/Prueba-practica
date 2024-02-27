import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "el campo name es obligatorio"]
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: [true, "el campo category es obligatorio"]
        },

        stock: {
            type: Number,
            default: 0
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },
    },

    {
        timestamps: true
    }
);

//hook para eliminar inventario y las ventas asociadasal producto antes de eliminar el product
productSchema.pre("remove", async function(next) {
    const productId = this._id;

    try {
        await mongoose.model("inventory").deleteMany({product: productId});

        const saleToDelete = await mongoose.model("sale").find({"products.product": productId});

        for(const sale of saleToDelete){
            await sale.deleteOne();
        }

        next();
    } catch (error) {
        console.error("Error al eliminar los registros asociados al producto:", error);

        next(error);
    }
});

export const productModel = model("product", productSchema);