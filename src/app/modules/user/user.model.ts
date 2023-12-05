/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from "mongoose";
import { IUser, UserModel } from "./user.interface";
import config from "../../../config";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<IUser, UserModel>(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        education: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        gems: {
            type: Number,
            default: 0,
        },
        profileImg: {
            type: String,
            required: true,
        },
        country: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["learner", "instructor", "admin", "superadmin"],
            required: true,
            default: "learner",
        },
    },
    { timestamps: true, versionKey: false, virtuals: true }
);

userSchema.statics.isUserExist = async function (
    email: string
): Promise<Partial<Pick<IUser, "name" | "role" | "_id">> | null> {
    return await User.findOne(
        { email: email },
        { _id: 1, password: 1, role: 1, name: 1 }
    );
};


userSchema.statics.isPasswordMatched = async function (
    givenPassword: string,
    savedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre("save", async function (next) {
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );
    next();
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
