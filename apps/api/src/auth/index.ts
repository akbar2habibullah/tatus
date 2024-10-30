import { Elysia, t } from 'elysia';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { GOOGLE_CLIENT_ID, JWT_SECRET } from '../../config'

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const authApp = new Elysia()
  .decorate('oauth2Client', oauth2Client)
  .post('/auth/google', async ({ body, oauth2Client, error }) => { 
    try {
      const { tokenId } = body;
  
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokenId,
        audience: GOOGLE_CLIENT_ID, 
      });
      const payload = ticket.getPayload();
  
      // Extract user information
      const { email, name, picture } = payload as TokenPayload;
  
      // Generate JWT (you can include more data in the payload if needed)
      const token = jwt.sign({ email, name, picture, userId: email?.split('@')[0] }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
  
      return { token }; 
    } catch (e) {
      console.error('Error verifying Google ID token:', e);
      return error(401)
    }
  }, {
    body: t.Object({
      tokenId: t.String()
    }),
  })