# IP to Country API Gateway

This project is an API gateway server that provides country information associated with an IP address. It utilizes multiple vendors for IP geolocation and implements caching and rate limiting mechanisms.

## Features

- RESTful API endpoint for IP to country lookup
- Multiple vendor support (currently ipstack and ipapi)
- In-memory caching for faster responses and reduced API calls
- Configurable rate limiting per vendor
- Error handling and fallback mechanisms
- Docker support for easy deployment

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/sarmeet/ip-to-country.git
   cd ip-to-country
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the environment (see Environment Setup section below)

## Environment Setup

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:

   ```
   PORT=3000
   IPSTACK_API_KEY=your_ipstack_api_key_here
   IPSTACK_RATE_LIMIT=100
   IPAPI_RATE_LIMIT=1000
   CACHE_MAX_SIZE=1000
   CACHE_TTL=3600
   ```

3. Replace `your_ipstack_api_key_here` with your actual IPstack API key.
4. Adjust other values as needed for your specific requirements.

Note: Make sure to add `.env` to your `.gitignore` file to prevent sensitive information from being committed to your repository.

## Running the Server

### Development Mode

```
npm run dev
```

### Production Mode

```
npm run build
npm start
```

### Using Docker

1. Build the Docker image:
   ```
   docker build -t ip-to-country .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 --env-file .env ip-to-country
   ```

## API Documentation

### Get Country by IP

Retrieves the country associated with a given IP address or the requestor's IP if not provided.

- **URL**: `/api/country`
- **Method**: `GET`
- **URL Params**: 
  - Optional: `ip=[string]`

#### Success Response

- **Code**: 200 OK
- **Content**: 
  ```json
  {
    "ip": "8.8.8.8",
    "country": "United States"
  }
  ```

#### Error Responses

- **Code**: 400 Bad Request
  - **Content**: `{ "error": "Unable to determine IP address" }`

- **Code**: 429 Too Many Requests
  - **Content**: `{ "error": "Rate limit exceeded for all vendors" }`

- **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "An unexpected error occurred" }`

#### Sample Calls

With provided IP:
```bash
curl "http://localhost:3000/api/country?ip=8.8.8.8"
```

## Testing

### Running Tests

```
npm test
```

### E2E Testing Steps

1. Ensure the server is running (either locally or in a Docker container).
2. Use a tool like cURL or Postman to send requests to the API endpoint.
3. Test with various IP addresses and verify the responses.
4. Test rate limiting by sending multiple requests in quick succession.
5. Verify error handling by providing invalid IP addresses or causing vendor errors.

