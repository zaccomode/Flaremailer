export declare namespace Flaremailer {
    /** Sends an email using the Cloudflare Workers/MailChannels integration.
     * @param body Body of the request. Must include email recipient, sender, and content
     * @param headers Optional additional headers to include with the request
     * @param logResponse Whether to log the response content
     * @returns Status of the request
     */
    function send(body: Body, logResponse?: boolean): Promise<number>;
    /** Describes the body of an email request */
    type Body = {
        /** A list of personalizations for this email */
        personalizations: Personalization[];
        /** The account that sent this email */
        from: Participant;
        /** The subject line of this email */
        subject: string;
        /** A list of content of the email */
        content: Content[];
    };
    /** Personalization of an email */
    type Personalization = {
        /** Direct recipients of the email */
        to: Participant[];
        /** Participants who are CC'd in to an email */
        cc?: Participant[];
        /** Participants who are BCC'd in to an email */
        bcc?: Participant[];
    };
    /** A sender or receiver of an email */
    type Participant = {
        /** This participant's email address */
        email: string;
        /** This participant's name */
        name: string;
    };
    /** Content of an email */
    type Content = {
        /** The content type of this email */
        type: ContentType | string;
        /** The content of this email */
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
//# sourceMappingURL=Flaremailer.d.ts.map