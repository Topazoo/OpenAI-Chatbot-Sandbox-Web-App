# pull official base image
FROM node:14.16.0-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY app/package.json ./
COPY app/package-lock.json ./
RUN npm install --no-package-lock && npm install react-scripts -g

# add app
COPY ./app ./

# build app
RUN npm run build

# start app
CMD ["npm", "start"]
