# Acquisition measurement contract — 2026-09-08

## Event meanings

| Action | English | French | Interpretation |
| --- | --- | --- | --- |
| First interaction with form | contact_form_start | fr_quote_start | Once per mounted form, not a qualified lead |
| Submission response | contact_form_submit | fr_quote_submit | Read `result`; only success is endpoint acceptance |
| Email link | email_click | fr_email_click | Opens mail client, does not prove sending |
| WhatsApp link | whatsapp_click | fr_whatsapp_click | Opens a conversation, does not prove sending |
| Download | GA enhanced file_download | GA enhanced file_download | Daily download total; do not add custom PDF events to it |
| Buyer entry | inquiry_cta_click | existing inquiry_cta_click | English buyer_type is mini_grid / utility_tender / manufacturing_partner |

`contact_click` remains a legacy unclassified count. New English handlers emit only the named method event, avoiding duplicates. Footer, catalog CTA, sidebar and contact-section links are covered. French legacy event names are preserved.

Report GA4 queries still use bounded concurrency and retries. The same all-site event responses provide the French subset, so this change adds no normal GA4 requests. Historical 30/90-day events cannot recover clicks that were never instrumented.

## GA4 configuration dependency

The 2026-09-06 artifact indicates missing custom dimensions. A property administrator must confirm event-scoped `result`, `product_category`, `product_id`, `buyer_type`; optional drilldowns use `interface_language` and `source_context`. Registering a custom dimension does not backfill historical data. Until usable result rows are returned, the report explicitly displays successful submissions as unknown. API read access does not confer configuration access.

After deployment, inspect one internal test in GA4 DebugView (exclude internal traffic) and verify result attribution in a subsequent processed report. Do not use production customer forms to send test emails without authorization. No names, email addresses, company names, messages, phone numbers or free-text inquiry content are event parameters in this change.

## Reporting periods and quality

GA4 uses the property timezone for the requested calendar date. Report selection defaults to yesterday in Asia/Shanghai. GSC uses its own Pacific calendar and now queries report date minus three days, explicitly printed separately. Empty GSC property totals remain unavailable, never summed from limited top-page/query rows. Zero-impression rows have no meaningful CTR or position.

A form success means the endpoint accepted the inquiry. Email delivery, spam/quality, sales qualification and project country require private operational records. Do not infer these from a click, IP country, or GA4 success. Do not publish customer-level records in GitHub weekly issues.
