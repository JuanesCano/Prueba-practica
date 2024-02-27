import mongoose from "mongoose";
const { Schema, model } = mongoose;

const saleSchema = new Schema(
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

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "client",
            required: true
        },

        total: {
            type: Number,
            required: true
        }
    },

    {
        timestamps: true
    }
);

export const saleModel = model("sale", saleSchema);