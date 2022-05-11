import axios, { AxiosResponse } from 'axios';
import passportStatus from '../models/applicationStatus';

export default class MidPassFetcher {
  status: passportStatus;

  async getStatus(applicationId: string): Promise<passportStatus> {
    const response = await this.fetch(applicationId).catch((error) => {
      throw new Error(error.message);
    });

    this.status ||= {
      uid: response.data.uid,
      status: response.data.passportStatus.name,
      internalStatus: response.data.internalStatus.name,
      percent: response.data.internalStatus.percent,
      createdAt: response.data.receptionDate,
    };

    return this.status;
  }

  private async fetch(applicationId): Promise<AxiosResponse> {
    return axios({
      url: `https://info.midpass.ru/api/request/${applicationId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10 * 1000,
    });
  }
}
