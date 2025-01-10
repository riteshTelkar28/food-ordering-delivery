import nodemailer from 'nodemailer';
var mailer = (mailData,email,callback)=>{
    // a transporter object that is able to send mail 
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'codewithritesh28@gmail.com',
            pass:'lnfo thpj gxia yiyb'
        }
    });

    const mailOption = {
        from:'codewithritesh28@gmail.com',
        to:email,
        subject:"Mail From Foodies Hub ",
        html:mailData
    }

    transporter.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("error while sending mail ",error);
        }
        else{
            callback(info);
        }
    })
}



export default {mailer:mailer};