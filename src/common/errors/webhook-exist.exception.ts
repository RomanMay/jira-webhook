export class WebhookExistException extends Error {
  constructor() {
    super('Webhook already exist');
  }
}
