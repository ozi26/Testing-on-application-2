# Uses an official Node.js runtime image.
FROM node:22-alpine
# Sets the application working directory.
WORKDIR /app
# Copies dependency manifests before source code to improve build caching.
COPY package*.json ./
# Installs production dependencies inside the image.
RUN npm install --omit=dev
# Copies the application source code and configuration.
COPY sample_microservices ./sample_microservices
# Defines the service file as a build/run-time variable.
ARG SERVICE_FILE
# Defines the same service file as an environment variable for the container.
ENV SERVICE_FILE=${SERVICE_FILE}
# Starts whichever service file Docker Compose selects.
CMD ["sh", "-c", "node sample_microservices/${SERVICE_FILE}"]
