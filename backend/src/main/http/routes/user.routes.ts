import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";
import { makeLoginController } from "@main/composition/users/login.controller.factory";

export const userRoutes = Router();

userRoutes.post("/users", expressAdapter(makeCreateUserController()));
userRoutes.post("/users/login", expressAdapter(makeLoginController()));
