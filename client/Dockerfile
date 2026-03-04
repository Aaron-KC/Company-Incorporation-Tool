FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_BACKEND_URL=http://localhost:8000/api
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]