const MAIL_CHANNELS_URI = "https://api.mailchannels.net/tx/v1/send";

export namespace Flaremailer {
  /** Sends an email using the Cloudflare Workers/MailChannels integration.
   * @param body Body of the request. Must include email recipient, sender, and content
   * @param headers Optional additional headers to include with the request
   * @param logResponse Whether to log the response content
   * @returns Status of the request
   */
  export async function send(body: MailBody, logResponse?: boolean) {
    try {
      let request = new Request(MAIL_CHANNELS_URI, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let response = await fetch(request);

      if (response.status === 500)
        console.error("Flaremail error 500: this is probably caused because you do not have permission to send emails from this address. See the documentation for more information.");

      if (logResponse) console.log("Mail sent! Response: \n", response.status, response.statusText, response);

      return response.status;
    } catch (e) {
      console.error("An error occured when sending mail!", e);
      return 500;
    }
  }



  /** Describes the body of an email request */
  export type MailBody = {
    /** Personalizations of an email */
    personalizations: MailPersonalization[];
    /** The account that sent this email */
    from: MailParticipant;
    /** The subject of the email */
    subject: string;
    /** Content of the email */
    content: MailContent[];
  }

  /** Personalization of an email */
  export type MailPersonalization = {
    /** Recipients of the email */
    to: MailParticipant[];
    /** Participants who are CC'd in to an email */
    cc?: MailParticipant[];
    /** Participants who are BCC'd in to an email */
    bcc?: MailParticipant[];
  }

  /** A sender or receiver of an email */
  export type MailParticipant = {
    /** This recipient's email address */
    email: string;
    /** This recipient's name */
    name: string;
  }

  /** Content of an email */
  export type MailContent = {
    type: ContentType | string;
    value: any;
  }

  /** The type of content to be sent as part of an email */
  export enum ContentType {
    /** Default, plain text */
    textPlain = "text/plain",
    /** Text that supports HTML syntax */
    textHtml = "text/html"
  }
}