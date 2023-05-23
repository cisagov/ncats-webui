FROM node:10-alpine

# For a list of pre-defined annotation keys and value types see:
# https://github.com/opencontainers/image-spec/blob/master/annotations.md
# Note: Additional labels are added by the build workflow.
LABEL org.opencontainers.image.authors="Adam M. Brown, vm-fusion-dev-group@trio.dhs.gov"
LABEL org.opencontainers.image.vendor="Cybersecurity and Infrastructure Security Agency"

# Environment Variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV PATH="${PATH}:/usr/src/app/node_modules/.bin/"

###
# Upgrade the system
#
# Note that we use apk --no-cache to avoid writing to a local cache.
# This results in a smaller final image, at the cost of slightly
# longer install times.
###
RUN apk --update-cache --no-cache --quiet upgrade

# Install package dependencies
RUN apk --no-cache --quiet add \
    git \
    make \
    # Provides the shasum command
    perl-utils

# Set up the application directory
RUN mkdir --parents /usr/src/app
WORKDIR /usr/src/app

# Bring in the Docker image's Makefile
COPY Makefile.docker Makefile

# Install application dependencies
COPY bower.json package.json ./
RUN make install

# Add httpd files
COPY .htaccess nginx.conf

# Add application code
COPY src/ src/
COPY .angular-cli.json gulpfile.js karma.conf.js protractor.conf.js ./
RUN make gulp

# Set up entrypoint
COPY entrypoint.sh /usr/local/bin
ENTRYPOINT ["entrypoint.sh"]

# Prepare to run
EXPOSE 4200 9876
CMD ["start"]
