window.PORTFOLIO_CONTENT = {
  // ── Site identity (used for SEO, OpenGraph, JSON-LD and contact links) ──
  site: {
    url: 'https://jyotinarang.com',
    name: 'Jyoti Narang',
    jobTitle: 'Managing Solution Architect · Global SAP Treasury & Banking Transformation Lead',
    email: 'Jyoti.narang@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jyoti-narang-30a8ba56/',
    github: 'https://github.com/jyotinarang-hue',
    credly: 'https://www.credly.com/users/jyoti-narang/badges'
  },

  // ── Inquiry form delivery. Fill ONE of these to receive submissions by email. ──
  // Web3Forms: get a free access key at https://web3forms.com (enter your email, the key arrives by email).
  // Formspree: create a free form at https://formspree.io and paste its endpoint, e.g. 'https://formspree.io/f/abcdwxyz'.
  // Leave both empty and the form opens the visitor's email app with the message pre-filled.
  inquiry: {web3formsKey: '', formspreeEndpoint: ''},

  sapProfile: 'https://profile.sap.com/u/JyotiNarang',
  credentials: [],
  toastmastersAchievements: [],
  github: {username: 'jyotinarang-hue', includeRepositories: [], discoverPattern: 'sap|treasury|lockbox|cash[-_ ]?sweep|finance|payment|roi', refreshMinutes: 15},

  // ── Book ──
  book: {
    status: 'Book proposal submitted to SAP Press',
    badge: 'IN SUBMISSION · SAP PRESS',
    title: 'Intelligent Treasury & Payment Architecture on SAP',
    titleIsWorking: true,
    summary: 'A practitioner’s guide to next-generation SAP Treasury, banking and intelligent payment architecture: S/4HANA Treasury & Risk Management, Bank Communication Management, In-House Cash, ISO 20022 and the AI agents that are changing how treasury makes decisions.'
  },

  // ── Interactive demos. `page` is the detail route; `embed` (optional) is shown live inside the home-page modal. ──
  projects: [
    {id:'cash-sweep',page:'cash-sweep-agent.html',demoUrl:'cash-sweep-agent.html#demo',embed:'',title:'Cash Sweep Agent',showcaseTitle:'Put idle cash to work across entities, with treasury in control',category:'Liquidity intelligence',status:'In development · Concept & decision lab',repo:'',match:'cash[-_ ]?sweep|liquidity',
      before:'Cash sits idle in one entity while another draws on credit. Sweep rules are fixed, and multi-bank positions are pieced together by hand.',
      after:'Balances, expected receipts and payments, and liquidity buffers drive an explainable sweep proposal. Treasury approves it, and SAP S/4HANA executes it within existing controls.',
      problem:'Cash can accumulate in one entity while another needs funding. Fixed sweep rules may not reflect changing obligations and liquidity buffers.',approach:'A treasury decision-support concept using expected receipts, payments and liquidity needs to propose explainable intercompany cash movements.',value:'Intended to support working-capital decisions, with opportunities to evaluate borrowing costs, liquidity availability and operational effort.',controls:'Treasury reviews the recommendation and rationale. Payment execution stays within SAP approval workflows and established treasury controls.',evidence:'Whitepaper, presentation and recorded webinar. This is a development concept; illustrative examples are not measured client savings.',resource:'assets/ai-cash-sweeps.pdf',resourceLabel:'Explore the concept',
      tags:['SAP S/4HANA','Cash pooling','In-House Cash','AI decision support']},
    {id:'lockbox',page:'lockbox-agent.html',demoUrl:'lockbox-agent.html#demo',embed:'demos/lockbox/index.html',title:'Autonomous Lockbox Agent',showcaseTitle:'Clear unapplied cash without growing the exception queue',category:'Cash application · AI customer identification',status:'In development · Design & prototype',repo:'',resource:'demos/lockbox/index.html',resourceLabel:'Open illustrative workbench',match:'lockbox',
      before:'Payments arrive with partial payer and invoice detail. Analysts reconcile BAI2 lockbox files, remittance emails and SAP open items by hand, and the exception queue keeps growing.',
      after:'An agent reads remittance evidence from BAI2 and ISO 20022 data, identifies the customer, and proposes invoice matches with its reasoning. Ambiguous cases go to an analyst, and policy thresholds limit automated posting.',
      problem:'Cash arrives with incomplete payer and invoice information. Finance teams must reconcile fragmented bank files, remittances and SAP records.',approach:'A customer-identification and cash-application agent design that combines bank receipts, remittance evidence and SAP open items, with explicit exception routing.',value:'Designed to support more consistent matching decisions and reduce analyst investigation. Operational results have not yet been measured.',controls:'The design separates master-data changes, sends ambiguous matches to review, checks duplicates and limits automated posting through policy thresholds.',evidence:'Local design pack with 14 illustrative scenarios, architecture notes, guardrails and a workbench mockup. Confidence scores are illustrative; this is not a production deployment.',
      tags:['SAP S/4HANA','BAI2','ISO 20022','AI agents','SAP Joule']},
    {id:'roi',page:'roi-simulator.html',demoUrl:'roi-simulator.html#demo',embed:'demos/roi/index.html',title:'Treasury Transformation ROI Simulator',showcaseTitle:'Build the treasury business case in the room, not after it',category:'Executive business case',status:'Interactive prototype · Your assumptions',repo:'',match:'roi|business[-_ ]?case',
      before:'Treasury business cases sit in spreadsheets with hidden assumptions. Executives see one number, months after the workshop.',
      after:'Leaders adjust their own assumptions live and see the combined effect on working capital, bank fees and straight-through processing, along with payback.',
      problem:'Treasury transformation competes for investment against every other priority. Executives need a transparent view of where value comes from before committing budget.',approach:'An interactive calculator that models working-capital release from faster cash application, bank-fee rationalization and straight-through-processing gains, using the visitor’s own assumptions.',value:'Makes the value drivers and their sensitivities visible so leaders can discuss assumptions instead of a single headline figure.',controls:'Every output is derived from inputs shown on screen. Formulas are documented beside the results. Nothing is sent or stored.',evidence:'A working prototype with documented formulas and example assumptions. Results are illustrative estimates, not benchmarks or measured client outcomes.',resource:'demos/roi/index.html',resourceLabel:'Open the simulator in a full window',
      tags:['Business case','Working capital','Bank fees','STP','ISO 20022']}
  ],

  // ── Publications. Leave `url` empty to show "link coming soon". `minutes` adds a reading-time badge. ──
  publications: [
    {title:'The Future of Global Treasury: Building Intelligent Payment Architecture with SAP S/4HANA',label:'SAP COMMUNITY ARTICLE',description:'Payments are no longer the last step of a financial process. They sit where liquidity, connectivity, cybersecurity and compliance meet, and the architecture has to reflect that.',url:'https://community.sap.com/t5/welcome-corner-blog-posts/the-future-of-global-treasury-building-intelligent-payment-architecture/ba-p/14490732',minutes:null,action:'Read on SAP Community'},
    {title:'From Exception Queue to Intelligent Resolution: How SAP Joule Rewrites Treasury & AP Exception Handling',label:'SAP COMMUNITY ARTICLE',description:'How SAP Joule and the Accounts Payable Assistant change the way treasury and AP teams resolve payment exceptions: failed bank validations, mismatched invoices, possible duplicates and blocked payments.',url:'https://community.sap.com/t5/business-transformation-blog-posts/from-exception-queue-to-intelligent-resolution-how-sap-joule-rewrites/ba-p/14495233',minutes:null,action:'Read on SAP Community'},
    {title:'Who Paid This? Applying Cash with Confidence in SAP',label:'SAP COMMUNITY · IN EDITORIAL REVIEW',description:'Customer identification and cash application: how to know who paid, what they paid for and when it is safe to post automatically.',url:'',minutes:null,action:'Read on SAP Community',pending:'Publishing soon on SAP Community'},
    {title:'AI-Powered Cash Sweeps on SAP S/4HANA',label:'SAP COMMUNITY ARTICLE',description:'A treasury perspective on explainable cash movements, liquidity buffers and the role of human approval.',url:'https://community.sap.com/t5/financial-management-blog-posts-by-members/ai-powered-cash-sweeps-on-sap-s-4hana/ba-p/14510025',minutes:null,action:'Read on SAP Community'},
    {title:'Next-generation cross-border liquidity sweeps & treasury settlements',label:'WHITEPAPER',description:'Connecting liquidity decisions with SAP payment execution, enterprise architecture and treasury controls.',url:'assets/liquidity-whitepaper.pdf',minutes:null,action:'Read the whitepaper'},
    {title:'SAP Joule: treasury and payment use cases',label:'AI PERSPECTIVE',description:'Opportunities for decision support, exception handling and accountable AI in financial operations.',url:'assets/sap-joule-use-cases.pdf',minutes:null,action:'Explore the use cases'}
  ],

  // ── Video talks. Paste the 11-character YouTube ID (the part after watch?v=) into `youtubeId`. ──
  videoPlaylist: {title:'Executive Storytelling', url:'https://www.youtube.com/playlist?list=PLS2lt5lfmP3M'},
  videos: [
    {title:'Follow the Flow',label:'EXECUTIVE STORYTELLING',description:'A five-minute leadership story from the Executive Storytelling series.',youtubeId:'Yodq_M1Th8s'},
    {title:'Beyond the Breakpoint: A Leadership Story of Trust and Transformation',label:'EXECUTIVE STORYTELLING',description:'A speech connecting a personal breakthrough with the human challenges of enterprise transformation.',youtubeId:'xymf6fC_p8s'},
    {title:'How Leaders Compound',label:'EXECUTIVE STORYTELLING',description:'How everyday conversations, decisions and investment in people compound into lasting impact.',youtubeId:'LnsvHoBuK9g'},
    {title:'Corporate Madness: A Story of Chaos, Wit & Leadership',label:'EXECUTIVE STORYTELLING',description:'A story of chaos, wit and leadership inside the modern corporation.',youtubeId:'mri4Z8EoFFA'},
    {title:'The Art of Letting Go, The Courage to Begin',label:'LEADERSHIP LESSONS FROM AUTUMN',description:'Leadership lessons from autumn on letting go and having the courage to begin.',youtubeId:'VoczN1gFnPg'},
    {title:'A Break in the Clouds',label:'SHORT STORY',description:'A short story from the Executive Storytelling series.',youtubeId:'VSYt-Uh2-sQ'}
  ],

  speakingProposals: [
    {org:'AFP (Association for Financial Professionals)',status:'Speaking proposal submitted'}
  ],

  // ── Speaker kit (copy-to-clipboard and download on the Speaking page) ──
  speakerKit: {
    shortBio:'Jyoti Narang is a Managing Solution Architect and Global SAP Treasury & Banking Transformation Lead with 22 years of experience in SAP S/4HANA Finance, Treasury & Risk Management, Bank Communication Management, In-House Cash and ISO 20022 payments. Jyoti has led transformations spanning 70+ legal entities for multinational enterprises in life sciences, medical technology and energy. Alongside client work, Jyoti builds working AI agents for treasury on SAP BTP and SAP Joule, writes for SAP Community and has submitted a book proposal on intelligent treasury and payment architecture to SAP Press. Jyoti is an active Toastmasters speaker.',
    longBio:'Jyoti Narang is a Managing Solution Architect and Global SAP Treasury & Banking Transformation Lead who helps multinational enterprises turn treasury from a back-office function into a source of real-time decisions.\n\nOver 22 years, Jyoti has led SAP S/4HANA Finance, Treasury & Risk Management, Bank Communication Management, In-House Cash and ISO 20022 programs across 70+ legal entities, including global banking modernization in life sciences, finance transformation through a medical-technology divestiture, and an integrated treasury and cash-management landscape for a global energy company. The career path runs from product ownership at SAP Labs to IBM and Capgemini, spanning North America, EMEA, APAC and LATAM.\n\nToday Jyoti works where treasury meets enterprise AI. Jyoti designs and builds working prototypes, including an autonomous lockbox and customer-identification agent, an AI-assisted cash sweep engine and a treasury transformation ROI simulator, on clean-core principles with SAP BTP and SAP Joule. The guiding principle: AI proposes, SAP executes, and treasury remains in control.\n\nJyoti writes on intelligent payment architecture and AI-driven cash application for SAP Community, and has submitted a book proposal to SAP Press on next-generation SAP Treasury, banking and payment architecture. A committed Toastmasters member, Jyoti speaks on treasury innovation and the human side of transformation, making complex architecture clear enough for executives to act on.\n\nJyoti holds an MBA in Finance and a B.Tech in Electrical Engineering.',
    topics:[
      {title:'The Intelligent Payment Revolution: From Execution to Decision Intelligence',audience:'Treasury leaders · CFO organizations · SAP architects',takeaways:['How Bank Communication Management, In-House Cash and ISO 20022 combine into a payment architecture that informs decisions, not just executes them.','Where risk-based controls and AI-assisted exception management fit without weakening segregation of duties.','A practical roadmap from fragmented bank connectivity to a governed global payment hub.']},
      {title:'From Exception Queue to Intelligent Resolution: AI Agents for Cash Application',audience:'Order-to-cash leaders · Shared services · Finance operations',takeaways:['Why unapplied cash persists even after lockbox and BAI2 automation, and what the remaining exceptions have in common.','How an agent combines remittance evidence, ISO 20022 data and SAP open items into explainable match proposals.','The guardrails that matter: confidence thresholds, review routing, duplicate checks and audit trails.']},
      {title:'AI Proposes. SAP Executes. Treasury Stays in Control.',audience:'CIOs · CFOs · Transformation and architecture leaders',takeaways:['A clean-core pattern for building AI on SAP BTP and Joule without modifying the digital core.','How to define decision rights, approvals and evidence so auditors and treasurers trust AI recommendations.','How to choose the first use cases and build a transparent business case leaders will fund.']}
    ]
  },

  speeches: [
    {title:'How Leaders Compound',theme:'People development · Trust · Daily decisions',description:'How everyday conversations, decisions and investment in people compound into lasting leadership impact.',url:'assets/speeches/how-leaders-compound.docx'},
    {title:'Conviction Before Compliance',theme:'Change leadership · Influence · Adoption',description:'A transformation leadership narrative about moving from mandatory controls to understanding and belief.',url:'assets/speeches/conviction-before-compliance.docx'},
    {title:'Beyond the Breakpoint',theme:'Resilience · Transformation · Personal growth',description:'A speech connecting a personal breakthrough with the human challenges of enterprise transformation.',url:'assets/speeches/beyond-the-breakpoint.docx'}
  ],
  community: [
    {title:'OpenClaw & community show-and-tell',label:'COMMUNITY PRACTICE',description:'A home for my agent walkthroughs, experiments and lessons shared with OpenClaw and other communities. Session details and recordings will be added as they become available.',url:'',action:''}
  ]
};
