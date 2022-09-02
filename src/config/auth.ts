import 'dotenv/config';

export default {
  forgot_pass_email_duration_minutes: Number(
    process.env.FORGOT_PASS_EMAIL_DURATION_MINUTES || 10
  ),
  secret_token: process.env.AUTH_SECRET_TOKEN,
  secret_refresh_token: process.env.AUTH_SECRET_REFRESH_TOKEN,
  expires_in_token: process.env.AUTH_EXPIRES_IN_TOKEN,
  expires_in_refresh_token: process.env.AUTH_EXPIRES_IN_REFRESH_TOKEN,
};
