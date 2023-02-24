import { allowedOrigins } from "./allowedOrigins";

export const corsOptions = {
    origin: (origin, callback)=>{
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            console.log("origin found");
            callback(null, true);
        }else{
            console.log("origin found");
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT, PATCH, DELETE"
}

