# Evariant webapi

## Requirements

- <http://nodejs.org>

- [git](http://git-scm.com/downloads)

- NPM global modules:

    npm install -g gulp bunyan

### 01 Basic Server

    cd 01-basic_server
    node index.js

<http://localhost:3000>

### 02 Express

    cd 02-express
    npm install
    node index.js

<http://localhost:3000>







## Quick Start

    git clone git@github.com:sartioli/node-web-api-webapi.git
    cd node-web-api-webapi
    npm install
    gulp | bunyan -o short --color

Test:

- <http://localhost:3000/api/latest/basic/ping>

- <http://localhost:3000/api/latest/basic/config>

- <http://localhost:3000/api/latest/basic/echo/yourname>
