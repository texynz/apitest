# App

For more info see the docs at [docs.solarc.io](https://docs.solarc.io)

Application source code.

## Installation

This project uses yarn workspaces.

To get started use the package manager [yarn v1](https://classic.yarnpkg.com/lang/en/) to install.

```bash
yarn install
```

## Update

This project uses an update utility that will merge project.zip files into the source code.

You can run this manually from the project root.

```bash
npm run update project.zip
```

Or you can run the update.bat file in the project root.

## Dependencies

This project uses docker compose to run services locally.

Install [docker from here](https://hub.docker.com/editions/community/docker-ce-desktop-windows/).

To manually start the services run.
```bash
docker-compose up
```


This project will start a local postgres database on the port **5432**.

The postgres server will have
- the database name "**app**"
- the user "**local_user**" 
- the password "**local_password**" 

## Usage

To start the application run.

```bash
npm run dev
# or yarn dev
```

This will start the application API server on [http://localhost:3000](http://localhost:3000)

To view the API documentation view [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

To view the API OpenAPI specification view [http://localhost:3000/api/openapi.json](http://localhost:3000/api/openapi.json)

You can import the OpenAPI specification into development tools such as [Postman](https://www.postman.com/downloads/) and it will populate with the API for testing.
See the [Postman docs](https://learning.postman.com/docs/integrations/available-integrations/working-with-openAPI/) for more detail on importing OpenAPI specifications into Postman.

Note: this will also start docker-compose and the postgres database

### Build

To build the application files run.

```bash
npm run build
# or yarn build

```

This will build and pack all the resource into ./servers/app

To build a docker image of the application run.

```bash
npm run build
# or yarn build
docker build -f ./infrastructure/app-server/docker/server.Dockerfile -t <image-name> .
```

## Notes

Please be aware of the following:

- By default the application has authorization checks disabled. This is so you can start using it without worrying about loading permissions into the database. 
To enable permissions update the Viewer file in ```<root>/packages/app-server/src/server/viewer.ts``` and remove the lines 
```typescript
    // Development only: Remove once permissions are added
    public async isAuthorized(
        rule: string,
        data?: Record<string, any>,
    ): Promise<boolean>{
        return true;
    }

    // Development only: Remove once permissions are added
    public async readAuthorizedData(
        rule: string,
        data: Record<string, any>,
    ): Promise<any> {
        return data;
    }
```

