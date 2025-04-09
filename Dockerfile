# Stage 1: React App 빌드 (nodejs)
FROM node:22 AS build

WORKDIR /app

# 의존성 설치 
COPY package*.json .
RUN npm install

# 소스 카피
#   현재 디렉터리 -> 작업 디렉터리 
COPY . . 

# production 빌드 생성
RUN npm run build  

# Stage 2: React App Servlet (nginx)
FROM nginx:alpine 

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
