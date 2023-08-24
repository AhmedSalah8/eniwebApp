import sgMail from '@sendgrid/mail';

sgMail.setApiKey(String(process.env.SENDGRID_KEY));

const sendMail = async (to: string, from: string, subject: string, text: string): Promise<void> => {
	const msg = {
		to,
		from,
		subject,
		html: text,
	};
	await sgMail.send(msg);
};

export default sendMail;
