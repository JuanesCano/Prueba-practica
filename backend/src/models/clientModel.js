import mongoose from "mongoose";
const { Schema, model } = mongoose;

const clientSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },

        cc: {
            type: String,
            required: false, 
            unique: true
        },
    },

    {
        timestamps: true
    }
);

export const clientModel = model("client", clientSchema);