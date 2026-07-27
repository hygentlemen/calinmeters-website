# Analytics Automation Setup

This project can generate a daily website report using:

- GA4 for visits, countries, viewed pages, and download events.
- Google Search Console for search keywords, search countries, and search landing pages.
- GitHub Actions for the daily schedule.
- Optional Feishu webhook delivery.

## 1. Create GA4

Create a GA4 web data stream for `https://calinmeters.com`.

Add this GitHub repository secret:

| Secret | Value |
| --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID, for example `G-XXXXXXXXXX` |

After the next deployment, page views and specification PDF clicks will be tracked.

## 2. Connect Search Console

Create or verify the Search Console property for the site.

Recommended property value:

```text
https://calinmeters.com/
```

If you use a domain property instead, the value may look like:

```text
sc-domain:calinmeters.com
```

## 3. Create Google service account

Create a Google Cloud service account and enable:

- Google Analytics Data API
- Google Search Console API

Give the service account email read access to:

- The GA4 property.
- The Search Console property.

### Option A: OAuth refresh token

This is the simplest option when Google UI does not accept a service account email as a GA4 or Search Console user.

Use the same Google account that already has access to GA4 and Search Console, then add these GitHub repository secrets:

| Secret | Value |
| --- | --- |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_OAUTH_REFRESH_TOKEN` | Refresh token for a Google account with GA4 and Search Console access |

The required OAuth scopes are:

```text
https://www.googleapis.com/auth/analytics.readonly
https://www.googleapis.com/auth/webmasters
```

The Search Console write scope is required by the sitemap-submission workflow and also covers the read operations used by reporting and URL inspection.

### Option B: keyless GitHub OIDC

If service account key creation is disabled by this organization policy:

```text
iam.disableServiceAccountKeyCreation
```

use Workload Identity Federation instead of JSON keys.

Add these GitHub repository secrets:

| Secret | Value |
| --- | --- |
| `GA_PROPERTY_ID` | GA4 numeric property ID, not the `G-...` measurement ID |
| `GSC_SITE_URL` | Search Console property URL, such as `https://calinmeters.com/` |
| `GOOGLE_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Provider resource name |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |

The Workload Identity Provider value looks like:

```text
projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

### Option C: JSON key

If your Google organization allows service account keys, you can use this secret instead of Workload Identity Federation:

| Secret | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full service account JSON, or base64 encoded JSON |

## 4. Optional Feishu delivery

Create a Feishu bot webhook and add:

| Secret | Value |
| --- | --- |
| `FEISHU_WEBHOOK_URL` | Feishu custom bot webhook URL |

If this is not set, GitHub Actions will still generate a report artifact.

## 5. Report schedule

The workflow runs every day at:

```text
08:30 Asia/Shanghai
```

You can also run it manually in GitHub:

```text
Actions -> Daily Analytics Report -> Run workflow
```

## 6. Report contents

Each report includes:

- Active users
- Sessions
- Page views
- Search keywords
- Search countries
- Website traffic by country
- Most viewed pages
- File downloads
- Search landing pages

Reports are uploaded as GitHub Actions artifacts under `reports/*.md`.

## 7. French inquiry privacy

French inquiry analytics record only interface language, product category, product ID, buyer-type selection and source-page group. Names, companies, email addresses, phone or WhatsApp numbers, country free text, technical requirements and inquiry notes must not be sent to GA4.

The Cloudflare inquiry Worker does not persist inquiry payloads. Its custom error log contains only a fixed event name, HTTP method and endpoint path; it must never include inquiry fields, raw IP addresses, Turnstile tokens, provider responses or secret values.
