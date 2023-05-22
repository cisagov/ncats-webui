FROM node:6

# For a list of pre-defined annotation keys and value types see:
# https://github.com/opencontainers/image-spec/blob/master/annotations.md
# Note: Additional labels are added by the build workflow.
LABEL org.opencontainers.image.authors="Adam M. Brown, vm-fusion-dev-group@trio.dhs.gov"
LABEL org.opencontainers.image.vendor="Cybersecurity and Infrastructure Security Agency"

# Environment Variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV PATH="${PATH}:/usr/src/app/node_modules/.bin/"

# Update the apt SourceList now that Debian Stretch's packages have been archived
RUN printf "deb http://archive.debian.org/debian stretch main\ndeb http://archive.debian.org/debian-security stretch/updates main\n" > /etc/apt/sources.list

# Update system packages. The latest node:6 image available was created before
# Debian Stretch support ended completely. This will ensure we have the latest
# package versions available.
RUN apt-get update --quiet --quiet \
    && apt-get upgrade --quiet --quiet \
    && apt-get clean --quiet --quiet \
    && rm --recursive --force /var/lib/apt/lists/*

# Set up the application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install application dependencies
COPY .bowerrc bower.json Makefile npm-shrinkwrap.json package.json ./
RUN make install

# Add application code
COPY . /usr/src/app
RUN make gulp

EXPOSE 4200 9876

ENTRYPOINT ["./entrypoint.sh"]
CMD ["start"]
