import aws from 'aws-sdk';

const getAWSCreds = () =>{

    aws.config.getCredentials((err)=>{
        if(err){
            console.log("an error occured while accessing S3:: ",err);
        }

        const s3 = new aws.S3({apiVersion:'2023-04-01.1'});
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
    })

}
export default getAWSCreds;