import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import { createToken } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { ILoginUserResponse } from "./auth.interface";

const signUpUserService = async (
    userData: IUser
) => {
    const isUser = await User.isUserExist(userData.email);
    if(isUser) {
        throw new Error("User already exists");
    }

    const user = await User.create(userData);
    return user;

}

const loginUserService = async (
    email: string,
    password: string,
):Promise<ILoginUserResponse> => {
    const isExist = await User.isUserExist(email);
    if(!isExist) {
        throw new ApiError(
             httpStatus.NOT_FOUND, "User does not exist");
    }
    if (!isExist.password && !(await User.isPasswordMatched(password, isExist.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const { _id, name, role } = isExist;
    const accessToken = createToken(
        { _id, name, role },
        config.jwt_secret as Secret,
        config.jwt_expires_in as string
    );
    const refreshToken = createToken(
        { _id, name, role },
        config.jwt_refresh_secret as Secret,
        config.jwt_refresh_expires_in as string
    )

    return {
        accessToken,
        refreshToken
    }

}


export default {
    signUpUserService,
    loginUserService
}