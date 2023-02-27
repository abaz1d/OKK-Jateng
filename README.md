# OKK-Jateng

## Introduction

This is a simple full stack Vue application which provides a solid starting point for [PostgreSQL](https://www.postgresql.org/), [ExpressJS](https://expressjs.com/), [Vue.js](https://vuejs.org/) and [NodeJS](https://nodejs.org/en/) based applications. Client side code is written in Vue and the backend API is written using Express.

This application is used to manage OKK member data in Central Java Province, Indonesia.

## Before You Begin

Before you begin i recommend you to read about the basic building blocks that assemble this application:
* PostgreSQL - Go through [PostgreSQL Official Website](https://www.postgresql.org/) and proceed to their [Official Manual](https://www.postgresql.org/docs), which should help you understand NoSQL and PostgreSQL better.
* Express - The best way to understand express is through it's [Official Website](https://expressjs.com/), which has a [Getting Started](https://expressjs.com/en/starter/installing.html) guide, as well as an [ExpressJS](https://expressjs.com/en/guide/routing.html) guide for general express topics.
* Vue.js - Vue [Official Website](https://vuejs.org/) is a great starting point.
* Node.js - Start by going through [Node.js Official Website](https://nodejs.org/en/) which should get you going with the Node.js platform.

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
* PostgreSQL - [Download & Install PostgreSQL](https://www.postgresql.org/docs/index.html), and make sure it's running on the default port (27017).

## front-end

 - VueJS (ES6)
 - vue-router (*Single Page Application*)
 - Pinia

*source files in `frontend/` folder.*
## back-end

 - NodeJS
 - ExpressJS
 - PostgreSQL

*source files in `backend/` folder*

## Quick Start

open terminal to run server,
*Please make sure your Database (PostgreSQL) is running*

```bash
# Clone the repository
git clone git@github.com:abaz1d/OKK-Jateng.git

# Go inside the directory
cd OKK-Jateng

# Install dependencies for server
cd backend && npm install

# Start server
npm start
```

open new terminal to run client

```bash
# Go inside the directory
cd OKK-Jateng

# Install dependencies for client
cd frontend && npm install

# Start client
npm run dev
```

this application should run on port 5173 , you can access it through browser, just go to [http://localhost:5173/](http://localhost:5173/) for Client Web App. and
[http://localhost:3000/](http://localhost:3000/) for RESTful APIs.

Link VPS : http://153.92.210.7:82/ <br/>
### Default Admin
```sh
Email       :admin@gmail.com
Password    :123
```

### Default Operator
```sh
Email       :operator@gmail.com 
Password    :123
```

### Screenshots Client Web Mode
<img src="https://user-images.githubusercontent.com/95122515/221474810-37d8d454-765d-46eb-9e10-6e247ba579c1.png" width="49%"> <img src="https://user-images.githubusercontent.com/95122515/221474799-488d6657-2376-454a-8cd9-6e0324cb07c4.png" width="49%">

<img src="https://user-images.githubusercontent.com/95122515/221474817-7c0d06af-480a-4f46-8f73-6fa0cff539c1.png" width="49%"> <img src="https://user-images.githubusercontent.com/95122515/221474814-9f564652-295d-488a-968b-f4c16767453d.png" width="49%">
<hr />

### Screenshots Client Mobile Mode
<img src="https://user-images.githubusercontent.com/95122515/221474929-2fbe0669-2b17-440c-8da3-89028623c20f.png" width="25%"> <img src="https://user-images.githubusercontent.com/95122515/221474925-c7c39cab-9845-4b90-b902-57c7c4aded3a.png" width="24%"> <img src="https://user-images.githubusercontent.com/95122515/221474932-5b2beb91-db1b-473b-8186-b1589bb71f53.png" width="25%"> <img src="https://user-images.githubusercontent.com/95122515/221474935-2f79f9ac-6dbe-4442-99b4-760d4f143ae2.png" width="24%"> 

