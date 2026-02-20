import { env } from "@main/config/env";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import type { Request, Response } from "express";

type HttpResponseBody = {
  tokens?: Record<string, unknown>;
  [key: string]: unknown;
};

const extractIdempotencyKey = (
  headers: Record<string, string | string[] | undefined>,
) => {
  const idempotencyKeyHeader = headers["idempotency-key"];
  if (Array.isArray(idempotencyKeyHeader)) {
    return idempotencyKeyHeader[0];
  }
  return idempotencyKeyHeader;
};

export const expressAdapter = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      cookies: {
        refreshToken: request.cookies.refreshToken,
      },
      file: request.file,
      params: request.params,
      query: request.query,
      user: request.user,
    };

    if (request.headers["idempotency-key"]) {
      const idempotency_key = extractIdempotencyKey(request.headers);
      httpRequest.headers = {
        idempotency_key,
      };
    }

    const httpResponse: HttpResponse<HttpResponseBody> =
      await controller.handle(httpRequest);

    if (httpResponse.body.tokens) {
      const { refreshToken, accessToken } = httpResponse.body.tokens;
      if (typeof refreshToken !== "string" || typeof accessToken !== "string") {
        throw new Error(
          "Controller returned invalid token payload shape. Expected 'refreshToken' and 'accessToken' to be strings.",
        );
      }
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
