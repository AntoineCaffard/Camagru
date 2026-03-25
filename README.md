# Camagru

An Instagram-like web application built with a **microservices architecture**.

## Services

| Service | Port | Description |
|---|---|---|
| [api-gateway](./api-gateway) | 3000 | Reverse-proxy / entry-point for all clients |
| [user-service](./user-service) | 3001 | Registration, login, JWT authentication |
| [media-service](./media-service) | 3002 | Photo upload, webcam capture, image compositing |
| [gallery-service](./gallery-service) | 3003 | Browse & paginate the public image gallery |
| [social-service](./social-service) | 3004 | Likes & comments |
| [notification-service](./notification-service) | 3005 | Email notifications (new comment, etc.) |

## Quick start

```bash
# Copy environment files
for svc in api-gateway user-service media-service gallery-service social-service notification-service; do
  cp $svc/.env.example $svc/.env
done

# Start everything
docker-compose up --build
```

The gateway will be available at <http://localhost:3000>.

## Branch strategy

See [docs/BRANCHES.md](./docs/BRANCHES.md).

## Architecture overview

```
Client
  │
  ▼
api-gateway  :3000
  │   │   │   │   │
  ▼   ▼   ▼   ▼   ▼
user media gallery social notification
:3001 :3002  :3003  :3004   :3005
  │     │      │      │
  └─────┴──────┴──────┴── PostgreSQL (one DB per service)
```

Each service owns its own database schema – services never share a database directly.  
Inter-service calls are made over HTTP using the internal Docker network.