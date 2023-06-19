import nodemailer from 'nodemailer';

interface emailOptionsInterface  {
    from: string,
    to: string,
    subject: string,
    text: string
}


export const SendEmail = (emailOptions: emailOptionsInterface)=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'teagan.brown4@ethereal.email',
            pass: 'wgFHvXWAcFd323A47K'
        }
    });

    transporter.sendMail(emailOptions,(error, info)=>{

        if(error){
            console.log("error:: ",error);
        }else{
            console.log("response:: ",info);
        }
    })


}