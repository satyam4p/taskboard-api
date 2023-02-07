import * as express from 'express';
import commentsModal from '../../models/commensModal';
import authMiddleware from '../../middleware/auth.middleware';
import validationMiddleware from '../../middleware/Validation.middleware';
import { cloneDeep } from "lodash";
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import createComment from '../../dto/createComment.dto';

class CommentsController{

    public path = "/comments";
    public router = express.Router()

    private comments = commentsModal;

    constructor(){
        this.initializeRoutes();
    }

    initializeRoutes = () =>{
        this.router.all(`${this.path}/*`,authMiddleware)
        .post(`${this.path}/create`, validationMiddleware(createComment), this.postComment)
        .get(`${this.path}/:id`, this.getTaskComments)
    }
    /**
     * @function postComment
     * @param request 
     * @param response 
     */
    postComment = ( request: express.Request, response: express.Response) => {
        try{
            const req = request.body;
            const postedComment = new this.comments({
                ...req
            });
            postedComment.save((error, comment)=>{
                if(error){
                    response.status(400).send({
                        message:"some error occured while posting comment",
                        error: error
                    })
                } else{
                    console.log("comment:: ",comment);
                    response.send({
                        comment,
                        message: "comment posted successfully"
                    });
                }
            });
        }catch (error){
            console.log("some error occured while posting comment", error);
            response.status(400).send({
                message:"some error occured while posting comment",
                error: error
            });
        }
    }

    getTaskComments = (request : express.Request, response: express.Response) => {

        const taskId = request.params.id;

        try{
            this.comments.find({
                taskId
            },(error: any, comments: any)=>{
                if(error){
                    response.status(400).send({
                        message: "task does not exists",
                        error
                    })
                }else{

                    response.status(200).send(comments);

                }
            })
        }catch(error){
            response.status(400).send({
                mesage: "an error occured while fetching comments",
                error
            });
        }
    }

}

export default CommentsController;

