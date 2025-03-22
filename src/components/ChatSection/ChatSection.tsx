import { useState, useEffect, useRef, JSX } from "react";
import logo from '../../assets/github-copilot-icon.png';
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from "react-spinners";
import Templates from "../Templates/Templates";
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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
            { text: "Chat with Agent", next: "ask-questions" }
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


type Message = {
    id: string;
    role: "user" | "bot";
    text: string;
    options?: { text: string; next: string }[]; // Optional buttons
};
type ChatSession = {
    id: string;
    label: string;
    messages: Message[];
    completed?: boolean; // Track if guided steps are finished
};
interface ComponentProps {
    activeTab: "Tab1" | "Tab2" | "Tab3" | "Tab4";
    activeChatId: string | null;
    chats: ChatSession[];
    setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>;
    setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
    isToggled: boolean;
    [key: string]: any;
}
// interface TrackingEvent {
//     type: string;
//     data: any;
// }
const ChatSection: React.FC<ComponentProps> = ({ chats, activeChatId, setChats, setActiveChatId, isToggled }) => {
    const activeChat = chats.find(chat => chat.id === activeChatId);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = useState(false);
    useEffect(() => {
        const checkScroll = () => {
            if (chatContainerRef.current) {
                setHasScroll(chatContainerRef.current.scrollHeight > chatContainerRef.current.clientHeight);
            }
        };

        checkScroll(); // Check on mount
        window.addEventListener("resize", checkScroll); // Check when window resizes

        return () => window.removeEventListener("resize", checkScroll);
    }, [activeChat?.messages]);
    // const [chatSectionLoaded, setChatSectionLoaded] = useState(false);
    // const [events, setEvents] = useState<TrackingEvent[]>([]);
    // const SCREENSHOT_DELAY = 4000;
    const activeChatIdRef = useRef<string | null>(activeChatId);
    const generateChatId = (): string => {
        return `chat-${Date.now()}`; // Use timestamp for uniqueness
    };

    const generateChatName = (message: string): string => {
        return message.substring(0, 20); // Use the first 20 characters of the message as the name
    };
    async function sendScreenShot() {
        // Ensure there's an active chat
        if (!activeChatIdRef.current) {
            console.error("No active chat selected");
            return;
        }

        //console.log(chats, 'chats');
        //console.log(activeChatIdRef.current, 'activeChatIdRef.current');
        // Get the active chat
        const activeChat = chats.find(chat => chat.id === activeChatIdRef.current);
        console.log(activeChat, 'activeChat');

        const history: { role: "user" | "bot"; text: string | JSX.Element }[] =
            activeChat?.messages.slice(-20).map(msg => ({ role: msg.role, text: msg.text })) || [];



        try {
            setIsLoading(true);
            chrome.runtime.sendMessage(
                { type: "CAPTURE_SCREENSHOT" },
                async (response: { screenshot?: string } | undefined) => {
                    // If this is a new chat, assign a proper ID and name
                    if (activeChatIdRef.current === "new-chat") {
                        const newChatId = generateChatId(); // Generate a unique ID
                        const newChatName = generateChatName(`event-${Date.now()}`); // Generate a unique name

                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === "new-chat"
                                    ? {
                                        ...chat,
                                        id: newChatId,
                                        label: newChatName,
                                        completed: true // Ensure completed is always true
                                    }
                                    : chat
                            )
                        );

                        // Update active chat references
                        setActiveChatId(newChatId);
                        activeChatIdRef.current = newChatId;
                    }

                    try {
                        const res: Response = await fetch("https://n8n.alsoknownas.me/webhook/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: "This is Auto Sent Screenshot with DOM Monitoring",
                                screenshot: response?.screenshot || null,
                                history
                            }),
                        });

                        //console.log("Response status:", res.status); // Log the status
                        //console.log("Response OK:", res.ok); // Log if the response is OK

                        if (!res.ok) {
                            if (res.status === 404) {
                                console.error("Webhook not found. Make sure the workflow is active in n8n.");
                            }
                            throw new Error(`Server responded with status ${res.status}`);
                        }

                        const textData: string = await res.text();
                        //console.log("Bot response:", textData); // Log the bot's response

                        // Add bot response to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages array exists
                                            { id: `msg-${Date.now()}`, role: "bot", text: textData } // Add a unique ID
                                        ]
                                    }
                                    : chat
                            )
                        );

                    } catch (error: unknown) {
                        console.error("Error fetching bot response:", error); // Log any errors
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages array exists
                                            { id: `msg-${Date.now()}`, role: "bot", text: "Error: Unable to get response from server." }
                                        ]
                                    }
                                    : chat
                            )
                        );

                    } finally {
                        setIsLoading(false); // Stop loading
                    }
                }
            );
        } catch (error: unknown) {
            console.error("Error capturing screenshot:", error);
            setIsLoading(false); // Stop loading
        }
    }
    const SCREENSHOT_DELAY = 3000; // 2 seconds delay

    useEffect(() => {
        let canTakeScreenshot = true; // Prevent multiple screenshots

        const handleMessage = async (message: any) => {
            if (
                message.source === "n8n-injected" &&
                (message.type === "CLICK" || message.type === "URL_CHANGE")
            ) {
                if (isLoading || !canTakeScreenshot || !isToggled) {
                    return; // Ignore if loading, already taking a screenshot, or isToggled is false
                }

                canTakeScreenshot = false; // Block additional screenshots temporarily

                setTimeout(async () => {
                    await sendScreenShot();
                    canTakeScreenshot = true; // Re-enable screenshots
                }, SCREENSHOT_DELAY);
            }
        };

        // ✅ Add the listener when component mounts or isToggled changes
        chrome.runtime.onMessage.addListener(handleMessage);

        // ✅ Clean up the listener when the component unmounts or isToggled changes
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, [isLoading, isToggled]); // ✅ Re-run effect when isToggled changes
    // Reacts to isLoading changes
    //console.log(events, 'events')
    const startNewChat = (): void => {
        const newChat: ChatSession = {
            id: "new-chat", // Generate a unique chat ID
            label: "new-chat",
            messages: [
                {
                    id: "msg-1",
                    role: "bot",
                    text: "What’s your starting point?",
                    options: [
                        { text: "I already have n8n hosted", next: "existing-n8n" },
                        { text: "I need to set up n8n", next: "no-n8n" },
                        { text: "Chat with Agent", next: "ask-questions" }
                    ]
                }
            ],
            completed: false, // This means the user still needs to complete the guided steps
        };

        setChats(prevChats => [...prevChats, newChat]);
        setActiveChatId(newChat.id);
    };
    const handleUserSelection = (chatId: string, selectedOption: string) => {
        if (!activeChat?.completed) {
            setChats(prevChats =>
                prevChats.map(chat => {
                    if (chat.id !== chatId) return chat;

                    const updatedMessages = [...chat.messages];

                    // Add user selection as a message
                    updatedMessages.push({
                        id: `msg-${Date.now()}`,
                        role: "user",
                        text: selectedOption,
                    });

                    // Find the current step in automationSteps
                    const currentStep = automationSteps.find(step =>
                        step.options?.some(opt => opt.text === selectedOption)
                    );

                    // Get the `next` step ID from the selected option
                    const nextStepId = currentStep?.options?.find(opt => opt.text === selectedOption)?.next;
                    const nextStep = automationSteps.find(step => step.id === nextStepId);

                    if (nextStep) {
                        updatedMessages.push({
                            id: `msg-${Date.now()}`,
                            role: "bot",
                            text: nextStep.message, // 🔹 FIX: Using `message` instead of `text`
                            options: nextStep.options, // ✅ Keep options as an array of { text, next }
                        });
                    } else {
                        chat.completed = true; // ✅ Mark chat as completed if no next step
                    }

                    return { ...chat, messages: updatedMessages };
                })
            );
        }
    };





    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    // useEffect(() => {
    //     if (!chatSectionLoaded && !activeChatId) {
    //         startNewChat();
    //         setChatSectionLoaded(true)
    //     }
    // }, [])


    // Keep the ref in sync with the state
    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);
    const sendMessage = async (): Promise<void> => {
        if (!message.trim()) {
            console.error("Message is empty");
            return;
        }

        // Ensure there's an active chat
        if (!activeChatIdRef.current) {
            console.error("No active chat selected");
            return;
        }

        // Get the active chat
        const activeChat = chats.find(chat => chat.id === activeChatIdRef.current);
        if (!activeChat) {
            console.error("Active chat not found");
            return;
        }

        // Prepare history from the active chat's messages
        const history: { role: "user" | "bot"; text: string | JSX.Element }[] =
            activeChat?.messages.slice(-20).map(msg => ({ role: msg.role, text: msg.text })) || [];

        try {
            // Start loading
            setIsLoading(true);

            chrome.runtime.sendMessage(
                { type: "CAPTURE_SCREENSHOT" },
                async (response: { screenshot?: string } | undefined) => {
                    // If this is a new chat, assign a proper ID and name
                    if (activeChatIdRef.current === "new-chat") {
                        const newChatId = generateChatId(); // Generate a unique ID
                        const newChatName = generateChatName(`event-${Date.now()}`); // Generate a unique name

                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === "new-chat"
                                    ? {
                                        ...chat,
                                        id: newChatId,
                                        label: newChatName,
                                        completed: true, // Ensure completed is always true
                                        messages: [
                                            ...(chat.messages ?? []), // Retain any initial messages
                                            { id: `msg-${Date.now()}`, role: "user", text: message } // ✅ Add user's first message
                                        ]
                                    }
                                    : chat
                            )
                        );

                        // Update active chat references
                        setActiveChatId(newChatId);
                        activeChatIdRef.current = newChatId;
                    } else {
                        // Add user message to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages array exists
                                            { id: `msg-${Date.now()}`, role: "user", text: message } // ✅ Add user's message
                                        ]
                                    }
                                    : chat
                            )
                        );
                    }


                    try {
                        const res: Response = await fetch("https://n8n.alsoknownas.me/webhook/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message,
                                screenshot: response?.screenshot || null,
                                history
                            }),
                        });

                        //console.log("Response status:", res.status); // Log the status
                        //console.log("Response OK:", res.ok); // Log if the response is OK

                        if (!res.ok) {
                            if (res.status === 404) {
                                console.error("Webhook not found. Make sure the workflow is active in n8n.");
                            }
                            throw new Error(`Server responded with status ${res.status}`);
                        }

                        const textData: string = await res.text();
                        //console.log("Bot response:", textData); // Log the bot's response

                        // Add bot response to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages exist
                                            { id: `msg-${Date.now()}`, role: "bot" as "bot", text: textData } // Explicitly define role as "bot"
                                        ]
                                    }
                                    : chat
                            )
                        );
                    } catch (error: unknown) {
                        console.error("Error fetching bot response:", error); // Log any errors
                        // Add error message to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages exist
                                            { id: `msg-${Date.now()}`, role: "bot", text: "Error: Unable to get response from server." } // Add a unique ID
                                        ]
                                    } : chat
                            )
                        )
                    } finally {
                        setIsLoading(false); // Stop loading
                    }
                }
            );
        } catch (error: unknown) {
            console.error("Error capturing screenshot:", error);
            setIsLoading(false); // Stop loading
        }
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    // const markdownContainerStyle = {
    //     width: '100%',
    //     maxWidth: '600px',
    //     border: '1px solid #ddd',
    //     borderRadius: '5px',
    //     padding: '10px',
    //     overflow: 'hidden'
    // };

    const textStyle = {
        OverflowX: 'auto',
        WhiteSpace: 'pre-wrap',
        WordWrap: 'break-word',
        maxWidth: '100%',
        lineHeight: '1rem'
    };

    const codeStyle = {
        OverflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word' as 'break-word',
        maxWidth: '100%',
        // backgroundColor: '#f5f5f5', // Optional: Better visibility for code blocks
        padding: '4px',
        borderRadius: '4px',
        lineHeight: '1rem'
    };
    const listItemStyle = {
        whiteSpace: 'pre-wrap',
        WordWrap: 'break-word',
        OverflowWrap: 'break-word',
        maxWidth: '100%',
    };
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#303030",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minHeight: "40px",
                    color: "white"
                }}
            >
                <p style={{ marginLeft: "10px" }}>
                    {chats.find(chat => chat.id === activeChatIdRef.current)
                        ? chats.find((chat) => chat.id === activeChatId)?.label
                        : "No Active Chat"}
                </p>
                <button
                    onClick={startNewChat} // Trigger the new chat function
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        margin: "5px 5px",
                        transition: "background-color 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#212121")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                    title="Start a new chat"
                >
                    New Chat
                </button>
            </div>
            <div ref={chatContainerRef} style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {activeChat?.messages?.length ?? 0 > 0 ? (
                    activeChat?.messages.map((msg) => (
                        <div key={msg.id} style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.role === "user" ? "black" : "#303030",
                            color: "white",
                            padding: "10px",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            marginBottom: "5px",
                            marginRight: hasScroll ? (msg.role === "user" ? "10px" : "0") : "0"
                        }}>
                            {typeof msg.text === "string" ?
                                <ReactMarkdown
                                    components={{
                                        code: ({ node, ...props }) => (
                                            <code style={codeStyle} {...props} />
                                        ),
                                        pre: ({ node, ...props }) => (
                                            <pre style={codeStyle} {...props} />
                                        ),
                                        p: ({ node, ...props }) => ( // ✅ Apply text wrapping to normal text
                                            <p style={textStyle} {...props} />
                                        ),
                                        span: ({ node, ...props }) => ( // ✅ Ensure inline text doesn't overflow
                                            <span style={textStyle} {...props} />
                                        ),
                                        li: ({ node, ...props }) => ( // ✅ Apply wrapping styles to <li>
                                            <li style={listItemStyle} {...props} />
                                        )
                                    }}
                                >{msg.text}</ReactMarkdown> : msg.text
                            }

                            {/* Render options inside chat bubble */}
                            {msg.options && msg.role === "bot" && (
                                <div style={{ marginTop: "10px" }}>
                                    {msg.options.map((option) => (
                                        <button
                                            key={option.text}
                                            onClick={() => handleUserSelection(activeChat.id, option.text)}
                                            disabled={activeChat.completed}
                                            style={{
                                                background: activeChat.completed ? "#ddd" : "white", // Gray out if disabled
                                                color: activeChat.completed ? "#888" : "black", // Dim text color if disabled
                                                padding: "8px",
                                                borderRadius: "5px",
                                                marginTop: "5px",
                                                border: "none",
                                                cursor: activeChat.completed ? "not-allowed" : "pointer", // Show "not-allowed" cursor when disabled
                                                display: "block", // Each button takes a new line
                                                width: "100%", // Optional: Makes buttons full-width
                                                opacity: activeChat.completed ? 0.6 : 1, // Reduce opacity when disabled
                                            }}
                                        >
                                            {option.text}
                                        </button>

                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (!isLoading && !activeChatIdRef.current) && (
                    <div>
                        <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
                            <img src={logo} alt="Copilot" style={{ maxWidth: "100px", marginBottom: "-15px" }} />
                            <p>n8n Copilot your Ai companion</p>
                        </div>
                        <Templates />
                    </div>
                )}

                {isLoading && (
                    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <BeatLoader
                            color={"grey"}
                            size={10}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* Message Field */}
            {chats.find(chat => chat.id === activeChatIdRef.current) && <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                border: "2px solid #303030",
                backgroundColor: "#303030",
                borderRadius: "1.5rem",
            }}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything"
                    style={{
                        width: "100%",
                        resize: "none",
                        height: "40px",
                        overflowY: "auto",
                        outline: "none",
                        border: "none",
                        background: "none",
                        color: "white",
                    }}
                />
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px"
                }}>
                    <div>
                        <button style={{ background: "none", border: "none", cursor: "pointer", marginRight: "2px", color: "white" }}>
                            <IoImageOutline style={{ width: "24px", height: "24px" }} />
                        </button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
                            <MdOutlineKeyboardVoice style={{ width: "24px", height: "24px" }} />
                        </button>
                    </div>
                    <button onClick={sendMessage} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
                        <LuSendHorizontal style={{ width: "24px", height: "24px" }} />
                    </button>
                </div>
            </div>}
        </>
    );
};

export default ChatSection;
