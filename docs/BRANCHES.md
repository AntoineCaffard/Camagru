# Branch Strategy

## Permanent branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready, tagged releases only |
| `develop` | Integration branch – all feature branches merge here first |

## Feature branches

One branch per microservice (and per cross-cutting concern):

| Branch | Service / area |
|---|---|
| `feature/api-gateway` | API Gateway |
| `feature/user-service` | User management & authentication |
| `feature/media-service` | Photo upload, capture & compositing |
| `feature/gallery-service` | Public gallery browsing |
| `feature/social-service` | Likes & comments |
| `feature/notification-service` | Email notifications |
| `feature/docker-compose` | Orchestration & infrastructure |
| `feature/docs` | Documentation |

## Workflow

```
feature/xxx  →  develop  →  main
```

1. Create a feature branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/<name>
   ```
2. Open a Pull Request targeting `develop`.
3. After CI passes and review is approved, squash-merge into `develop`.
4. When `develop` is stable and all integration tests pass, open a release PR from `develop` → `main`.
5. Tag the merge commit on `main` with a semantic version (`vMAJOR.MINOR.PATCH`).

## Hotfix workflow

```
main  →  hotfix/xxx  →  main  (+ cherry-pick → develop)
```

1. Branch off `main`: `git checkout -b hotfix/<description> main`
2. Fix, test, open PR → `main`.
3. After merge, cherry-pick the commit onto `develop`.
