const base = {
  openapi: "3.1.0",
  info: {
    title: "Ratemypet API Docs",
    version: "0.2.0",
    contact: {
      name: "Ratemypet",
      email: "contact@maurolps.dev",
      url: "https://github.com/maurolps/ratemypet/",
    },
  },
  servers: [
    {
      description: "Local development",
      url: "http://localhost:8000",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "User Management",
    },
  ],
} as const;

export default base;
