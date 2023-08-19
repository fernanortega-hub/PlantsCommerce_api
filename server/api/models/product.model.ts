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
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (ret) {
            delete ret.__v;
        }
    }
})

const Product = model<IProduct>('Product', ProductSchema)

export default Product