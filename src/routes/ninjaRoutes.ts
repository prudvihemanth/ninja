import Joi from "joi";

import { ninjaController } from "../controllers/ninjaController";

const controller = new ninjaController();
const basePath: string = "/api/v1/";


const ninjaRoutes = [
    {
        method: 'GET',
        path: `${basePath}getSerumBuyTransactions/{pubkey}`,
        handler: controller.getSerumBuyTransactions,
        options: {
            description: 'Get serum buy transactions',
            notes: 'Filter Serum buy transactions for all blocks of solano',
            tags: ['api'], 
            validate: {
                params: Joi.object({
                    pubkey: Joi.string().min(10).max(200)
                }),
            }
        }
    }]


export default ninjaRoutes;
