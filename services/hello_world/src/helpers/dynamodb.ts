import AWS from 'aws-sdk';

export type dynamoDbData = Record<
  string,
  {
    uid?: string | undefined;
    status: string | undefined;
    updated_at: string | undefined;
  }
>;


export async function putRequest(data: dynamoDbData) {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: data
  }

  documentClient.put(params)
}

export async function getRequest(uid: string): Promise<dynamoDbData> {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      uid: uid
    }
  }

  return new Promise((resolve, reject) => {
    documentClient.get(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Item as dynamoDbData);
      }
    })
  })
}
