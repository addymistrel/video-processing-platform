# Video Streaming & Media Processing Platform

Scalable video upload, transcoding and HLS streaming platform built as microservices.

## Stack

React, Node.js, TypeScript, RabbitMQ, Neon Postgres, Redis, MinIO, FFmpeg, Docker Compose.

## Setup

    pnpm install
    pnpm dev

## Structure

- `services/` backend microservices
- `packages/` shared libraries
- `apps/frontend/` React app
- `infra/` Docker, Nginx and Kubernetes files
- `docs/` diagrams and guidelines
