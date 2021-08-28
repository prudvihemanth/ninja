import {  Server } from "@hapi/hapi";
import {Client} from "@elastic/elasticsearch"
import Logger from "./src/utils/logger";
import plugins from "./src/plugins/plugins"
import ninjaRoutes from "./src/routes/ninjaRoutes";


const init = async () => {

    const server: Server = new Server({
        port: 3000,
        host: 'localhost',
            routes: {
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
    });

    const basePath: string = "/api/v1/";

    //register env
    require('dotenv').config()

    // register Hapi js plugins
    await server.register(plugins);

   
    //service heartbeat route
    server.route({
        method: 'GET',
        path: `${basePath}ping`,
        options: {
            auth: false
        },
        handler: () => {
            return { service: "ninja", version: "v1", status: "up" };
        }
    });


    //serve istanbul test cases coverage
    server.route({
        method: 'GET',
        path: '/{param*}',
        options: {
            auth: false
        },
        handler: {
            directory: {
            path: "./coverage",
            listing: true
        }
        }
    });

    //register user Routes
    ninjaRoutes.forEach((route: any) => {
        server.route(route);
    }) 
    
   

    //db connection with opensearch db
  //  const client = new Client({ node: 'http://localhost:9200' })



  
    // If receiving SIGINT
    process.on('SIGINT', () => {
        Logger.warn('Recieved Signint');
    });


   await server.start();

    Logger.info(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    Logger.error(err);
    process.exit(1);
});

init();
