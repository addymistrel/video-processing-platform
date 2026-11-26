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

## Running the infrastructure

    pnpm infra:up       # start rabbitmq, redis, storage and nginx
    pnpm infra:ps       # show container health
    pnpm infra:logs     # follow logs
    pnpm infra:down     # stop containers, keep data
    pnpm infra:reset    # stop and delete all data volumes

Copy `.env.example` to `.env` and fill in the passwords first.
