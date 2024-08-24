import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  // reciepent
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "0b8b755e-201e-4c90-af38-80fa859965d4",
      template_variables: {
        name: name,
        company_info_name: "Test_Company_info_name",
        company_info_address: "Test_Company_info_address",
        company_info_city: "Test_Company_info_city",
        company_info_zip_code: "Test_Company_info_zip_code",
        company_info_country: "Test_Company_info_country",
      },
    });
  } catch (error) {
    console.log("Error in sending welcome email");
    throw new Error(`Error in sending welcome email to : ${email}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const reciepent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: reciepent,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.log("Error in sending reset password mail");
  }
};

export const sendResetSuccessEmail = async (email) => {
  const reciepent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: reciepent,
      subject: "Password reset success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully",response);
  } catch (error) {
    throw new Error("Error in reset email sending");
  }
};
