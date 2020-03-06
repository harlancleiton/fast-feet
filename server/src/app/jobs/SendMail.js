class SendMail {
  get key() {
    return 'SendMail';
  }

  async handle({ data }) {
    // eslint-disable-next-line no-console
    console.log('SendMail.handle ok: ', data);
  }
}

export default new SendMail();
