const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "engineeum-v1",
      description: "Engineeum for AEC undergraduate.",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["/swaggerDocs/*.js"],
};

module.exports = swaggerOptions;
