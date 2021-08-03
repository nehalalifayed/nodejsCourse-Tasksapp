
let sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(apiKey);


async function sendEmail (email , name)
{
    console.log("email: ", email)
    const msg = {
        to: email,
        from: 'nehal.ali@dafholding.com',
        subject: 'Thanks for joining in.',
      //  text: "thanks for joining in" , 
        html: `<h2> Hello ${name} , thanks for joining the task manager app. </h2>`,
    };
    await sgMail.send(msg);
    console.log("email is sent successfully!!!");
}

module.exports = sendEmail;