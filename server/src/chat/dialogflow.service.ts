import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionsClient } from '@google-cloud/dialogflow';
import { throwError } from '../common/helpers/helpers';

@Injectable()
export class DialogflowService {
  private readonly projectId: string;
  private readonly languageCode: string;
  private readonly client: SessionsClient;

  constructor(private readonly configService: ConfigService) {
    this.projectId =
      this.configService.get<string>('DIALOGFLOW_PROJECT_ID') || '';
    this.languageCode =
      this.configService.get<string>('DIALOGFLOW_LANGUAGE_CODE') || 'en';

    if (!this.projectId)
      throw new Error('DIALOGFLOW_PROJECT_ID environment variable is required');

    this.client = new SessionsClient({
      keyFilename: this.configService.get<string>(
        'GOOGLE_APPLICATION_CREDENTIALS',
      ),
    });
  }

  async detectIntent(sessionId: string, message: string): Promise<string> {
    const sessionPath = this.client.projectAgentSessionPath(
      this.projectId,
      sessionId,
    );

    try {
      const [response] = await this.client.detectIntent({
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: this.languageCode,
          },
        },
      });

      return (
        response.queryResult?.fulfillmentText ||
        'Sorry, I could not understand that.'
      );
    } catch (error) {
      throw throwError(
        `Dialogflow API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
