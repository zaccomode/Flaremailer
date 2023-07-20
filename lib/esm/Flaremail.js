var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MAIL_CHANNELS_URI = "https://api.mailchannels.net/tx/v1/send";
export var Flaremail;
(function (Flaremail) {
    /** Sends an email using the Cloudflare Workers/MailChannels integration.
     * @param body Body of the request. Must include email recipient, sender, and content
     * @param headers Optional additional headers to include with the request
     * @param logResponse Whether to log the response content
     * @returns Status of the request
     */
    function send(body, logResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let request = new Request(MAIL_CHANNELS_URI, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                let response = yield fetch(request);
                if (response.status === 500)
                    console.error("Flaremail error 500: this is probably caused because you do not have permission to send emails from this address. See the documentation for more information.");
                if (logResponse)
                    console.log("Mail sent! Response: \n", response.status, response.statusText, response);
                return response.status;
            }
            catch (e) {
                console.error("An error occured when sending mail!", e);
                return 500;
            }
        });
    }
    Flaremail.send = send;
    /** The type of content to be sent as part of an email */
    let ContentType;
    (function (ContentType) {
        /** Default, plain text */
        ContentType["textPlain"] = "text/plain";
        /** Text that supports HTML syntax */
        ContentType["textHtml"] = "text/html";
    })(ContentType = Flaremail.ContentType || (Flaremail.ContentType = {}));
})(Flaremail || (Flaremail = {}));
