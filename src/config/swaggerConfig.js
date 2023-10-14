import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nische Store Api',
      version: '1.0.0',
      description: 'Documentación de la API de Nische Store',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        url: 'http://localhost:3000',
        url: 'http://localhost:8081',
      },
    ],
  },
  apis: [
    './src/docs/productsdocs/productsdocs.yaml',
    './src/docs/cartsdocs/cartsdocs.yaml',
    './src/docs/usersdoc/usersdoc.yaml',
    './src/docs/sessionsdocs/sessionsdocs.yaml',
    './src/docs/chatsdocs/chatsdocs.yaml',
    './src/docs/tokensdoc/tokensdoc.yaml',
    './src/docs/messagedocs/messagedocs.yaml',
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
