FROM node:lts-slim
WORKDIR /app
# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./
# Instala las dependencias del proyecto
RUN npm install
# Copia el contenido de tu proyecto al directorio de trabajo en el contenedor
COPY . .
CMD [ "node", "app.js" ]