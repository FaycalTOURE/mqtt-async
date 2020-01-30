FROM debian:buster

MAINTAINER Damien T <damientprof@gmail.com>

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
LABEL org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.docker.dockerfile="/Dockerfile" \
    org.opencontainers.image.licenses="BSD 3-Clause" \
    org.opencontainers.image.title="docker-mosquitto"

RUN apt-get update && apt-get install -y wget gpg && \
    wget -q -O - https://repo.mosquitto.org/debian/mosquitto-repo.gpg.key | gpg --import && \
    gpg -a --export 8277CCB49EC5B595F2D2C71361611AE430993623 | apt-key add - && \
    wget -q -O /etc/apt/sources.list.d/mosquitto-buster.list https://repo.mosquitto.org/debian/mosquitto-buster.list && \
    apt-get update && apt-get install -y mosquitto mosquitto-clients && \
    adduser --system --disabled-password --disabled-login mosquitto

RUN mkdir -p /mosquitto/config /mosquitto/data /mosquitto/log
COPY config /mosquitto/config
RUN chown -R mosquitto:mosquitto /mosquitto
VOLUME ["/mosquitto/config", "/mosquitto/data", "/mosquitto/log"]


EXPOSE 1883 9001

ADD docker-entrypoint.sh /usr/bin/
RUN chmod 755 /usr/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]
