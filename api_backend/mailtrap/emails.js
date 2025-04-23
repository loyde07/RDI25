import { mailtrapClient, sender } from "./mailtrap.config.js"
import {VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE,  PASSWORD_RESET_REQUEST_TEMPLATE} from './emailTemplates.js'

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]
    
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category: "Email Verfification"
        })
        console.log("Email verification sent succefffully", response)    
    } 
    catch (error) {
        console.log("Error sending verification email: ", error)
        throw new Error('Error sending verification email: ',error)
        
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "5ec20a13-7c21-426a-8b16-e5da36e9d38f",
            template_variables: {
            company_info_name: "Lan-Party Ephec Company",
            name: name
            },
        })
        console.log("Welcome email sent successfully : ", response)
    } catch (error) {
        console.log("Error sending welcome email : ", error);
        throw new Error('Error sending welcome email: ', error);
    }
    
}

export const sendPasswordResetRequest = async (email, resetURL) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
        console.log("Password reset successfully : ", response)
        
    } catch (error) {
        console.log("Error sending resset password email: ", error);
        throw new Error('Error sending resset password email: ', error);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject:"Email Password successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset Successful"

        })
        console.log("Email password success reset sent successful ", response)
    } catch (error) {
        console.log("Error sending email password sucess reset: ", error);
        throw new Error('Error sending email password sucess reset: ', error);
        
    }
}