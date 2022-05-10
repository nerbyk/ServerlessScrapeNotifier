import axios from 'axios';
import applicationStatusData from '../models/applicationStatus';

export default class TelegramClient {
  botApiUrl: string;

  constructor(token) {
    this.botApiUrl = `https://api.telegram.org/bot${token}`;
  }

  async notifyClient(applicationData: applicationStatusData, clientId: string) {
    const text =
      `Новый статус заявки:  ${applicationData.status}\n      \  
       Внутренний статус: ${applicationData.internalStatus}\n \ 
       Процент выполнения: ${applicationData.percent}\n       \
       Дата получения: ${applicationData.createdAt}\n         \
       Дата последнего обновления: ${applicationData.updatedAt}`;

    await this.sendMessage(text, clientId);
  }

  private async sendMessage(text: string, clientId: string) {
    const data = { chat_id: clientId, text };
    const url = `${this.botApiUrl}/sendMessage`;

    return axios.post(url, data);
  }
}
