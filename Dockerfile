FROM node:6
MAINTAINER Adam M. Brown <adam.brown@hq.dhs.gov>

# Environment Variables
ENV NPM_CONFIG_LOGLEVEL warn
ENV PATH="${PATH}:/usr/src/app/node_modules/.bin/"

# Set up the application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install application dependencies
ADD package.json bower.json Makefile ./
RUN make install

# Add application code
ADD . /usr/src/app
RUN make gulp

EXPOSE 4200 9876

ENTRYPOINT [ "./entrypoint.sh" ]
