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
    Key: {
      uid
    }
  };

  return new Promise((resolve, reject) => {
    documentClient.get(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item as dynamoDbData);
      }
    });
  });
}
