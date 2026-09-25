# E-commerce Microservices Prototype

This project is a deployable prototype of an e-commerce platform built with **JavaScript, Node.js and Express**. It contains seven services, centralized service configuration, unit tests, integration tests, Docker Compose deployment, a Jenkins pipeline, a smoke test, and a small change analyzer that can be used for CI experiments.

## Services

| Service | Port | Main responsibility |
|---|---:|---|
| Product | 3001 | Product catalog |
| Inventory | 3002 | Stock lookup and reservation |
| Cart | 3003 | Shopping carts |
| Order | 3004 | Coordinates checkout |
| Payment | 3005 | Simulated payment authorization |
| Shipping | 3006 | Shipment creation and tracking |
| User | 3007 | Customer registration and lookup |

## Important prototype note

The application uses in-memory state so it can run without a database or cloud account. This makes it easy to demonstrate the complete microservice workflow. For production use, replace each service's in-memory state with a persistent database and add authentication, secrets management, durable messaging, observability, rate limiting, and stronger transaction handling.

## Folder structure

```text
Main-Project-2/
├── analyzer/
├── sample_microservices/
│   ├── config/
│   │   ├── product.config.js
│   │   ├── inventory.config.js
│   │   ├── cart.config.js
│   │   ├── order.config.js
│   │   ├── payment.config.js
│   │   ├── shipping.config.js
│   │   └── user.config.js
│   ├── product_service.js
│   ├── inventory_service.js
│   ├── cart_service.js
│   ├── order_service.js
│   ├── payment_service.js
│   ├── shipping_service.js
│   └── user_service.js
├── scripts/
├── tests/
├── images/
├── .gitignore
├── analyzer_result.json
├── docker-compose.yml
├── Dockerfile
├── Jenkinsfile
├── package.json
├── requirements.txt
├── README.md
├── run_selected_tests.js
└── Setup.py
```

## Local setup

1. Install Node.js 20 or newer.
2. Open a terminal in the project root.
3. Run `npm install`.
4. Run `npm test`.
5. Start individual services with the npm scripts, or use Docker Compose for all seven services.

## Run all services with Docker

```bash
docker compose up --build
```

After startup, health endpoints are available at `http://localhost:3001/health` through `http://localhost:3007/health`.

Run the smoke test from another terminal:

```bash
npm run smoke
```

## Example API flow

Register a user:

```bash
curl -X POST http://localhost:3007/users -H "content-type: application/json" -d '{"id":"u1","name":"Ada","email":"ada@example.com"}'
```

Read products:

```bash
curl http://localhost:3001/products
```

Add an item to a cart:

```bash
curl -X POST http://localhost:3003/carts/u1/items -H "content-type: application/json" -d '{"productId":"p100","quantity":1}'
```

Create an order:

```bash
curl -X POST http://localhost:3004/orders -H "content-type: application/json" -d '{"userId":"u1","productId":"p100","quantity":1,"amount":59.99,"address":"1 Test Street"}'
```

The order service calls inventory, payment and shipping internally.

## Testing

`npm test` runs unit-style tests and HTTP integration-style tests for every service. The order tests mock the downstream HTTP calls so the coordination logic can be tested deterministically. `test_service_health.integration.test.js` checks every service app through its real Express routing stack.

## CI/CD

The `Jenkinsfile` installs dependencies, runs all tests, and validates the Docker Compose configuration. The same stages can be connected to a Jenkins agent that has Node.js and Docker installed.

## Configuration

All service configuration is kept in `sample_microservices/config/`, matching the requested project layout. Environment variables can override ports and downstream service URLs.

## Architecture image

See `images/architecture.svg` for a simple architecture diagram.

## License

This prototype is provided for educational and thesis/project demonstration purposes.
