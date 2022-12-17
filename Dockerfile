# STEP 1: Setup
FROM nginx

#设置时间为中国上海，默认为UTC时间
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx

COPY dist /usr/share/nginx/html

#CMD [ "nginx", "-g", "daemon off;"]
