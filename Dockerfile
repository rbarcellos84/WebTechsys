FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# O caminho correto conforme sua pasta dist
COPY dist/web-techsys/browser /usr/share/nginx/html

# Permissões para evitar o erro 403
RUN chmod -R 755 /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80