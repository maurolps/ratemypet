import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";

export const userRoutes = Router();

userRoutes.post("/users", expressAdapter(makeCreateUserController()));
