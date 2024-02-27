import mongoose from "mongoose";
const { Schema, model } = mongoose;

const inventorySchema = new Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },
    },

    {
        timestamps: true
    }
);

export const inventoryModel = model("inventory", inventorySchema);