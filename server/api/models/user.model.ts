import { Schema, model } from "mongoose";
import { IUser, IUserMethods, UserModel } from "../types/types";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { rename } from "fs";

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_, ret) {
            delete ret.password;
            delete ret.__v;
            delete ret.createdAt;
        }
    }
});

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT!!))
    const hashedPassword = await bcrypt.hash(this.password, salt)
    
    this.password = hashedPassword
    next()
})

UserSchema.methods.validPassword = async function validPassword(password: string) {
    const valid = await bcrypt.compare(password, this.password)
    return valid;
}

UserSchema.methods.generateJwt = function generateJwt() {
    return jwt.sign({ _id: this._id }, process.env.JWT_TOKEN_SECRET!!);
};

UserSchema.methods.generateRecoveryJwt = function generateRecoveryJwt() {
    return jwt.sign({ _id: this._id }, process.env.JWT_RECOVERY_SECRET!!, { expiresIn: '15m' });
};

UserSchema.methods.validRecoveryJwt = function validRecoveryJwt(token: string) {
    return jwt.verify(token, process.env.JWT_RECOVERY_SECRET!!);
};

UserSchema.methods.validateJwt = function validateJwt(token: string) {
    return jwt.verify(token, process.env.JWT_TOKEN_SECRET!!);
}

const User = model<IUser, UserModel>("User", UserSchema)

export default User
