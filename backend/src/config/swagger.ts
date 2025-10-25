import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expensify API Documentation',
      version: '1.0.0',
      description: 'API documentation for Expensify application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Chemin vers vos fichiers de routes TypeScript
};

const specs = swaggerJsdoc(options);
export default specs;