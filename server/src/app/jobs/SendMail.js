import Mail from '../../lib/Mail';

class SendMail {
  get key() {
    return 'SendMail';
  }

  async handle({ data }) {
    const { user, subject, template, data: dataContext } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject,
      template,
      context: {
        user,
        data: dataContext,
      },
    });
  }
}

export default new SendMail();
