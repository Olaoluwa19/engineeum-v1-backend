const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Engineeum API project",
      description: "Engineeum for AEC undergraduate.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [path.join(__dirname, "..", "swaggerDocs", "*.yaml")],
};

module.exports = swaggerOptions;
