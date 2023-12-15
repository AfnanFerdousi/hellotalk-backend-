import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendRespnse";
import { IUser } from "../user/user.interface";
import authService from "./auth.service";
import { ILoginUserResponse } from "./auth.interface";

const signUpUser = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;
    const user = await authService.signUpUserService(userData);

    sendResponse<IUser>(res, {
        statusCode: 200,
        success: true,
        message: "User created successfully",
        data: user,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.loginUserService(email, password);

    sendResponse<ILoginUserResponse>(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: result,
    });
})

export default {
    signUpUser,
    loginUser
};
