import AWS from 'aws-sdk';
import applicationStatusData from '../models/applicationStatus';

export async function putRequest(data: applicationStatusData) {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: { updatedAt: new Date().toUTCString(), ...data }
  };

  documentClient.put(params).promise();
}

export async function getRequest(uid: string): Promise<applicationStatusData> {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { uid }
  };

  const request_data = await documentClient.get(params).promise()

  return request_data.Item as applicationStatusData;
}
