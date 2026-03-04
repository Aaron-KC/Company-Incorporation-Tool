FROM node:20-alpine
WORKDIR /app
RUN npm install -g wait-on
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8000
ENV DB_HOST=db
ENV DB_USER=appuser
ENV DB_PASSWORD=yourpassword
ENV DB_NAME=Corporations
EXPOSE 8000
CMD ["sh", "-c", "wait-on tcp:db:3306 && node src/index.js"]