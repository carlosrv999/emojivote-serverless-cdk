FROM node:16-slim
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN chown -R node:node /home/node/app
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "index.js" ]