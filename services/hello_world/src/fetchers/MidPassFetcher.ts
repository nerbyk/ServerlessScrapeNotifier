import axios, { AxiosResponse } from 'axios';

interface passportStatus {
  uid: string,
  status: string;
  internalStatus: string;
  percent: number;
  createdAt?: string;
}

export default class MidPassFetcher {
  application_id: string;

  constructor(application_id: string) {
    this.application_id = application_id;
  }

  async getStatus(): Promise<passportStatus> {
    const response = await this.fetch();

    return {
      uid: response.data.uid,
      status: response.data.passportStatus.name,
      internalStatus: response.data.internalStatus.name,
      percent: response.data.passportStatus.percent,
      createdAt: response.data.receptionDate,
    }
  }
  

  private async fetch(): Promise<AxiosResponse> {
    return axios({
      url: `https://info.midpass.ru/api/request/${this.application_id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}