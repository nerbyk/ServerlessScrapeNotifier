import AWS from 'aws-sdk';

export type dynamoDbData = {
  uid: string,
  status: string,
  updatedAt: string
};

export async function putRequest(data: dynamoDbData) {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: data
  };

  documentClient.put(params).promise();
}

export async function getRequest(uid: string): Promise<dynamoDbData> {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { uid }
  };

  const request_data = await documentClient.get(params).promise()

  return request_data.Item as dynamoDbData;
}
