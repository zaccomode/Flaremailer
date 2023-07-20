export declare namespace Flaremail {
    /** Sends an email using the Cloudflare Workers/MailChannels integration.
     * @param body Body of the request. Must include email recipient, sender, and content
     * @param headers Optional additional headers to include with the request
     * @param logResponse Whether to log the response content
     * @returns Status of the request
     */
    function send(body: MailBody, logResponse?: boolean): Promise<number>;
    /** Describes the body of an email request */
    type MailBody = {
        /** Personalizations of an email */
        personalizations: MailPersonalization[];
        /** The account that sent this email */
        from: MailParticipant;
        /** The subject of the email */
        subject: string;
        /** Content of the email */
        content: MailContent[];
    };
    /** Personalization of an email */
    type MailPersonalization = {
        /** Recipients of the email */
        to: MailParticipant[];
        /** Participants who are CC'd in to an email */
        cc?: MailParticipant[];
        /** Participants who are BCC'd in to an email */
        bcc?: MailParticipant[];
    };
    /** A sender or receiver of an email */
    type MailParticipant = {
        /** This recipient's email address */
        email: string;
        /** This recipient's name */
        name: string;
    };
    /** Content of an email */
    type MailContent = {
        type: ContentType | string;
        value: any;
    };
    /** The type of content to be sent as part of an email */
    enum ContentType {
        /** Default, plain text */
        textPlain = "text/plain",
        /** Text that supports HTML syntax */
        textHtml = "text/html"
    }
}
//# sourceMappingURL=Flaremail.d.ts.map