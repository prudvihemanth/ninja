import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";

const swaggerOptions = {
    info: {
        title: 'Ninja API Documentation',
        version: '1.0',
    },
};

const plugins = [
    {
        plugin: Inert
    },
    {
        plugin: Vision
    },

    {
        plugin: HapiSwagger,
        options: swaggerOptions
    }
]

export default plugins;