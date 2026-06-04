# Social Drive Website

## Phone OTP Auth Setup

Run the site through the Node backend:

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Create `.env` in the project root. The file is ignored by Git and must not be exposed on the frontend.

`SMS_API_KEY` is your MSG91 auth key.

`SMS_TEMPLATE_ID` is your MSG91 OTP template ID from the MSG91 dashboard under OTP -> Templates.

`SMS_API_SECRET` and `SMS_SENDER_ID` stay blank for MSG91 SendOTP.

`OTP_SECRET` is any long random hex string used by the backend to sign OTP hashes. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Testing OTP

1. Fill `SMS_API_KEY`, `SMS_TEMPLATE_ID`, and `OTP_SECRET` in `.env`.
2. Run `npm start`.
3. Go to `http://localhost:3000`.
4. Click `Login / Sign up`.
5. Signup with a valid Indian mobile number.
6. Verify the OTP delivered by MSG91.
7. Set a password.
8. Login again using phone number and password.
9. Test `Forgot Password?` to verify OTP reset and password update.

If SMS fails, check whether your backend IP is whitelisted in MSG91 or temporarily disable MSG91 IP security while testing. Keep IP security enabled in production and whitelist the production server IP.

Never log or hard-code `SMS_API_KEY`, `OTP_SECRET`, passwords, or OTPs in frontend code.
