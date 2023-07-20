# Flaremailer
> The unofficial package to make sending emails with Cloudflare Workers easier.

This package exists as an unofficial way to provide a type-safe API for the [Cloudflare Workers / MailChannels integration](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/).

## Quick Start
Install Flaremailer using:
```bash
npm install flaremailer
```

To send an email with Flaremailer, use the following code:
```js
import { Flaremailer } from "flaremailer";

let response = await Flaremailer.send(
  {
    personalizations: [{
      to: [{ email: "recipient@example.com", name: "Test Recipient" }],
    }],
    from: { email: "sender@example.com", name: "Test Sender" },
    subject: "Test email",
    content: [{
      type: "text/plain",
      value: "Look at all this test email content! How fabulous."
    }],
  },
);
console.log(response);
```
If the above code is successful, you should see `202` in your console. 
From a code standpoint, that's all there is to it! Read on to find out how to configure your Worker and domain DNS settings for a seamless experience.

## Type support
For TypeScript users, this package include type safety for tested features! Check out the [types doc file for more information](docs/types.md).


## Common Errors
### `500` - Internal Server Error
This often occurs because the send email address has MailChannels' Domain Lockdown enabled, thus you cannot impersonate that email address. For more information about this, see the *Spoofing Protection* section below.

### `401` - Unauthorized
Currently, Flaremailer only supports functionality from a Cloudflare domain. This means that your Worker must be running in edge preview (*not local mode, which is default*), or published to Cloudflare's edge network. This error most often occurs when you are running your Worker in local mode in a test environment.


## SPF Setup
Some mailbox providers (namely Gmail) have strict email screen procedures that require you to setup a Sender Policy Framework (SPF) record in your domain's DNS so that it can confirm your Worker is legitimately allowed to send emails from that domain.

### What if I don't do this?
At the moment, Flaremailer will silently fail if it cannot reach the mailbox due to SPF invalidity. This is seemingly a limitation with Cloudflare and MailChannels.

### Updating your DNS
In your domain's DNS settings, add a TXT record with the following values, replacing `yourdomain.com` with your domain:
- **Location:** `yourdomain.com`
- **Type:** `TXT`
- **Value:** `v=spf1 include:relay.mailchannels.net ~all`

If your domain already has a SPF DNS record configured, insert `include:relay.mailchannels.net` at the end of the existing record (but before `~all`), like so:

- **Location:** `yourdomain.com`
- **Type:** `TXT`
- **Value:** `v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net ~all`

And that's it! Your emails should now be accepted by all mailbox providers.

### Further reading
[MailChannels - Setting up SPF records](https://support.mailchannels.com/hc/en-us/articles/200262610-Set-up-SPF-Records)


## Spoofing Protection with Domain Lockdown
MailChannels' Domain Lockdown feature (MailChannels being the organisation Cloudflare collaborated with to provide this service) uses the DNS to prove that you control the domains you want to send from via your Worker. The Domain Lockdown allows you to indicate a list of senders and accounts permitted to send emails from your domain. Any other accounts that attempt to send from your domain will be rejected with an error.

**Currently, three lockdown identifiers are supported:**
1. `auth` - This identifies a MailChannels customer, such as a web hosting provider, by specifying the authentication username of the customer. `auth` codes are a sequence of letters and numbers, such as `myhostingcompany`.
2. `senderid` - This identifies a specific sender identity, such as a PHP script or authenticated webmail user account. `senderid` strings specify the provider, type of identity, and the identity, all in a single string. An example of a `senderid` is `myhostingcompany|x-authuser|myusername`.
3. `cfid` - This identifies a Cloudflare Worker and is used to prevent spoofing from your domain if you wish to send email from Cloudflare Workers using the MailChannels `/send` API. An example of a `cfid` is `username.workers.dev`.

**Implementing Domain Lockdown:**
Create a DNS `TXT` record like so (replacing `yourdomain.com` with your literal domain name):
> **Value:** `_mailchannels.yourdomain.com`
> **Type:** `TXT`
> **Content:** `v=mc1 ...`

**What to include in the Content field:**
Other than `v=mc1`, other values are optional. The record can contain any number or combination of `auth`, `senderid` and `cfid` fields, including leaving the list blank. Each field must specify **only one** value.
1. To completely block MailChannels from sending any emails using your domain, leave the TXT record as:
```content
v=mc1
```
2. To lock the domain to a specific Cloudflare Workers account, use:
```content
v=mc1 cfid=username.workers.dev
```
3. To lock the domain to a single provider, use:
```content
v=mc1 auth=myhostingcompany
```
4. To lock the domain to two different providers, use:
```content
v=mc1 auth=myhostingcompany auth=anotherprovider
```
5. To lock the domain to a specific Sender-ID, use:
```content
v=mc1 senderid=myhostingcompany|x-authuser|myusername
```

### Finding your `cfid`
1. Go to https://dash.cloudflare.com/
2. Select "Workers & Pages" from the left navigation bar
3. Find your ID in the Subdomain section of your Account Details on the right

Alternatively, you can just try sending without a Domain Lockdown record present and MailChannels will generate an error message that contains your `cfid` for convenience. Cut and paste that into your `_mailchannels` DNS record.

### Finding your `auth` or `senderid`
Every message sent through MailChannels carries two headers that can be used to identify the `auth` and `senderid` of the message:
- `X-MailChannels-Auth-Id` - this header carries the `auth`
- `X-MailChannels-Sender-Id` - this header carries the `senderid`

### WARNING
Specifying `auth=cloudflare` in your Domain Lockdown record will authorize every Cloudflare Worker to send from your domain. For obvious reasons, this is not recommended.

### Further reading
[MailChannels - Spoofing protection with Domain Lockdown](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown-)
