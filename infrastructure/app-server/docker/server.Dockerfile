# @graph-mind
# Remove the previous line to prevent this file from being modified by the robots
# @graph-mind
# Remove the previous line to stop Ada from updating this file
FROM node:12-alpine
#Config node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

#Make app directory
RUN mkdir -p /opt/app
RUN mkdir -p /opt/app/modules
RUN chown -R node:node /opt/app

# Copy source code
COPY --chown=node:node ./packages/app-server/dist/package.json /opt/app/package.json
COPY --chown=node:node ./packages/app-server/dist/index.production.js /opt/app/index.js
# Copy private modules
COPY --chown=node:node ./packages/app-server/dist/modules /opt/app/modules

#Install dependencies
RUN apk --update --no-cache --virtual .build-deps-app \
    add \
    make \
    gcc \
    g++ \
    bash \
    python \
    openssl \
    openssh-client \
    git \
    && cd /opt/app \
    && npm install node-gyp --no-audit \
    && npm install --only=production --no-audit \
    && rm -rf  ./modules \
    && apk del .build-deps-app

#Change working directory
WORKDIR /opt/app
USER node

#Expose our ports
EXPOSE 8080 8081
#Run the startup script
ENV NODE_ENV=production
CMD ["node","/opt/app/index.js"]