FROM node:latest
WORKDIR /code

# start with dependencies to enjoy caching
COPY ./package.json /code/package.json
COPY ./package-lock.json /code/package-lock.json
RUN npm ci

EXPOSE 3000

# copy rest and build
COPY . /code/.
CMD ["node", "index.js"]
