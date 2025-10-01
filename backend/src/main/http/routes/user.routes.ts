import { Router } from "express";

export const userRoutes = Router();

userRoutes.get("/users", (_req, res) => res.status(200).json({ body: "ok" }));
