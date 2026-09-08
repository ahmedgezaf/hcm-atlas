# Static image for OCI Container Instances, OKE, or any container host.
#
#   python3 build.py
#   docker build -f deploy/Dockerfile -t hcm-atlas .
#   docker run --rm -p 8080:8080 hcm-atlas
#
# Listens on 8080 as a non-root user, which is what Container Instances and
# OKE expect. Push to OCI Container Registry:
#   docker tag hcm-atlas <region>.ocir.io/<namespace>/hcm-atlas:latest
#   docker push        <region>.ocir.io/<namespace>/hcm-atlas:latest
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY dist/index.html /usr/share/nginx/html/index.html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
