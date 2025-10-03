import type { Controller } from "@presentation/contracts/controller.contract";
import type { Request, Response } from "express";

export const expressAdapter = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest = {
      body: request.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    response.status(httpResponse.status).json(httpResponse.body);
  };
};
