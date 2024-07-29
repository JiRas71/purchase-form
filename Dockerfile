# Použijte oficiální Node.js image jako základní image
FROM node:18

# Vytvořte pracovní adresář
WORKDIR /usr/src/app

# Zkopírujte package.json a package-lock.json
COPY package*.json ./

# Nainstalujte závislosti
RUN npm install

# Zkopírujte zdrojové soubory
COPY . .

# Expose port
EXPOSE 8080

# Definujte příkaz pro spuštění aplikace
CMD ["npm", "start"]