FROM node:latest
# Preconfigura el contenedor con la imagen de Node con la ultima versión.

WORKDIR /app

# Copia los elementos que son necesarios para construir la aplicación a contener.
COPY package*.json ./

# Construir las dependencias para la aplicación.
RUN npm install

# Copiamos el codigo fuente (o archivos necesarios) de la aplicación.
COPY . .

EXPOSE 3000

#Ejecutar la aplicación.
CMD ["npm", "run", "dev"]