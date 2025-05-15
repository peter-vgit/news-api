# News API Service

## Description
This is a **Node.js API** that interacts with the **GNews API** to fetch and search news articles. The service includes **Redis caching** to optimize repeated requests.

## Features
- Fetch **N** latest news articles
- Find articles by **title** or **author**
- Search articles by **keywords**
- **Redis caching** for improved performance

## Installation

### 1. Clone the repository
```sh
git clone https://github.com/peter-vgit/news-api.git
cd news-api
```
### 2. Install dependencies
```sh
npm install
```

### 3. Configure environment variables
Create a .env file and add:

```GNEWS_API_KEY=your_api_key_here```

### 4. Start Redis

Ensure Redis is running:
```sh
redis-server
```
## API Endpoints

### Fetch N 

GET /articles?limit=N

Example:
```curl http://localhost:3000/articles?limit=5```

### Search articles by keyword

GET /articles/search?query=keyword

Example:
```curl http://localhost:3000/articles/search?query=keyword```

### How Caching Works
- Redis stores frequently requested articles
- Cached data expires after 10 minutes to refresh content
