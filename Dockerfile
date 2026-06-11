# Multi-stage build: compile the React SPA, then run it from the Node backend
# as a single service (one URL).

FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY backend/package.json ./backend/
RUN npm --prefix backend install --omit=dev
COPY backend/ ./backend/
# Place the built SPA where the backend expects it (../frontend/dist).
COPY --from=frontend /app/frontend/dist ./frontend/dist
ENV PORT=4000
EXPOSE 4000
CMD ["node", "backend/index.js"]
