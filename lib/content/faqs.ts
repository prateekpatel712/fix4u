/**
 * Canonical Fix4U FAQ list — the single source of truth for both the homepage FAQ section
 * and the chatbot's grounding (website chat + WhatsApp agent).
 *
 * Editing a question/answer here updates the page AND what the bot knows, so they never drift.
 * (If Sanity is configured later, CMS FAQs take priority; these are the always-present baseline.)
 */

export interface Fix4uFaq {
  question: string;
  answer: string;
}

export const FIX4U_FAQS: Fix4uFaq[] = [
  {
    question: "How much does a custom AI agent cost?",
    answer:
      "We offer simple, upfront pricing consisting of a one-time setup fee (for training and integrating the bot with your systems) and a flat monthly hosting/maintenance fee. We also offer low-risk pilot programs. Book a call for a custom quote based on your lead volume.",
  },
  {
    question: "How long does it take to go live?",
    answer:
      "Typically, we can build, train, test, and deploy your custom AI agent in under 2 weeks. This includes training it on your exact pricing, services, and FAQ, plus integrating it with your CRM and calendar.",
  },
  {
    question: "Where are you based?",
    answer:
      "We are based in India, operating globally. We sync with your timezone for communications and ensure 24/7 technical monitoring of your AI agents so they never go offline.",
  },
  {
    question: "Is my customer data secure?",
    answer:
      "Yes. All customer data collected via the AI chatbots is encrypted and directly synced to your CRM (e.g. HubSpot). We do not store or resell your leads' data.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "We just need your service menu, pricing list, and a list of frequently asked questions. We build, train, and test the agent ourselves, then send you a private link to try it out before it goes live.",
  },
  {
    question: "What if the AI makes a mistake or doesn't work?",
    answer:
      "We build strict guardrails into our AI prompts so it only answers questions about your services. If a query is outside its scope, it politely flags it and hands off the conversation to a human. Plus, we back our work with a performance guarantee.",
  },
];
