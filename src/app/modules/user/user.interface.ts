import mongoose from "mongoose";

export type IUser = {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    age: number;
    education: string;
    phoneNumber: string;
    email: string;
    gems: number;
    profileImg: string;
    country: string;
    password: string;
    role: "learner" | "instructor" | "admin" | "superadmin";
}

export type UserModel = {
    isUserExist(
        email: string
    ): Promise<Partial<Pick<IUser, "name" | "role" | "_id">> | null> ;
    isPasswordMatched(
        givenPassword: string,
        savedPassword: string
    ): Promise<boolean>;
} & mongoose.Model<IUser>;