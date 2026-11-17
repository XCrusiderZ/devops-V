FROM nginx:1.27.3-alpine

LABEL maintainer="Satrio Athallah & Hendrik Wahyu Kurniawan" \
      version="1.0.0" \
      description="Static Developer Portfolio Website"

COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
