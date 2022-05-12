import axios from 'axios';

type MidPassGetResponse = {
  data: {
    uid: string,
    receptionDate: string,
    passportStatus: {
      name: string
    },
    internalStatus: {
      name: string,
      percent: string
    }
  }
}

export type MidPassStatus = {
  uid: string,
  status: string,
  internalStatus: string,
  percent: string
  createdAt: string
}
export class MidPassFetcher {
  async getStatus(applicationId: string): Promise<MidPassStatus> {
    const response : MidPassGetResponse = await this.fetch(applicationId).catch((error) => {
      throw new Error(error.message);
    });

    return {
      uid: response.data.uid,
      status: response.data.passportStatus.name,
      internalStatus: response.data.internalStatus.name,
      percent: response.data.internalStatus.percent,
      createdAt: response.data.receptionDate,
    };
  }

  private async fetch(applicationId: string): Promise<MidPassGetResponse> {
    return await axios({
      url: `https://info.midpass.ru/api/request/${applicationId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10 * 1000,
    }) as MidPassGetResponse; 
  }
}
