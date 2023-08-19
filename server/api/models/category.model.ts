import { Schema, model } from "mongoose";
import { ICategory } from "../types/types";


const CategorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    }
}
)

const Category = model<ICategory>('Category', CategorySchema)

export default Category
