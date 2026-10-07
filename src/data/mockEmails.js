export const initialEmails = [
  {
    id: 'em-1',
    sender: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@acmecloud.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      initials: 'SJ',
      company: 'Acme Cloud'
    },
    recipient: 'alex.rivera@intellimail.ai',
    subject: 'CRITICAL: API authentication failure on US-East prod cluster',
    snippet: 'We are experiencing 502 Bad Gateway responses on our production auth endpoints since 09:15 UTC...',
    date: '10:42 AM',
    timestamp: 'Today, Oct 14 • 10:42 AM',
    read: false,
    starred: true,
    folder: 'inbox',
    body: `Hi Alex and IntelliMail Engineering Team,

We are noticing a severe spike in 502 Bad Gateway responses on our production authentication endpoints connecting to your US-East cluster. This started at approximately 09:15 UTC right after your scheduled maintenance window.

Currently, roughly 28% of our active end-user login attempts are timing out. Our internal incident response team has opened SEV-1 ticket #88412.

Could your on-call team urgently investigate whether the rate-limiting proxies were misconfigured during the recent deployment? We need a mitigation plan or rollback within the next hour as our peak traffic window is approaching.

Best regards,
Sarah Jenkins
Lead Infrastructure Engineer, Acme Cloud`,
    aiAnalysis: {
      category: 'Support & Escalation',
      priority: 'High',
      sentiment: 'Frustrated / Urgent',
      intent: 'Urgent request for incident investigation, mitigation plan, or service rollback due to production auth failure.',
      summary: 'Acme Cloud is facing a 28% failure rate on production auth endpoints following our scheduled maintenance. SEV-1 ticket opened. Needs immediate on-call review and status reply within 1 hour.',
      actionRequired: 'Acknowledge SEV-1 incident immediately, alert On-Call DevOps, and provide rollback/mitigation ETA before 11:30 AM.',
      confidence: '99%'
    },
    suggestedReplies: [
      {
        tone: 'Professional & Urgent',
        text: `Hi Sarah,

Thank you for reporting this. We have acknowledged SEV-1 ticket #88412 and our core infrastructure on-call team is actively inspecting the US-East proxy configs from the morning maintenance window.

We are implementing a temporary traffic bypass right now and will update you with our mitigation status within the next 25 minutes.

Best regards,
Alex Rivera
IntelliMail Engineering Support`
      },
      {
        tone: 'Concise',
        text: `Hi Sarah,

Received. On-call engineering is actively triaging the US-East auth proxies now. Rollback procedure has been staged. I will share a direct status update in 20 minutes.

Regards,
Alex Rivera`
      },
      {
        tone: 'Technical Update',
        text: `Hi Sarah,

Our DevOps team identified an upstream connection pool bottleneck in the US-East cluster following the 09:15 UTC release. We are initiating a hotfix rollout now to stabilize traffic. Expected resolution time is under 30 minutes.

Thanks for your patience,
Alex Rivera`
      }
    ]
  },
  {
    id: 'em-2',
    sender: {
      name: 'Marcus Vance',
      email: 'm.vance@apexventures.co',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'MV',
      company: 'Apex Ventures'
    },
    recipient: 'alex.rivera@intellimail.ai',
    subject: 'Follow-up: Series A Term Sheet Discussion & Due Diligence',
    snippet: 'Loved the AI triage demonstration on Tuesday. Our investment committee convened yesterday afternoon...',
    date: '09:15 AM',
    timestamp: 'Today, Oct 14 • 09:15 AM',
    read: false,
    starred: true,
    folder: 'inbox',
    body: `Hey Alex,

Loved the AI triage and auto-reply demonstration on Tuesday. Our investment committee convened yesterday afternoon and feedback on IntelliMail's traction and retention metrics was overwhelmingly positive.

We'd like to invite you to our San Francisco partner office next Thursday at 2:00 PM PT to walk through the term sheet structure and cap table scenarios. Alternatively, we can do a virtual sync if you're traveling.

Let me know if Thursday works or if your team needs to review the preliminary diligence checklist beforehand.

Best,
Marcus Vance
Partner, Apex Ventures`,
    aiAnalysis: {
      category: 'Investor Relations',
      priority: 'High',
      sentiment: 'Enthusiastic & Positive',
      intent: 'Inviting founder to partner meeting to discuss Series A term sheet and due diligence checklist.',
      summary: 'Investment committee approved positive traction evaluation. Marcus is inviting IntelliMail for an in-person or virtual partner meeting next Thursday at 2:00 PM PT.',
      actionRequired: 'Confirm attendance for Thursday 2:00 PM PT and request the preliminary diligence checklist.',
      confidence: '96%'
    },
    suggestedReplies: [
      {
        tone: 'Warm & Professional',
        text: `Hi Marcus,

Thank you for the fantastic update! We are excited to partner with Apex Ventures and would be delighted to meet in person next Thursday at 2:00 PM PT at your San Francisco office.

Please send over the preliminary diligence checklist so our team can prepare all materials in advance. Looking forward to our discussion!

Best,
Alex Rivera`
      },
      {
        tone: 'Concise',
        text: `Hi Marcus,

Thursday at 2:00 PM PT in San Francisco works great for me. Please share the preliminary diligence checklist and visitor details. Looking forward to it!

Best,
Alex`
      }
    ]
  },
  {
    id: 'em-3',
    sender: {
      name: 'Elena Rostova',
      email: 'elena@novatech-solutions.io',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'ER',
      company: 'NovaTech'
    },
    recipient: 'alex.rivera@intellimail.ai',
    subject: 'Enterprise Pilot: Custom LLM Data Privacy Compliance',
    snippet: 'Our Chief Information Security Officer reviewed the IntelliMail architecture diagram...',
    date: 'Yesterday',
    timestamp: 'Yesterday, Oct 13 • 4:20 PM',
    read: true,
    starred: false,
    folder: 'inbox',
    body: `Hello Alex,

Our CISO reviewed the IntelliMail architecture diagram for our upcoming 500-seat pilot. 

We require confirmation regarding your zero-data-retention policy for enterprise tier customers:
1. Are customer email payloads excluded from foundational model fine-tuning?
2. Do you support bring-your-own-key (BYOK) encryption for cached embeddings?
3. Can you provide SOC2 Type II report and HIPAA BAA agreement?

If you have a standard security whitepaper addressing these three items, please forward it so we can expedite legal clearance.

Warm regards,
Elena Rostova
Head of Procurement, NovaTech Solutions`,
    aiAnalysis: {
      category: 'Sales & Security',
      priority: 'Medium',
      sentiment: 'Inquisitive / Formal',
      intent: 'Requesting security & compliance documentation (zero data retention, BYOK encryption, SOC2/HIPAA) for a 500-seat pilot.',
      summary: 'Enterprise prospect NovaTech is conducting compliance review before launching 500-seat pilot. Needs answers on fine-tuning exclusion, BYOK, and SOC2/HIPAA.',
      actionRequired: 'Attach IntelliMail Enterprise Security Whitepaper & standard SOC2 Type II summary packet.',
      confidence: '95%'
    },
    suggestedReplies: [
      {
        tone: 'Comprehensive & Reassuring',
        text: `Hi Elena,

Thank you for your inquiry. To confirm directly:
1. Yes, all enterprise customer data is strictly excluded from LLM training and fine-tuning with a strict zero-retention guarantee.
2. We support AWS KMS and Google Cloud BYOK encryption for all stored embeddings.
3. We are SOC2 Type II certified and can sign a HIPAA BAA.

I have attached our Enterprise Security Whitepaper and SOC2 overview. Let me know if you would like to schedule a 15-minute sync with our Security Lead.

Warm regards,
Alex Rivera`
      },
      {
        tone: 'Concise',
        text: `Hi Elena,

Yes to all three points: customer data is never used for training, we support BYOK, and our SOC2 Type II + HIPAA BAA packages are ready for signature. I've attached our Security Whitepaper for your legal team.

Best,
Alex`
      }
    ]
  },
  {
    id: 'em-4',
    sender: {
      name: 'David Kim',
      email: 'david.k@finpay-gateway.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      initials: 'DK',
      company: 'FinPay Gateway'
    },
    recipient: 'alex.rivera@intellimail.ai',
    subject: 'Invoice #INV-2026-108: Payment receipt and tax breakdown',
    snippet: 'Your monthly subscription payment for FinPay Gateway Cloud Tier was processed successfully...',
    date: 'Oct 12',
    timestamp: 'Oct 12 • 2:10 PM',
    read: true,
    starred: false,
    folder: 'inbox',
    body: `Dear Alex Rivera,

Thank you for your business. Your monthly subscription payment of $420.00 for FinPay Gateway Cloud Tier has been successfully processed.

Invoice Details:
- Invoice Number: #INV-2026-108
- Billing Period: Oct 1 - Oct 31, 2026
- Payment Method: Visa ending in 4192
- Total Paid: $420.00 USD

You can download your PDF tax receipt at any time from your billing dashboard. If you need tax ID changes or purchase order adjustments, please reply directly to this thread.

Thank you,
David Kim
FinPay Billing Operations`,
    aiAnalysis: {
      category: 'Billing & Finance',
      priority: 'Low',
      sentiment: 'Neutral / Informational',
      intent: 'Automated receipt and tax breakdown confirmation for monthly cloud tier payment ($420.00).',
      summary: 'Invoice #INV-2026-108 for $420.00 has been paid via Visa ending in 4192. PDF receipt available online.',
      actionRequired: 'No action required. Auto-archived to Finance records.',
      confidence: '99%'
    },
    suggestedReplies: [
      {
        tone: 'Standard Acknowledgment',
        text: `Hi David,

Received with thanks. We have filed invoice #INV-2026-108 for our quarterly accounting records.

Best regards,
Alex Rivera`
      }
    ]
  },
  {
    id: 'em-5',
    sender: {
      name: 'Maya Patel',
      email: 'maya@designcraft.studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      initials: 'MP',
      company: 'DesignCraft Studio'
    },
    recipient: 'alex.rivera@intellimail.ai',
    subject: 'New brand system & design tokens ready for review 🎨',
    snippet: 'Hey team, we just published the v2.0 design tokens in Figma including dark mode palettes...',
    date: 'Oct 11',
    timestamp: 'Oct 11 • 11:05 AM',
    read: true,
    starred: true,
    folder: 'inbox',
    body: `Hey Alex,

We just published the v2.0 design tokens in Figma, including the refined dark mode palettes, email reading typography hierarchy, and the new micro-interaction specs for the AI suggestion box!

Highlights:
- 12 new accessible semantic color tokens
- Clean monospace styling for AI confidence and metadata pills
- Updated interactive button states

Take a look at the Figma link when you get a chance and drop your comments directly on page 3. We are hoping to hand this off to the front-end engineers by Friday.

Cheers,
Maya Patel
Principal Product Designer`,
    aiAnalysis: {
      category: 'Product & Design',
      priority: 'Medium',
      sentiment: 'Positive / Collaborative',
      intent: 'Requesting review and feedback on Figma design tokens v2.0 before Friday engineering handoff.',
      summary: 'DesignCraft published v2.0 design tokens with accessible semantic colors, dark mode, and AI suggested reply micro-interactions. Review requested on page 3.',
      actionRequired: 'Review Figma page 3 and leave comments on token changes before Friday handoff.',
      confidence: '97%'
    },
    suggestedReplies: [
      {
        tone: 'Appreciative & Collaborative',
        text: `Hey Maya,

These tokens look fantastic! The typography hierarchy for the AI suggested replies in particular is super clean.

I will review page 3 in detail with the engineering team this afternoon and leave our notes directly in Figma before tomorrow noon. Thanks for the quick turnaround!

Best,
Alex`
      },
      {
        tone: 'Concise',
        text: `Hey Maya,

Looks great. I will review page 3 of the Figma file today and leave feedback before Friday's handoff. Thanks!

Alex`
      }
    ]
  },
  {
    id: 'em-6',
    sender: {
      name: 'DevWeekly Newsletter',
      email: 'digest@devweekly.tech',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      initials: 'DW',
      company: 'DevWeekly'
    },
    recipient: 'alex.rivera@intellimail.ai',
    subject: 'Issue #418: React 19 in production, Tailwind v4 tips, & LLM UI patterns',
    snippet: 'This week: How modern engineering teams are embedding streaming LLMs directly into web applications...',
    date: 'Oct 10',
    timestamp: 'Oct 10 • 8:00 AM',
    read: true,
    starred: false,
    folder: 'inbox',
    body: `DevWeekly #418

Welcome to this week's edition!
Here are the top articles hand-picked for engineering leads:

1. React 19 Concurrent Features in Production: Real-world benchmarks.
2. Mastering Tailwind v4: Why the new engine makes bundling 5x faster.
3. Designing Responsive AI Cockpits: UX heuristics for confidence scores and instant draft generation.
4. Open Source Spotlight: High-performance vector embeddings in the browser with WebAssembly.

Enjoy reading!
The DevWeekly Team`,
    aiAnalysis: {
      category: 'Newsletter & Insights',
      priority: 'Low',
      sentiment: 'Neutral / Informational',
      intent: 'Curated technical industry newsletter with articles on React, Tailwind, and AI UX.',
      summary: 'Weekly tech digest featuring React 19 benchmarks, Tailwind v4 features, and design heuristics for AI user interfaces.',
      actionRequired: 'No action required. Reading material.',
      confidence: '98%'
    },
    suggestedReplies: [
      {
        tone: 'None Needed',
        text: `No reply needed for newsletter digests.`
      }
    ]
  }
];

export const userProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@intellimail.ai',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'Product Lead'
};
