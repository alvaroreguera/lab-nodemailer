const transporter = require("./transporterGmail")

const sendAwesomeMail = (mail, confirmationCode) =>{
transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: mail, 
    subject: 'Awesome Subject', 
    text: ` Nacho & Álvaro test, http://localhost:3000/auth/confirm/${confirmationCode}`,

})
// .then(info => console.log(info))
.catch(error => console.log(error))
}
module.exports = sendAwesomeMail;