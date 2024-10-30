import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { secretName } from '../../config'

const kmsClient = new SecretManagerServiceClient();

export const privateKey = async () => {
  try {
    const [accessResponse] = await kmsClient.accessSecretVersion({
      name: secretName,
    });

    const responsePayload = accessResponse!.payload!.data!.toString();
    return responsePayload;
  } catch (error) {
    console.error('Error accessing secret from Google Cloud KMS:', error);
    throw error; 
  }
}