const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = 

// sgMail.setApiKey(sendgridAPIKey)        //for associating with API Key

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({                       //sgMail.send creates an object where we can give value for the following properties
//     to: 'jervthomas@gmail.com',
//     from: 'jervthomas@gmail.com',
//     subject: 'this is my first creation',
//     text: 'I hope you are able to see this!'
// })


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jervthomas@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the App, ${name}. Let me know how you get along with the app`
    })
    // It should be noted that the way name variable was accessed works only inside the template string enclosed in `` (key before 1 in keyboard)
    // This cant be done for strings enclosed in single or double quotes
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jervthomas@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Good Bye ${name}, We will meet again`
    })
    // It should be noted that the way name variable was accessed works only inside the template string enclosed in `` (key before 1 in keyboard)
    // This cant be done for strings enclosed in single or double quotes
}



module.exports ={
    sendWelcomeEmail,
    sendCancelationEmail
}
