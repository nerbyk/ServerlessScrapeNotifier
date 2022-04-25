import axios, { AxiosResponse } from 'axios';
import passportStatus from '../models/applicationStatus';

export default class MidPassFetcher {
  applicationId: string;

  status: passportStatus;

  constructor(applicationId: string) {
    this.applicationId = applicationId;
  }

  async getStatus(): Promise<passportStatus> {
    const response = await this.fetch();

    this.status ||=
      {
        uid: response.data.uid,
        status: response.data.passportStatus.name,
        internalStatus: response.data.internalStatus.name,
        percent: response.data.internalStatus.percent,
        createdAt: response.data.receptionDate,
        updatedAt: new Date().toUTCString()
      };

    return this.status;
  }

  private async fetch(): Promise<AxiosResponse> {
    return axios({
      url: `https://info.midpass.ru/api/request/${this.applicationId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
