FROM node:20-alpine AS build
WORKDIR /usr/src/app                
COPY package* yarn* ./
RUN yarn global add npm@latest

COPY . .                           
RUN npm install                     
RUN npx prisma generate             
RUN yarn build                     
EXPOSE 3000                         
CMD ["npm", "run","start:prod"]    