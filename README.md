# NCATS-WebUI #

[![GitHub Build Status](https://github.com/cisagov/ncats-webui/workflows/build/badge.svg)](https://github.com/cisagov/ncats-webui/actions)

An [Angular](https://angular.io/) web application for displaying
[CyHy Vulnerability Scanning](https://github.com/cisagov/cyhy_amis) data.

## Getting Started ##

```console
git clone git@github.com:cisagov/ncats-webui.git
cd ncats-webui
cp src/config/config.sample.json src/config/config.json
make dev-build
```

### Configuration file ###

You can change the location of the API by modifying `src/config/config.json`.

| Field | Type | Description |
| ----- | ---- | ----------- |
| data_protocol | string | The protocol used for communicating with the API |
| data_host | string | The host of the API (IP/Hostname) |
| data_port | string | The port the API is running on |
| data_path | string | The path (if necessary) to access the API |
| cycle_pages | string | A string "true"/"false" to determine whether to auto-cycle the pages for the user |
| components | dict | A dictionary containing a component name and a boolean value to determine whether to show/hide that component. Example item: "hostmap": true |

NOTE: If you are running a local development server, the data path should be blank:

```json
   "data_path": "",
```

If you are running in Production, the data path should be the path to your API,
for example:

```json
   "data_path": "api",
```

## Developing and testing with Docker ##

The fastest way to get started developing and testing will be to use
[Docker](https://www.docker.com/). The following will build a development
server with live-reload enabled and expose it at `http://localhost:4200`. Any
code changes made by you in the `ncats-webui/src` directory will cause the site
to automatically update in your browser. Run the following command from the
root of the repository.

### Starting the development server ###

```console
make dev-start
```

### Viewing the development server logs ###

```console
make dev-logs
```

### Stopping the development server ###

When you are finished developing stop the development server.

```console
make dev-stop
```

### Cleaning up ###

If you are finished with the project, you can clean up all volumes and images
with the following:

```console
make dev-clean
```

## Adding components, services, etc. with Angular CLI ##

If you want to add new web pages, services, etc., ng is the tool to do the job.
It is the Angular CLI tool, which is what this project is built on.

### Executing ng commands ###

```console
$ make dev-shell
root@container# ng g component my-component
root@container# ng g service my-service
```

Ensure that the addition is added to the `app.module.ts` file with the rest of
it's type.

For more information on the usage of ng, visit
[https://github.com/angular/angular-cli/](https://github.com/angular/angular-cli/)

## Adding Packages ##

Since the npm/bower package installation occurs in the building of the image,
you will need to add your package using whatever method you like (easiest is
`npm install --save`, as shown below).

### Install NPM or Bower packages ###

```console
$ make dev-shell
root@container# npm install <package_name> --save
root@container# exit
```

Don't forget that this container is temporary. You will need to rebuild your
image with the new packages included when you're satisfied with your changes.
Note, you do not have to rebuild for changes to code, only changes to package
systems.

### Rebuild the development server ###

```console
make dev-rebuild
```

## Developing and testing with Node (no Docker) ##

### Prerequisites ###

- [Node v4.x.x or higher][node-installation]
- [NPM v3.x.x or higher][npm-installation]

#### A note for NPM users ####

When installing packages with npm, the package will be made available
"locally", or in your current working directory. From time to time you'll want
to use it to install packages "globally", or system-wide. npm global installs
are put in `/usr/local`, and binaries from those packages are sym-linked in
`/usr/local/bin`. Some people don't mind `sudo`'ing npm installs, or chowning
`/usr/local` to make this work. However, I prefer changing the npm prefix to
somewhere I have access to. An example of how to do this can be seen below:

```console
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

***~/.profile***

```bash
NPM_PREFIX=`npm config get prefix`
export PATH="$NPM_PREFIX/bin:$PATH"
```

More info can be found [here](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

### Development ###

You can get a quick test server up and running by issuing the following
commands

```console
cd client
make dev
./node_modules/.bin/ng serve
```

This will serve up the Angular 2 application at `http://localhost:4200`. Every
time you make changes to the application, the project should update itself and
reload.

### Building ###

```console
cd client
./node_modules/.bin/ng build --prod
```

Both of these methods output the prod files to a `dist` folder within the
`client/` folder of this repository. Copy this to your web server's directory
and you should be good to go. Ensure `.htaccess` looks good, and `mod_rewrite`
is enabled when using Apache.

## References ##

loading-circles - <http://codepen.io/Siddharth11/pen/xbGrpG>

## Contributing ##

We welcome contributions!  Please see [`CONTRIBUTING.md`](CONTRIBUTING.md) for
details.

## License ##

This project is in the worldwide [public domain](LICENSE).

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain
dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.

[angular-cli-repo]: https://github.com/angular/angular-cli
[node-installation]: https://nodejs.org/en/
[npm-installation]: http://blog.npmjs.org/post/85484771375/how-to-install-npm
