const automationSteps = [
    {
        id: "initial",
        message: "Welcome to the n8n Copilot! What's your current n8n status?",
        options: [
            { text: "I already have n8n hosted", next: "existing-n8n" },
            { text: "I need to set up n8n", next: "no-n8n" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "existing-n8n",
        message: "Great! Let's help you get the most out of your n8n instance.",
        options: [
            { text: "Explore predefined workflows", next: "workflow-categories" },
            { text: "Build a custom solution", next: "custom-solution" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "no-n8n",
        message: "Let's get you set up with n8n quickly and efficiently.",
        options: [
            { text: "View hosting options", next: "setup-n8n" }
        ]
    },
    {
        id: "setup-n8n",
        message: "Choose your preferred n8n hosting option:",
        options: [
            { text: "Elestio (Recommended for teams)", next: "ask-questions" },
            { text: "n8n Cloud (Easiest setup)", next: "ask-questions" },
            { text: "Self-hosted (Most control)", next: "ask-questions" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "workflow-categories",
        message: "What's your goal with automation?",
        options: [
            { text: "Data Enrichment", next: "data-enrichment-workflows" },
            { text: "Content Creation", next: "content-creation-workflows" },
            { text: "Online Marketing", next: "online-marketing-workflows" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "data-enrichment-workflows",
        message: "Here are our recommended Data Enrichment templates:",
        options: [
            { text: "LinkedIn Data Enrichment (Waterfall)", next: "linkedin-enrichment-build" },
            { text: "AI Research (Not available in databases)", next: "ai-research-build" },
            { text: "Account Research (Not people)", next: "account-research-build" },
            { text: "LinkedIn-level Targeting in Other Channels", next: "linkedin-targeting-build" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "content-creation-workflows",
        message: "Here are our recommended Content Creation templates:",
        options: [
            { text: "Newsletter Strategist Agent", next: "newsletter-agent-build" },
            { text: "LinkedIn Posts Agent", next: "linkedin-posts-build" },
            { text: "Personalized White Paper", next: "white-paper-build" },
            { text: "AI-infused SEO", next: "ai-seo-build" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "online-marketing-workflows",
        message: "Here are our recommended Online Marketing templates:",
        options: [
            { text: "Analytics", next: "analytics-build" },
            { text: "Demand Generation", next: "demand-gen-build" },
            { text: "Account-based Marketing", next: "abm-build" },
            { text: "Demand Capture", next: "demand-capture-build" },
            { text: "Demand Conversion (Sales)", next: "demand-conversion-build" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "custom-solution",
        message: "What is your most urgent business need?",
        options: [
            { text: "Generate more leads", next: "leads-solution-build" },
            { text: "Increase website traffic", next: "traffic-solution-build" },
            { text: "Reduce operational costs", next: "cost-solution-build" },
            { text: "Improve sales and marketing alignment", next: "alignment-solution-build" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },

    // Data Enrichment Workflow Build Steps
    {
        id: "linkedin-enrichment-build",
        message: "LinkedIn Data Enrichment (Waterfall) Workflow Setup:",
        steps: [
            "LinkedIn API Connection: Set up LinkedIn authentication",
            "Target Audience Definition: Configure your target criteria",
            "Data Enrichment Nodes: Configure enrichment data points",
            "✅ Step 1: Connect to LinkedIn API (Guide for API access)",
            "✅ Step 2: Set up data filtering parameters",
            "✅ Step 3: Configure waterfall enrichment sequence",
            "✅ Step 4: Set up data storage destination"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "ai-research-build",
        message: "AI Research Workflow Setup:",
        steps: [
            "Research Parameters: Define your research scope and questions",
            "AI Provider Selection: <OpenAI> <Anthropic> <Other>",
            "Research Output Format: <Structured> <Narrative> <Mixed>",
            "✅ Step 1: Set up AI provider connections",
            "✅ Step 2: Configure research prompt templates",
            "✅ Step 3: Set up response filtering and validation",
            "✅ Step 4: Configure output formatting and storage"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "account-research-build",
        message: "Account Research Workflow Setup:",
        steps: [
            "Target Account List: Upload or API source configuration",
            "Research Parameters: Define key data points to gather",
            "Data Sources: <Company DB> <News API> <Social Media> <Financial Data>",
            "✅ Step 1: Set up account list import mechanism",
            "✅ Step 2: Configure data source connections",
            "✅ Step 3: Set up data aggregation and normalization",
            "✅ Step 4: Configure output format and destination"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "linkedin-targeting-build",
        message: "LinkedIn-level Targeting Workflow Setup:",
        steps: [
            "LinkedIn Data Export: Configure data source and parameters",
            "Target Platform Selection: <Facebook> <Twitter> <Email> <Display Ads>",
            "Audience Mapping Configuration: Set up attribute matching",
            "✅ Step 1: Set up LinkedIn data extraction/export",
            "✅ Step 2: Configure audience matching parameters",
            "✅ Step 3: Set up target platform integration",
            "✅ Step 4: Establish audience sync schedule"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },

    // Content Creation Workflow Build Steps
    {
        id: "newsletter-agent-build",
        message: "Newsletter Strategist Agent Workflow Setup:",
        steps: [
            "Content Sources: <RSS Feeds> <Social Media> <Industry News> <Custom>",
            "Newsletter Style: <Curated> <Original> <Mixed>",
            "Distribution Platform: <Email Service> <CMS> <Social Media>",
            "✅ Step 1: Set up content source connections",
            "✅ Step 2: Configure AI content curation parameters",
            "✅ Step 3: Set up newsletter template and formatting",
            "✅ Step 4: Configure distribution mechanism"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "linkedin-posts-build",
        message: "LinkedIn Posts Agent Workflow Setup:",
        steps: [
            "Content Strategy: <Thought Leadership> <Industry News> <Company Updates>",
            "Post Frequency: <Daily> <Weekly> <Custom Schedule>",
            "Engagement Configuration: Auto-responses to comments",
            "✅ Step 1: Set up LinkedIn authentication",
            "✅ Step 2: Configure post templates and AI parameters",
            "✅ Step 3: Set up posting schedule and approval workflow",
            "✅ Step 4: Configure engagement monitoring and response logic"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "white-paper-build",
        message: "Personalized White Paper Workflow Setup:",
        steps: [
            "White Paper Template: <Technical> <Educational> <Solution Brief>",
            "Personalization Parameters: Define dynamic content sections",
            "Lead Data Integration: CRM or form data mapping",
            "✅ Step 1: Upload white paper template or structure",
            "✅ Step 2: Configure personalization variables and logic",
            "✅ Step 3: Set up lead data integration flow",
            "✅ Step 4: Configure delivery mechanism and tracking"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "ai-seo-build",
        message: "AI-infused SEO Workflow Setup:",
        steps: [
            "Website Integration: <WordPress> <Custom CMS> <Static Site>",
            "SEO Strategy: <Keywords> <Content Gaps> <Competitive Analysis>",
            "Content Enhancement: <Meta Data> <Full Content> <Schema Markup>",
            "✅ Step 1: Set up website content access",
            "✅ Step 2: Configure SEO analysis parameters",
            "✅ Step 3: Set up AI content enhancement rules",
            "✅ Step 4: Establish implementation workflow and validation"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },

    // Online Marketing Workflow Build Steps
    {
        id: "analytics-build",
        message: "Analytics Workflow Setup:",
        steps: [
            "Data Sources: <Google Analytics> <CRM> <Marketing Automation> <Custom>",
            "Dashboard Configuration: Define key metrics and visualizations",
            "Reporting Schedule: <Daily> <Weekly> <Monthly> <Custom>",
            "✅ Step 1: Connect data source APIs",
            "✅ Step 2: Configure data transformation rules",
            "✅ Step 3: Set up dashboard layout and components",
            "✅ Step 4: Establish alert thresholds and notification system"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "demand-gen-build",
        message: "Demand Generation Workflow Setup:",
        steps: [
            "Target Audience: Define segments and parameters",
            "Campaign Channels: <Email> <Social> <Content> <Paid Media>",
            "Lead Qualification: Define scoring criteria and thresholds",
            "✅ Step 1: Set up audience segmentation rules",
            "✅ Step 2: Configure multi-channel campaign orchestration",
            "✅ Step 3: Establish lead scoring and qualification logic",
            "✅ Step 4: Set up performance tracking and optimization"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "abm-build",
        message: "Account-based Marketing Workflow Setup:",
        steps: [
            "Target Account List: Upload or define selection criteria",
            "Account Research: Configure automated intelligence gathering",
            "Personalization Strategy: <Content> <Outreach> <Website> <All>",
            "✅ Step 1: Set up target account identification",
            "✅ Step 2: Configure account research automation",
            "✅ Step 3: Establish personalization logic and templates",
            "✅ Step 4: Set up engagement tracking and orchestration"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "demand-capture-build",
        message: "Demand Capture Workflow Setup:",
        steps: [
            "Lead Sources: <Website> <Events> <Partners> <Advertising>",
            "Capture Methods: <Forms> <Chatbots> <Direct Integrations>",
            "Enrichment Process: Configure automated data enhancement",
            "✅ Step 1: Set up lead capture mechanisms",
            "✅ Step 2: Configure data validation and normalization",
            "✅ Step 3: Establish lead enrichment process",
            "✅ Step 4: Set up routing and notification system"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "demand-conversion-build",
        message: "Demand Conversion (Sales) Workflow Setup:",
        steps: [
            "CRM Integration: <Salesforce> <HubSpot> <Pipedrive> <Other>",
            "Sales Process Mapping: Define stages and transition criteria",
            "Automation Triggers: <Stage Changes> <Activity Levels> <Time-based>",
            "✅ Step 1: Set up CRM connection and data mapping",
            "✅ Step 2: Configure sales process automation rules",
            "✅ Step 3: Establish follow-up and engagement sequences",
            "✅ Step 4: Set up performance tracking and analytics"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },

    // Custom Solution Build Steps
    {
        id: "leads-solution-build",
        message: "Lead Generation Solution Setup:",
        steps: [
            "Lead Sources Configuration: Define primary acquisition channels",
            "Lead Quality Parameters: Set qualification criteria",
            "Integration Points: <CRM> <Marketing Automation> <Sales Tools>",
            "✅ Step 1: Configure lead source connections",
            "✅ Step 2: Set up lead qualification rules",
            "✅ Step 3: Establish enrichment and scoring logic",
            "✅ Step 4: Configure routing and notification workflow"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "traffic-solution-build",
        message: "Website Traffic Solution Setup:",
        steps: [
            "Traffic Sources: <Organic> <Social> <Paid> <Referral>",
            "Content Strategy: Configuration for traffic optimization",
            "Conversion Focus: <Form Fills> <Downloads> <Purchases>",
            "✅ Step 1: Set up traffic source tracking",
            "✅ Step 2: Configure content optimization workflow",
            "✅ Step 3: Establish conversion path automation",
            "✅ Step 4: Set up performance reporting and alerts"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "cost-solution-build",
        message: "Cost Reduction Solution Setup:",
        steps: [
            "Process Mapping: Identify automation opportunities",
            "ROI Calculation: Configure savings tracking",
            "Implementation Priority: <Quick Wins> <High Impact> <Low Effort>",
            "✅ Step 1: Set up process automation workflows",
            "✅ Step 2: Configure resource utilization tracking",
            "✅ Step 3: Establish cost monitoring dashboards",
            "✅ Step 4: Set up ongoing optimization recommendations"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },
    {
        id: "alignment-solution-build",
        message: "Sales & Marketing Alignment Solution Setup:",
        steps: [
            "Data Integration: <CRM> <Marketing Automation> <Analytics>",
            "SLA Configuration: Define handoff criteria and timing",
            "Feedback Loop: Configure automated communication channels",
            "✅ Step 1: Set up cross-functional data integration",
            "✅ Step 2: Configure lead qualification and routing rules",
            "✅ Step 3: Establish SLA monitoring and alerts",
            "✅ Step 4: Set up performance dashboards and reporting"
        ],
        options: [
            { text: "Complete Setup", next: "chat-mode" },
            { text: "I Need Help", next: "ask-questions" }
        ]
    },

    {
        id: "chat-mode",
        message: "Your automation workflow is now configured! How else can I assist you today?",
        options: [
            { text: "Create another automation", next: "initial" },
            { text: "Optimize existing workflow", next: "ask-questions" },
            { text: "Chat with Agent", next: "ask-questions" }
        ]
    },
    {
        id: "ask-questions",
        message: "I'm here to help with any n8n questions or challenges. What would you like to know?",
        // This is the endpoint for free-form conversation with the agent
        chatMode: true
    }
];
