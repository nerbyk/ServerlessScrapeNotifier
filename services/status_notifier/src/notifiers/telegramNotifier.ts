import axios from 'axios';
import applicationStatusData from '../models/applicationStatus';

export default class TelegramNotifier {
  responseBody: applicationStatusData;

  BOT_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

  constructor(responseBody: applicationStatusData) {
    this.responseBody = responseBody;
  }

  async notifyClient() {
    const text =
      `Новый статус заявки:  ${this.responseBody.status}` +
      `\nВнутренний статус: ${this.responseBody.internalStatus}` +
      `\nПроцент выполнения: ${this.responseBody.percent}` +
      `\nДата получения: ${this.responseBody.createdAt}` +
      `\nДата последнего обновления: ${this.responseBody.updatedAt}`;

    await this.sendMessage(text);
  }

  private async sendMessage(text: string) {
    const data = { chat_id: process.env.TELEGRAM_CLIENT_ID, text };
    const url = `${this.BOT_API_URL}/sendMessage`;

    return axios.post(url, data);
  }
}
