interface HttpRequest {
  body: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

interface HttpResponse {
  body: {
    name: string;
    email: string;
  };
  status: number;
}

export class CreateUserController {
  handle(request: HttpRequest): Promise<HttpResponse> {
    return new Promise((res) => {
      res({
        body: {
          name: request.body.name,
          email: request.body.email,
        },
        status: 201,
      });
    });
  }
}
