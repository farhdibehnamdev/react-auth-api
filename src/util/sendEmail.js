// require("dotenv").config();
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
dotenv.config({});
// var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = ({ to, from, subject, text, html }) => {
  const sender = {
    email: from,
  };
  const receivers = [
    {
      email: to,
    },
  ];
  tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: subject,
    textContent: text,
  });
};
