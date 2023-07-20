const MAIL_CHANNELS_URI = "https://api.mailchannels.net/tx/v1/send";

export namespace Flaremailer {
  /** Sends an email using the Cloudflare Workers/MailChannels integration.
   * @param body Body of the request. Must include email recipient, sender, and content
   * @param headers Optional additional headers to include with the request
   * @param logResponse Whether to log the response content
   * @returns Status of the request
   */
  export async function send(body: Body, logResponse?: boolean) {
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
  export type Body = {
    /** A list of personalizations for this email */
    personalizations: Personalization[];
    /** The account that sent this email */
    from: Participant;
    /** The subject line of this email */
    subject: string;
    /** A list of content of the email */
    content: Content[];
  }

  /** Personalization of an email */
  export type Personalization = {
    /** Direct recipients of the email */
    to: Participant[];
    /** Participants who are CC'd in to an email */
    cc?: Participant[];
    /** Participants who are BCC'd in to an email */
    bcc?: Participant[];
  }

  /** A sender or receiver of an email */
  export type Participant = {
    /** This participant's email address */
    email: string;
    /** This participant's name */
    name: string;
  }

  /** Content of an email */
  export type Content = {
    /** The content type of this email */
    type: ContentType | string;
    /** The content of this email */
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