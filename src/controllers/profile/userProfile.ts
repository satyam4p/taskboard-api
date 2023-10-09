import aws from 'aws-sdk';
import userModel from '../../models/user.model';
import validationMiddleware from "../../middleware/validation.middleware";
import { User } from "../../interfaces/user.interface";
import express from 'express';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import authMiddleware from '../../middleware/auth.middleware';
import { cloneDeep, result } from 'lodash';


class UserProfile {

    public router = express.Router();
    public path = '/profile';
    private user = userModel;

    constructor(){

        this.initializeRoutes();

    }

    initializeRoutes = ()=>{

        this.router.get(`${this.path}`,authMiddleware, this.getUserProfile)

    }

    getUserProfile = async (request: express.Request, response: express.Response, next: express.NextFunction) =>{
        let { user } = request as RequestWithUser;
        if(user){
            user.password = undefined;
            user.tokens = undefined;
            const profileKey = user.username.toLowerCase() +'.jpg';
            const profileUrl = await getProfile(profileKey);
            if(profileUrl){
                const userProfile = {
                    user,
                    profile: profileUrl
                }
                response.status(200).send(userProfile);
                return;
            }
            response.status(200).send({
                user,
                profile: "an error occured while fetching profile"
            });
        }else{
            response.status(404).send({
                message:'user not found'
            });    
        }
    }
}

export const getProfile = async ( profileKey : any ) =>{
    try{
        const s3 = new aws.S3({apiVersion:'2023-04-01.1', signatureVersion:'v4', region:'ap-south-1'});
        s3.listBuckets((err, data)=>{
            if(err){
                console.log("error occured while accessing the buckets:: ",err);
            }else{
                const buckets = data.Buckets;
            }

        })
        const bucketParams = {
            Bucket: 'taskboard',
        }
        s3.listObjects(bucketParams, (err, data)=>{
            if(err){
                console.log("an error occured while fetching the object list:: ",err);
            }else{
                const objectList = data;
            }
        })
        const params = {
            Bucket: 'taskboard',
            Key: profileKey 
        }
        
        const objectPromise = s3.getSignedUrlPromise('getObject', params);
        const url = await objectPromise.then((url=>{
            return url
        }));
        return url;
    }catch(error){
        console.log("error occured while fetching profile:: ",error);
        return null;
    }

}

export default UserProfile;