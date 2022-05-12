import { ApplicationStatus } from '../models/applicationStatus';
import { MidPassStatus } from '../fetchers/midPassFetcher';
import * as AWS from 'aws-sdk';

type ConnectionData = {
  region: string;
  tableName: string;
}
export class DBClient {
  documentClient: AWS.DynamoDB.DocumentClient;
  tableName: string;

  constructor(connectionData: ConnectionData) {
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      region: connectionData.region,
    });
    this.tableName = connectionData.tableName;
  }

  async putRequest(data: MidPassStatus): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: { ...data, updatedAt: new Date().toISOString() },
    };

    await this.documentClient.put(params).promise();
  }

  async getRequest(uid: string): Promise<ApplicationStatus> {
    const params = {
      TableName: this.tableName,
      Key: { uid },
    };

    const response = await this.documentClient.get(params).promise();

    return response.Item as ApplicationStatus;
  }
}
