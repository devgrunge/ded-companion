import "dotenv/config";
import AWS from "aws-sdk";

// Configure as credenciais AWS
AWS.config.update({
  region: process.env.AWSREGION,
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACESSKEY,
});

// Creating instance of DynamoDB
export const dynamoClient = new AWS.DynamoDB.DocumentClient();
