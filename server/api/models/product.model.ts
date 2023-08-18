import { Schema, model } from "mongoose";
import { IProduct } from "../types/types";

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
    categories: [{
        type: Array,
        of: Schema.Types.ObjectId,
        ref: 'category'
    }],
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    toJSON: {
        transform(_, ret) {
            delete ret.__v;
        },
    }
})

const Product = model<IProduct>('Product', ProductSchema)

export default Product