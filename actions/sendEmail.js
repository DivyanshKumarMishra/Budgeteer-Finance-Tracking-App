'use server';

import EmailTemplate from '@/emails/template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  user,
  subject = '',
  type = '',
  emailContent,
}) {
  try {
    // console.log(user.email, subject, type, emailContent);
    const { data, error } = await resend.emails.send({
      from: 'Budgeteer <onboarding@resend.dev>',
      to: user?.email,
      subject,
      react: EmailTemplate({
        userName: user?.firstname,
        type,
        data: emailContent,
      }),
    });

    if (error) {
      // console.log(error)
      throw new Error(error);
    }

    console.log(data)
    return { success: true, data };
  } catch (error) {
    console.log(error)
    return { success: false, error: error.message };
  }
}
