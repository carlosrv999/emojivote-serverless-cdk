FROM node:16-slim
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN chown -R node:node /home/node/app
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3001
EXPOSE 50051
CMD [ "node", "index.js" ]
