import { env } from "@main/config/env";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { Request, Response } from "express";

type HttpResponseBody = {
  tokens?: Record<string, unknown>;
  [key: string]: unknown;
};

export const expressAdapter = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest = {
      body: request.body,
      cookies: {
        refreshToken: request.cookies.refreshToken,
      },
      file: request.file,
      // @ts-ignore
      user: request.user,
    };

    const httpResponse: HttpResponse<HttpResponseBody> =
      await controller.handle(httpRequest);

    if (httpResponse.body.tokens) {
      const { refreshToken, accessToken } = httpResponse.body.tokens;
      const isProduction = env.NODE_ENV === "production";

      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: env.REFRESH_TOKEN_TTL,
      });

      httpResponse.body = {
        ...httpResponse.body,
        tokens: {
          accessToken,
        },
      };
    }
    response.status(httpResponse.status).json(httpResponse.body);
  };
};
