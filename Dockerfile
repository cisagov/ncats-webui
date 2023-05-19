FROM node:6

# For a list of pre-defined annotation keys and value types see:
# https://github.com/opencontainers/image-spec/blob/master/annotations.md
# Note: Additional labels are added by the build workflow.
LABEL org.opencontainers.image.authors="Adam M. Brown, vm-fusion-dev-group@trio.dhs.gov"
LABEL org.opencontainers.image.vendor="Cybersecurity and Infrastructure Security Agency"

# Environment Variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV PATH="${PATH}:/usr/src/app/node_modules/.bin/"

# Set up the application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install application dependencies
COPY bower.json Makefile npm-shrinkwrap.json package.json ./
RUN make install

# Add application code
COPY . /usr/src/app
RUN make gulp

EXPOSE 4200 9876

ENTRYPOINT ["./entrypoint.sh"]
CMD ["start"]
