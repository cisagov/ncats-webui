# NCATS-WebUI

## Getting Started
```bash
$ hg clone ssh://code.ncats.dhs.gov//hg/ncats-webui
$ cd ncats-webui
$ cp src/config/config.sample.json src/config/config.json
$ make dev-build
```

#### src/config/config.json
You can change the location of the API by modifying src/config/config.json.

| Field         | Type     | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| data_protocol | string   | The protocol used for communicating with the API |
| data_host     | string   | The host of the API (IP/Hostname)                |
| data_port     | string   | The port the API is running on                   |
| data_path     | string   | The path (if necessary) to access the API        |
| cycle_pages   | string   | A string "true"/"false" to determine whether to auto-cycle the pages for the user |
| components    | dict     | A dictionary containing a component name and a boolean value to determine whether to show/hide that component. Example item: "hostmap": true    |

NOTE: If you are running a local development server, the data path should be blank:
```bash
   "data_path": "",
```
If you are running in Production, the data path should be the path to your API, for example:
```bash
   "data_path": "api",
```

## Developing and Testing with Docker
The fastest way to get started developing and testing will be to use docker. The following will build a development server with live-reload enabled and expose it at http://localhost:4200. Any code changes made by you in the ncats-webui/src directory will cause the site to automatically update in your browser. Run the following command from the root of the repository.

**_Starting Development Server_**
```bash
$ make dev-start
```

**_Viewing Development Server Logs_**
```bash
$ make dev-logs
```

When you are finished developing stop the development server.

**_Stopping Development Server_**
```bash
$ make dev-stop
```

If you are finished with the project, you can clean up all volumes and images with the following:

**_Cleaning Up_**
```bash
$ make dev-clean
```


##### Adding Angluar-CLI Components, Services, etc...
If you want to add new web pages, services, etc, ng is the tool to do the job. It is the angular-cli tool, which is what this project is built on.

**_Executing ng commands_**
```bash
$ make dev-shell
root@container# ng g component my-component
root@container# ng g service my-service
```

Ensure that the addition is added to the `app.module.ts` file with the rest of it's type.

For more information on the usage of ng, visit [https://github.com/angular/angular-cli/](https://github.com/angular/angular-cli/)

##### Adding Packages
Since the npm/bower package installation occurs in the building of the image, you will need to add your package using whatever method you like (easiest is npm install --save).

**_Install NPM or Bower Packages_**
```bash
$ make dev-shell
root@container# npm install <package_name> --save
root@container# exit
```

Don't forget that this container is temporary. You will need to rebuild your image with the new packages included when you're satisfied with your changes. Note, you do not have to rebuild for changes to code, only changes to package systems.

**_Rebuild Deveopment Server_**
```bash
$ make dev-rebuild
```

### Building for Release
Please use Jenkins to build your images for staging/production.

---

## Node Only (no Docker)
### Prerequisites
- [Node v4.x.x or higher][node-installation]
- [NPM v3.x.x or higher][npm-installation]

#####  For NPM users only
When installing packages with npm, the package will be made available "locally", or in your current working directory. From time to time you'll want to use it to install packages "globally", or system-wide. NPM global installs are put in /usr/local, and binaries from those packages are sym-linked in /usr/local/bin. Some people don't mind sudo'ing npm installs, or chowning /usr/local to make this work. However, I prefer changing the npm prefix to somewhere I have access to. An example of how to do this can be seen below:

```bash
$ mkdir ~/.npm-global
$ npm config set prefix '~/.npm-global'
```
**_~/.profile_**
```bash
NPM_PREFIX=`npm config get prefix`
export PATH="$NPM_PREFIX/bin:$PATH"
```

More info can be found [here](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

[angular-cli-repo]: <https://github.com/angular/angular-cli>
[node-installation]: <https://nodejs.org/en/>
[npm-installation]: <http://blog.npmjs.org/post/85484771375/how-to-install-npm>

#### Development
You can get a quick test server up and running by issuing the following
commands

```bash
$ cd client
$ make dev
$ ./node_modules/.bin/ng serve
```

This will serve up the angular 2 application at http://localhost:4200. Every time you make changes to the application, the project should update itself and reload.

#### Building
```bash
$ cd client
$ ./node_modules/.bin/ng build --prod
```

Both of these methods output the prod files to a dist folder within client/ folder of this repository. Copy this to your web server's directory and you should be good to go. Ensure .htaccess looks good, and mod_rewrite is enabled when using apache.

#### References
loading-circles - http://codepen.io/Siddharth11/pen/xbGrpG
