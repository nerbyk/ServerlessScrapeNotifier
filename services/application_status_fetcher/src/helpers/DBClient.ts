import AWS from 'aws-sdk';
import applicationStatusData from '../models/applicationStatus';

export class DBClient {
  documentClient: AWS.DynamoDB.DocumentClient;
  tableName: string = process.env.TABLE_NAME;

  constructor(region) {
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      region: region,
    });
  }

  async putRequest(data: applicationStatusData) {
    const params = {
      TableName: this.tableName,
      Item: { ...data, updatedAt: new Date().toISOString() },
    };

    await this.documentClient.put(params).promise();
  }

  async getRequest(uid: string): Promise<applicationStatusData> {
    const params = {
      TableName: this.tableName,
      Key: { uid },
    };

    const response = await this.documentClient.get(params).promise();

    return response.Item as applicationStatusData;
  }
}
