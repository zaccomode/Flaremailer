# Types

## `Body`
This type encapsulates all information you can send through Flaremailer. 
- `personalizations: Personalization[]` - A list of personalisations for this email. 
- `from: Participant` - The account that sent this email.
- `subject: string` - The subject line of this email.
- `content: Content[]` - A list of content for this email.
This lists for both `personalizations` and `content`, should contain at most one item.

### Example
```ts
let body = { 
  personalizations: [{
    to: [{ email: "recipient@example.com", name: "Test Recipient" }],
  }],
  from: { email: "sender@example.com", name: "Test Sender" },
  subject: "Test email",
  content: [{
    type: "text/plain",
    value: "Look at all this test email content! How fabulous."
  }],
}
```

## `Personalization`
A personalization describes lists of recipients.
- `to: Participant[]` - A list of direct receivers for this email.
- `cc?: Participant[]` - An optional list of receivers who are CC'd in to an email.
- `bcc?: Participant[]` - An optional list of receivers who are BCC'd in to an email.
The participants defined in the `to` parameter will directly receive the email. There must be at least one direct receiver. Participants defined in the `cc` parameter will also receive the email, but will be visible in the CC section. Participants defined in the `bcc` parameter will receive the email, but will be defined in the BCC section and will therefore be invisible to everybody else.
All three lists can have as many participants as you desire.

### Example
```ts
let personalization = {
  to: [
    { email: "recipient@example.com", name: "Test Recipient" },
    { email: "another_recipient@example.com", name: "Moore Recipients" },
  ],
  cc: [{ email: "cc@example.com", name: "Carbon Copy" }],
  bcc: [{ email: "bcc@example.com", name: "Blind Carbon Copy" }],
}
```


## `Participant`
A participant is anybody who is involed in the email. They may be the one who sent the email, or the people who are receiving it.
- `email: string` - This participant's email address.
- `name: string` - This participant's name.

### Example
```ts
let participant = { 
  email: "recipient@example.com", name: "Test recipient",
}
```


## `Content`
This describes the literal content of the email being sent. Currently, only plain and HTML text appears to be supported.
- `type: ContentType | string` - The content type of this email. See below for more information.
- `value: any` - The content of this email.
The `type` attribute can either take the `Flaremailer.ContentType` enumerator, or a `string` if you want more fine-tuned control.

### `ContentType` (enum)
This enumerator defines all tested and compatible email content types:
- `textPlain = "text/plain"` - Default, plain text
- `textHtml = "text/html"` - Text that supports HTML syntax

### Example
```ts
let example = { 
  type: Flaremailer.ContentType.textPlain,
  value: "Hello world!",
}
```