# Banking Insurances Service

Microservice for banking system insurance products management.

## 🚀 Features
- RESTful API using NestJS
- MongoDB integration with Mongoose
- Complete CRUD operations for insurance management
- Policy creation and management
- Claims processing
- Premium calculations
- PDF generation for insurance policies
- Swagger/OpenAPI documentation
- Unit testing with Jest

## Technologies Used
| Technology         |
|--------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)               |
| ![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs&logoColor=white)        |
| ![Mongoose](https://img.shields.io/badge/Mongoose-7.x-880000?logo=mongoose&logoColor=white)    |
| ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)              |
| ![Docker](https://img.shields.io/badge/Docker-20.x-2496ED?logo=docker&logoColor=white)              |
| ![PDFKit](https://img.shields.io/badge/PDFKit-Latest-FF0000?logoColor=white)              |

## Configuration

### 1. Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=8084
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://root:example@mongodb:27017/banking?authSource=admin

# Banking Users Service Configuration
USERS_SERVICE_URL=http://localhost:8082/api/v1

# Logging Configuration
LOG_LEVEL=debug
 ```
### 2. Application Configuration
File location: src/config/configuration.ts

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 8084,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/banking',
  },
  usersService: {
    url: process.env.USERS_SERVICE_URL || 'http://localhost:8082/api/v1',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
});
 ```
## Installation & Deployment
### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB
### Installation
1. Clone the repository:
   
   ```bash
   git clone https://github.com/yourusername/banking-insurances-service.git
    ```
2. Navigate to the project directory:
   
   ```bash
   cd d:\workspaces\banking-whatsapp-chanel\banking-insurances-service

3. Install dependencies:
   
   ```bash
   npm install
    ```
4. Run the application:
   
   ```bash
   npm run start:dev
    ```
5. The service will be accessible at http://localhost:8084/banking-insurances-service/api/v1


### API Endpoints
Refer to the banking-insurances-service.postman_collection.json file for detailed API endpoint information.

### Main Endpoints Insurance Products
1. Create Insurance Product
   
   - URL: /api/v1/insurance-products
   - Method: POST
   - Swagger: Create Insurance Product
2. Get Insurance Product by ID
   
   - URL: /api/v1/insurance-products/{id}
   - Method: GET
   - Swagger: Get Insurance Product Policies
1. Create Policy
   
   - URL: /api/v1/policies
   - Method: POST
   - Swagger: Create Policy
2. Get Policy by ID
   
   - URL: /api/v1/policies/{id}
   - Method: GET
   - Swagger: Get Policy
3. Get Policies by User ID
   
   - URL: /api/v1/policies/user/{userId}
   - Method: GET
   - Swagger: Get Policies by User
4. Download Policy PDF
   
   - URL: /api/v1/policies/{id}/pdf
   - Method: GET
   - Swagger: Download Policy PDF Claims
1. Create Claim
   
   - URL: /api/v1/claims
   - Method: POST
   - Swagger: Create Claim
2. Update Claim Status
   
   - URL: /api/v1/claims/{id}/status
   - Method: PATCH
   - Swagger: Update Claim Status

## Troubleshooting
1. MongoDB Connection Issues:
   
   - Verify credentials in .env
   - Check if MongoDB container is running
   - Review MongoDB logs: docker-compose logs mongodb
2. Service Start Issues:
   
   - Verify port 8084 is available
   - Check service logs: docker-compose logs app
   - Verify environment variables in .env

### Docker Deployment
1. Start Services
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mongodb
 ```

2. Stop Services
```bash
# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
 ```

3. Verify Deployment
```bash
# Check running containers
docker-compose ps

# Test service health
curl http://localhost:8084/banking-insurances-service/api/v1/health
 ```

## 📚 API Documentation
Access Swagger UI: http://localhost:8084/api#/

## 🧪 Running Tests
Run all tests:

```bash
npm test
 ```

Run specific test file:

```bash
npm test -- policies.service.spec.ts
 ```

## Docker Hub
Service image is available on Docker Hub:

```bash
docker pull marceloalbarracin/banking-insurances-service:1.0.0
 ```


## Author
Marcelo Alejandro Albarracín
marceloalejandro.albarracin@gmail.com

## ¿Te gusta el contenido que comparto? Invítame un café para ayudarme a seguir creando. ¡Gracias por tu apoyo!
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-F7DF1E?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/malbarracin) 