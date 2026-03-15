# 🧪 API Testing with Postman

A comprehensive guide for testing the **Media Log Backend** API endpoints using [Postman](https://www.postman.com/).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Users](#users)
  - [Movies](#movies)
  - [Anime](#anime)
  - [Games](#games)
  - [TV Series](#tv-series)
  - [Manga](#manga)
  - [Fiction](#fiction)
  - [Non-Fiction](#non-fiction)
  - [Light Novels](#light-novels)
  - [Dashboard](#dashboard)
  - [Stats](#stats)
  - [Reports](#reports)
  - [Search](#search)
  - [User Activity](#user-activity)
- [Common Response Codes](#common-response-codes)
- [Tips & Troubleshooting](#tips--troubleshooting)

---

## Prerequisites

1. **Postman** installed — [Download here](https://www.postman.com/downloads/)
2. **Backend server running** locally:
   ```bash
   pnpm dev
   ```
3. **Firebase project** configured with valid credentials in `.env.development`
4. **Seeded data** (optional, for testing with existing records):
   ```bash
   pnpm seed        # Seed media data
   pnpm seed:users  # Seed user data
   ```

---

## Environment Setup

### 1. Create a Postman Environment

Create a new environment in Postman (e.g., `Media Log - Dev`) with these variables:

| Variable       | Initial Value                    | Description                    |
| -------------- | -------------------------------- | ------------------------------ |
| `base_url`     | `http://localhost:3000`          | Base URL of the backend server |
| `api_url`      | `http://localhost:3000/api`      | Base URL for API endpoints     |
| `bearer_token` | _(leave empty — set after auth)_ | Firebase ID token for auth     |

### 2. Configure Authorization

To avoid adding the token manually to every request, set up **collection-level authorization**:

1. Create a new **Collection** (e.g., `Media Log API`)
2. Go to the **Authorization** tab of the collection
3. Set **Type** to `Bearer Token`
4. Set **Token** to `{{bearer_token}}`
5. All requests in this collection will now inherit the token automatically

---

## Authentication

The API uses **Firebase Authentication** with Bearer tokens. Most endpoints require a valid `Authorization: Bearer <token>` header.

### Generating a Token

Use the `generate-token` script to get a valid Firebase ID token:

```bash
# Generate token for the default seed user (user_alpha)
npx tsx scripts/generate-token.ts

# Generate token for a specific user UID
npx tsx scripts/generate-token.ts <firebase-uid>
```

> **Requires:** `FIREBASE_WEB_API_KEY` set in `.env.development`

The script outputs a Bearer token. Copy it and set it as the `bearer_token` variable in your Postman environment.

### Setting the Token in Postman

1. Copy the token output from the script
2. In Postman, go to **Environments** → `Media Log - Dev`
3. Paste the token as the **Current Value** of `bearer_token`
4. Click **Save**

> ⏰ **Token Expiry:** Firebase ID tokens expire after **1 hour**. Re-run the script to generate a new one when your requests start returning `401 Unauthorized`.

### Test Mode Token

For automated testing, the backend accepts a hardcoded test token when `NODE_ENV=test`:

- **Token:** `test-token-123`
- **User UID:** `test-user-id`

---

## API Endpoints

> **Base URL:** `{{api_url}}` → `http://localhost:3000/api`
>
> All endpoints below are relative to this base URL. Endpoints marked with 🔒 require authentication.

### Health Check

| Method | Endpoint                | Auth | Description                               |
| ------ | ----------------------- | ---- | ----------------------------------------- |
| `GET`  | `/health`               | ❌   | API health check                          |
| `GET`  | `/check` _(root level)_ | ❌   | Quick status check (`{{base_url}}/check`) |

#### Example: Health Check

```
GET {{api_url}}/health
```

**Expected Response:**

```json
{
  "status": "OK"
}
```

---

### Users

| Method  | Endpoint                  | Auth | Description                  |
| ------- | ------------------------- | ---- | ---------------------------- |
| `POST`  | `/users/signup`           | ❌   | Register a new user          |
| `POST`  | `/users/recover/username` | ❌   | Recover username             |
| `POST`  | `/users/sync`             | 🔒   | Sync user data with Firebase |
| `GET`   | `/users/me`               | 🔒   | Get current user profile     |
| `PATCH` | `/users/me`               | 🔒   | Update current user profile  |
| `POST`  | `/users/me/avatar`        | 🔒   | Upload user avatar           |

#### Example: Sign Up

```
POST {{api_url}}/users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "newuser"
}
```

#### Example: Get Current User

```
GET {{api_url}}/users/me
Authorization: Bearer {{bearer_token}}
```

#### Example: Upload Avatar

```
POST {{api_url}}/users/me/avatar
Authorization: Bearer {{bearer_token}}
Content-Type: multipart/form-data

# In Postman Body tab → form-data:
# Key: "image" (type: File) → Select image file
```

---

### Movies

| Method   | Endpoint              | Auth | Description            |
| -------- | --------------------- | ---- | ---------------------- |
| `GET`    | `/movie`              | 🔒   | Get all movies         |
| `POST`   | `/movie`              | 🔒   | Create a new movie     |
| `GET`    | `/movie/:id`          | 🔒   | Get movie by ID        |
| `PATCH`  | `/movie/:id`          | 🔒   | Update a movie         |
| `DELETE` | `/movie/:id`          | 🔒   | Delete a movie         |
| `PATCH`  | `/movie/:id/complete` | 🔒   | Mark movie as complete |

#### Example: Get All Movies (with pagination)

```
GET {{api_url}}/movie?page=1&limit=10
Authorization: Bearer {{bearer_token}}
```

#### Example: Create a Movie

```
POST {{api_url}}/movie
Authorization: Bearer {{bearer_token}}
Content-Type: multipart/form-data

# In Postman Body tab → form-data:
# Key: "title" (type: Text) → "Inception"
# Key: "image" (type: File) → Select cover image (optional)
```

#### Example: Mark Movie as Complete

```
PATCH {{api_url}}/movie/<movie-id>/complete
Authorization: Bearer {{bearer_token}}
```

---

### Anime

| Method   | Endpoint              | Auth | Description            |
| -------- | --------------------- | ---- | ---------------------- |
| `GET`    | `/anime`              | 🔒   | Get all anime          |
| `POST`   | `/anime`              | 🔒   | Create a new anime     |
| `GET`    | `/anime/:id`          | 🔒   | Get anime by ID        |
| `PATCH`  | `/anime/:id`          | 🔒   | Update an anime        |
| `DELETE` | `/anime/:id`          | 🔒   | Delete an anime        |
| `PATCH`  | `/anime/:id/complete` | 🔒   | Mark anime as complete |

> Follows the same request/response pattern as [Movies](#movies).

---

### Games

| Method   | Endpoint              | Auth | Description           |
| -------- | --------------------- | ---- | --------------------- |
| `GET`    | `/games`              | 🔒   | Get all games         |
| `POST`   | `/games`              | 🔒   | Create a new game     |
| `GET`    | `/games/:id`          | 🔒   | Get game by ID        |
| `PATCH`  | `/games/:id`          | 🔒   | Update a game         |
| `DELETE` | `/games/:id`          | 🔒   | Delete a game         |
| `PATCH`  | `/games/:id/complete` | 🔒   | Mark game as complete |

> Follows the same request/response pattern as [Movies](#movies).

---

### TV Series

| Method   | Endpoint                  | Auth | Description                |
| -------- | ------------------------- | ---- | -------------------------- |
| `GET`    | `/tv-series`              | 🔒   | Get all TV series          |
| `POST`   | `/tv-series`              | 🔒   | Create a new TV series     |
| `GET`    | `/tv-series/:id`          | 🔒   | Get TV series by ID        |
| `PATCH`  | `/tv-series/:id`          | 🔒   | Update a TV series         |
| `DELETE` | `/tv-series/:id`          | 🔒   | Delete a TV series         |
| `PATCH`  | `/tv-series/:id/complete` | 🔒   | Mark TV series as complete |

> Follows the same request/response pattern as [Movies](#movies).

---

### Manga

| Method   | Endpoint              | Auth | Description            |
| -------- | --------------------- | ---- | ---------------------- |
| `GET`    | `/manga`              | 🔒   | Get all manga          |
| `POST`   | `/manga`              | 🔒   | Create a new manga     |
| `GET`    | `/manga/:id`          | 🔒   | Get manga by ID        |
| `PATCH`  | `/manga/:id`          | 🔒   | Update a manga         |
| `DELETE` | `/manga/:id`          | 🔒   | Delete a manga         |
| `PATCH`  | `/manga/:id/complete` | 🔒   | Mark manga as complete |

> Follows the same request/response pattern as [Movies](#movies).

---

### Fiction

| Method   | Endpoint                | Auth | Description               |
| -------- | ----------------------- | ---- | ------------------------- |
| `GET`    | `/fiction`              | 🔒   | Get all fiction books     |
| `POST`   | `/fiction`              | 🔒   | Create a new fiction book |
| `GET`    | `/fiction/:id`          | 🔒   | Get fiction book by ID    |
| `PATCH`  | `/fiction/:id`          | 🔒   | Update a fiction book     |
| `DELETE` | `/fiction/:id`          | 🔒   | Delete a fiction book     |
| `PATCH`  | `/fiction/:id/complete` | 🔒   | Mark fiction as complete  |

> Follows the same request/response pattern as [Movies](#movies).

---

### Non-Fiction

| Method   | Endpoint                    | Auth | Description                   |
| -------- | --------------------------- | ---- | ----------------------------- |
| `GET`    | `/non-fiction`              | 🔒   | Get all non-fiction books     |
| `POST`   | `/non-fiction`              | 🔒   | Create a new non-fiction book |
| `GET`    | `/non-fiction/:id`          | 🔒   | Get non-fiction book by ID    |
| `PATCH`  | `/non-fiction/:id`          | 🔒   | Update a non-fiction book     |
| `DELETE` | `/non-fiction/:id`          | 🔒   | Delete a non-fiction book     |
| `PATCH`  | `/non-fiction/:id/complete` | 🔒   | Mark non-fiction as complete  |

> Follows the same request/response pattern as [Movies](#movies).

---

### Light Novels

| Method   | Endpoint                    | Auth | Description                  |
| -------- | --------------------------- | ---- | ---------------------------- |
| `GET`    | `/light-novel`              | 🔒   | Get all light novels         |
| `POST`   | `/light-novel`              | 🔒   | Create a new light novel     |
| `GET`    | `/light-novel/:id`          | 🔒   | Get light novel by ID        |
| `PATCH`  | `/light-novel/:id`          | 🔒   | Update a light novel         |
| `DELETE` | `/light-novel/:id`          | 🔒   | Delete a light novel         |
| `PATCH`  | `/light-novel/:id/complete` | 🔒   | Mark light novel as complete |

> Follows the same request/response pattern as [Movies](#movies).

---

### Dashboard

| Method | Endpoint                     | Auth | Description               |
| ------ | ---------------------------- | ---- | ------------------------- |
| `GET`  | `/dashboard/library-summary` | 🔒   | Get library summary stats |

#### Example: Get Library Summary

```
GET {{api_url}}/dashboard/library-summary
Authorization: Bearer {{bearer_token}}
```

**Expected Response:**

```json
{
  "status": "success",
  "data": {
    "totalItems": 42,
    "byStatus": {
      "completed": 20,
      "in_progress": 15,
      "planned": 7
    }
  }
}
```

---

### Stats

| Method | Endpoint         | Auth | Description            |
| ------ | ---------------- | ---- | ---------------------- |
| `GET`  | `/stats/summary` | 🔒   | Get statistics summary |

#### Example: Get Stats Summary

```
GET {{api_url}}/stats/summary
Authorization: Bearer {{bearer_token}}
```

---

### Reports

| Method | Endpoint           | Auth | Description               |
| ------ | ------------------ | ---- | ------------------------- |
| `GET`  | `/reports`         | 🔒   | Get paginated report data |
| `GET`  | `/reports/summary` | 🔒   | Get quick report summary  |
| `GET`  | `/reports/export`  | 🔒   | Export report data        |

#### Example: Get Paginated Reports

```
GET {{api_url}}/reports?page=1&limit=10
Authorization: Bearer {{bearer_token}}
```

---

### Search

| Method | Endpoint  | Auth | Description                    |
| ------ | --------- | ---- | ------------------------------ |
| `GET`  | `/search` | 🔒   | Global search across all media |

#### Example: Global Search

```
GET {{api_url}}/search?q=inception
Authorization: Bearer {{bearer_token}}
```

---

### User Activity

| Method | Endpoint         | Auth | Description              |
| ------ | ---------------- | ---- | ------------------------ |
| `GET`  | `/user-activity` | 🔒   | Get recent user activity |

#### Example: Get Recent Activity

```
GET {{api_url}}/user-activity
Authorization: Bearer {{bearer_token}}
```

---

## Swagger / OpenAPI Docs

The API also has **interactive Swagger documentation** available at:

```
http://localhost:3000/api-docs
```

You can use the Swagger UI to explore endpoints, view schemas, and test requests directly in the browser.

---

## Common Response Codes

| Code  | Meaning               | Description                                       |
| ----- | --------------------- | ------------------------------------------------- |
| `200` | OK                    | Request succeeded                                 |
| `201` | Created               | Resource created successfully                     |
| `400` | Bad Request           | Invalid request body or parameters                |
| `401` | Unauthorized          | Missing or invalid Bearer token                   |
| `404` | Not Found             | Resource not found                                |
| `429` | Too Many Requests     | Rate limit exceeded (100 requests per 15 minutes) |
| `500` | Internal Server Error | Server-side error                                 |

---

## Tips & Troubleshooting

### Token Issues

- **`401 Unauthorized`**: Your token may have expired. Firebase ID tokens are valid for **1 hour**. Regenerate with:
  ```bash
  npx tsx scripts/generate-token.ts
  ```
- **Using Postman variables**: Set the token once in the environment variable `bearer_token`, and all requests in the collection will use it automatically.

### File Uploads

For endpoints that accept file uploads (creating/updating media, uploading avatars):

1. In Postman, select **Body** → **form-data**
2. For the image field:
   - Set the **Key** to `image`
   - Change the type dropdown from **Text** to **File**
   - Select the image file from your computer
3. Add other fields (e.g., `title`) as **Text** type

### Rate Limiting

The API limits each IP to **100 requests per 15-minute window** in production. In development, this limit is higher. If you hit the limit, wait 15 minutes or restart the server.

### Pagination

Most `GET` list endpoints support pagination via query parameters:

| Parameter | Type    | Default | Description    |
| --------- | ------- | ------- | -------------- |
| `page`    | integer | 1       | Page number    |
| `limit`   | integer | 10      | Items per page |

```
GET {{api_url}}/movie?page=2&limit=20
```

### Quick Sanity Check

To verify the API is running and reachable:

```
GET {{base_url}}/check
```

Expected:

```json
{
  "status": "OK"
}
```
