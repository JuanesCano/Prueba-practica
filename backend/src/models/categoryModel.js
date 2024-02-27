import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
    {
        name : {
            type: String,
            required: [true, "el campo name es obligatorio"],
            unique: true
        },
    },
    {
        timestamps: true
    }
);

//hook para convertir el name a minusculas antes de guardar
categorySchema.pre("save", function (next) {
    this.name = this.name.toLowerCase();
    next();
});

export const categoryModel = model("category", categorySchema);