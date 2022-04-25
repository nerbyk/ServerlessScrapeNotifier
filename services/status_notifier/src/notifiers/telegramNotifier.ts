import axios from 'axios';
import applicationStatusData from '../models/applicationStatus';

export default class TelegramNotifier {
  responseBody: applicationStatusData;

  BOT_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

  constructor(responseBody: applicationStatusData) {
    this.responseBody = responseBody;
  }

  async notifyClient() {
    const chatId = process.env.TELEGRAM_CLIENT_ID;
    const text = `
      Статус заявки ${this.responseBody.uid} изменился на ${this.responseBody.status}
      \nСтатус заявки внутренний ${this.responseBody.internalStatus}
      \nПроцент выполнения ${this.responseBody.percent}
      \nДата поступления ${this.responseBody.createdAt}
      \nПоследнее обновление ${this.responseBody.updatedAt}
    `;

    await this.sendMessage(chatId, text);
  }

  private async sendMessage(chatId: string, text: string) {
    const url = `${this.BOT_API_URL}/sendMessage`;
    const data = { chatId, text };

    return axios.post(url, data);
  }
}
