/**
 * Email content builders (HTML + plain-text) for every transactional message.
 *
 * Each builder returns `{ subject, html, text }` ready to hand to lib/integrations/resend.
 * Styling is inline (email clients ignore <style>) and uses the Fix4U brand palette.
 * Tone follows the Content Plan: plain-spoken, outcome-focused, every email points to one action.
 */

import { formatMoney, type RoiResult } from "@/lib/roi";
import { publicEnv } from "@/lib/env";

const BRAND = {
  ink: "#141417",
  coral: "#FF5640",
  paper: "#F3F1EC",
  grey: "#8F8D88",
};

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/** Escape user-supplied text before interpolating into HTML (prevents injection in emails). */
function esc(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Shared responsive-ish layout wrapper. `bodyHtml` is trusted (built by us, not user input). */
function layout(opts: { heading: string; bodyHtml: string; ctaText?: string; ctaUrl?: string }): string {
  const cta =
    opts.ctaText && opts.ctaUrl
      ? `<tr><td style="padding:8px 0 0;">
           <a href="${opts.ctaUrl}" style="display:inline-block;background:${BRAND.coral};color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px;">${esc(opts.ctaText)}</a>
         </td></tr>`
      : "";
  return `<!doctype html><html><body style="margin:0;background:${BRAND.paper};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:24px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:32px;">
          <tr><td style="font-weight:800;font-style:italic;font-size:20px;color:${BRAND.ink};padding-bottom:16px;">fix4u</td></tr>
          <tr><td style="font-size:22px;font-weight:700;line-height:1.3;padding-bottom:12px;">${esc(opts.heading)}</td></tr>
          <tr><td style="font-size:15px;line-height:1.6;color:${BRAND.ink};">${opts.bodyHtml}</td></tr>
          ${cta}
          <tr><td style="font-size:12px;color:${BRAND.grey};padding-top:24px;border-top:1px solid #eee;margin-top:16px;">
            AI agents that fix the leak in your funnel. · <a href="${publicEnv.siteUrl}" style="color:${BRAND.grey};">${publicEnv.siteUrl.replace(/^https?:\/\//, "")}</a>
          </td></tr>
        </table>
      </td></tr>
    </table></body></html>`;
}

const bookUrl = `${publicEnv.siteUrl}/book`;

/* ------------------------------ Contact form ------------------------------ */

export function contactLeadAutoresponder(input: { name: string }): EmailContent {
  const subject = "Thanks — we got your message";
  const bodyHtml = `<p>Hi ${esc(input.name)},</p>
    <p>Thanks for reaching out to Fix4U. We've got your message and will reply within one business day — usually much faster.</p>
    <p>If you'd rather just grab a time now, book a free 15-minute call below and we'll show you exactly how an AI booking agent would work for your business.</p>`;
  const text = `Hi ${input.name},\n\nThanks for reaching out to Fix4U. We've got your message and will reply within one business day — usually much faster.\n\nPrefer to grab a time now? Book a free 15-minute call: ${bookUrl}\n\n— Fix4U`;
  return { subject, html: layout({ heading: "We got your message", bodyHtml, ctaText: "Book a call", ctaUrl: bookUrl }), text };
}

export function contactFounderAlert(input: {
  name: string;
  email: string;
  business?: string;
  niche?: string;
  message: string;
}): EmailContent {
  const subject = `New lead: ${input.name}${input.business ? ` (${input.business})` : ""}`;
  const bodyHtml = `<p><strong>New contact form submission.</strong></p>
    <ul>
      <li><strong>Name:</strong> ${esc(input.name)}</li>
      <li><strong>Email:</strong> ${esc(input.email)}</li>
      ${input.business ? `<li><strong>Business:</strong> ${esc(input.business)}</li>` : ""}
      ${input.niche ? `<li><strong>Niche:</strong> ${esc(input.niche)}</li>` : ""}
    </ul>
    <p><strong>Message:</strong><br>${esc(input.message).replace(/\n/g, "<br>")}</p>`;
  const text = `New contact form submission.\n\nName: ${input.name}\nEmail: ${input.email}\nBusiness: ${input.business || "-"}\nNiche: ${input.niche || "-"}\n\nMessage:\n${input.message}`;
  return { subject, html: layout({ heading: "New lead 🎉", bodyHtml }), text };
}

/* ------------------------------ Booking ------------------------------ */

export function bookingLeadConfirmation(input: { name: string; date: string; time: string }): EmailContent {
  const subject = "Your Fix4U discovery call is booked";
  const bodyHtml = `<p>Hi ${esc(input.name)},</p>
    <p>You're booked in for a free 15-minute discovery call:</p>
    <p style="font-size:18px;font-weight:700;">${esc(input.date)} &middot; ${esc(input.time)}</p>
    <p>We'll send a calendar invite with the Google Meet link shortly. See you then!</p>`;
  const text = `Hi ${input.name},\n\nYou're booked in for a free 15-minute discovery call:\n${input.date} · ${input.time}\n\nWe'll send a calendar invite with the Google Meet link shortly.\n\n— Fix4U`;
  return { subject, html: layout({ heading: "Your call is booked 🎉", bodyHtml }), text };
}

export function bookingFounderAlert(input: {
  name: string;
  email: string;
  business?: string;
  niche?: string;
  date: string;
  time: string;
  notes?: string;
}): EmailContent {
  const subject = `New booking: ${input.name} — ${input.date} ${input.time}`;
  const bodyHtml = `<p><strong>New discovery call booked.</strong></p>
    <ul>
      <li><strong>When:</strong> ${esc(input.date)} at ${esc(input.time)}</li>
      <li><strong>Name:</strong> ${esc(input.name)}</li>
      <li><strong>Email:</strong> ${esc(input.email)}</li>
      ${input.business ? `<li><strong>Business:</strong> ${esc(input.business)}</li>` : ""}
      ${input.niche ? `<li><strong>Niche:</strong> ${esc(input.niche)}</li>` : ""}
    </ul>
    ${input.notes ? `<p><strong>Their #1 funnel leak:</strong><br>${esc(input.notes).replace(/\n/g, "<br>")}</p>` : ""}
    <p>Add it to your calendar and send the invite.</p>`;
  const text = `New discovery call booked.\n\nWhen: ${input.date} at ${input.time}\nName: ${input.name}\nEmail: ${input.email}\nBusiness: ${input.business || "-"}\nNiche: ${input.niche || "-"}\n\nLeak: ${input.notes || "-"}`;
  return { subject, html: layout({ heading: "New booking 📅", bodyHtml }), text };
}

/* ------------------------------ Free AI audit ------------------------------ */

export function auditLeadAutoresponder(input: { name: string }): EmailContent {
  const subject = "Your free AI audit is on the way";
  const bodyHtml = `<p>Hi ${esc(input.name)},</p>
    <p>Got it — we'll review your link and record a short personalised audit showing where you're leaking leads and how an AI agent would plug the gap. Expect it within a couple of business days.</p>
    <p>Want to talk it through live instead? Book a free call any time.</p>`;
  const text = `Hi ${input.name},\n\nGot it — we'll review your link and record a short personalised audit showing where you're leaking leads and how an AI agent would plug the gap. Expect it within a couple of business days.\n\nPrefer to talk live? Book a free call: ${bookUrl}\n\n— Fix4U`;
  return { subject, html: layout({ heading: "Your free audit is on the way", bodyHtml, ctaText: "Book a call instead", ctaUrl: bookUrl }), text };
}

export function auditFounderAlert(input: {
  name: string;
  email: string;
  business?: string;
  niche?: string;
  url: string;
  problem: string;
}): EmailContent {
  const subject = `Audit request: ${input.name}${input.business ? ` (${input.business})` : ""}`;
  const bodyHtml = `<p><strong>New free-audit request — record a Loom.</strong></p>
    <ul>
      <li><strong>Name:</strong> ${esc(input.name)}</li>
      <li><strong>Email:</strong> ${esc(input.email)}</li>
      ${input.business ? `<li><strong>Business:</strong> ${esc(input.business)}</li>` : ""}
      ${input.niche ? `<li><strong>Niche:</strong> ${esc(input.niche)}</li>` : ""}
      <li><strong>URL:</strong> <a href="${esc(input.url)}">${esc(input.url)}</a></li>
    </ul>
    <p><strong>Main problem:</strong><br>${esc(input.problem).replace(/\n/g, "<br>")}</p>`;
  const text = `New free-audit request — record a Loom.\n\nName: ${input.name}\nEmail: ${input.email}\nBusiness: ${input.business || "-"}\nNiche: ${input.niche || "-"}\nURL: ${input.url}\n\nMain problem:\n${input.problem}`;
  return { subject, html: layout({ heading: "New audit request 🔎", bodyHtml }), text };
}

/* ------------------------------ Newsletter ------------------------------ */

export function newsletterWelcome(): EmailContent {
  const subject = "You're in — welcome to Fix4U";
  const bodyHtml = `<p>Thanks for subscribing.</p>
    <p>You'll get occasional, practical notes on speed-to-lead, automation done right, and how local businesses turn missed messages into booked appointments. No fluff.</p>`;
  const text = `Thanks for subscribing to Fix4U.\n\nYou'll get occasional, practical notes on speed-to-lead, automation done right, and how local businesses turn missed messages into booked appointments. No fluff.\n\nReady to talk? Book a call: ${bookUrl}`;
  return { subject, html: layout({ heading: "Welcome to Fix4U", bodyHtml, ctaText: "Book a call", ctaUrl: bookUrl }), text };
}

/* ------------------------------ ROI result ------------------------------ */

export function roiResultEmail(result: RoiResult): EmailContent {
  const subject = `You could be losing ${formatMoney(result.lostRevenuePerMonth)}/month in missed leads`;
  const bodyHtml = `<p>Based on what you entered:</p>
    <ul>
      <li><strong>${result.missedEnquiriesPerMonth}</strong> enquiries slip through each month</li>
      <li>That's about <strong>${formatMoney(result.lostRevenuePerMonth)}/month</strong> (${formatMoney(result.lostRevenuePerYear)}/year) walking out the door</li>
      <li>An AI agent could recover roughly <strong>${formatMoney(result.recoverableRevenuePerMonth)}/month</strong> (${formatMoney(result.recoverableRevenuePerYear)}/year)</li>
    </ul>
    <p>Let's recover it. Book a free 15-minute call and we'll show you exactly how.</p>`;
  const text = `Based on what you entered:\n- ${result.missedEnquiriesPerMonth} enquiries slip through each month\n- ~${formatMoney(result.lostRevenuePerMonth)}/month (${formatMoney(result.lostRevenuePerYear)}/year) lost\n- An AI agent could recover ~${formatMoney(result.recoverableRevenuePerMonth)}/month (${formatMoney(result.recoverableRevenuePerYear)}/year)\n\nBook a free call to recover this: ${bookUrl}`;
  return { subject, html: layout({ heading: "Here's what missed leads are costing you", bodyHtml, ctaText: "Book a call to recover this", ctaUrl: bookUrl }), text };
}

export function roiFounderAlert(input: { email: string; result: RoiResult }): EmailContent {
  const subject = `ROI calc completed: ${input.email}`;
  const r = input.result;
  const bodyHtml = `<p><strong>Someone completed the ROI calculator.</strong></p>
    <ul>
      <li><strong>Email:</strong> ${esc(input.email)}</li>
      <li><strong>Enquiries/mo:</strong> ${r.inputs.enquiriesPerMonth}</li>
      <li><strong>% missed:</strong> ${r.inputs.percentMissed}%</li>
      <li><strong>Avg value:</strong> ${formatMoney(r.inputs.avgCustomerValue)}</li>
      <li><strong>Lost/mo:</strong> ${formatMoney(r.lostRevenuePerMonth)}</li>
      <li><strong>Recoverable/mo:</strong> ${formatMoney(r.recoverableRevenuePerMonth)}</li>
    </ul>`;
  const text = `ROI calculator completed.\n\nEmail: ${input.email}\nEnquiries/mo: ${r.inputs.enquiriesPerMonth}\n% missed: ${r.inputs.percentMissed}%\nAvg value: ${formatMoney(r.inputs.avgCustomerValue)}\nLost/mo: ${formatMoney(r.lostRevenuePerMonth)}\nRecoverable/mo: ${formatMoney(r.recoverableRevenuePerMonth)}`;
  return { subject, html: layout({ heading: "ROI calculator completed", bodyHtml }), text };
}
