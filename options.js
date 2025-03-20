const automationSteps = [
    {
        id: "initial",
        message: "What’s your starting point?",
        options: [
            { text: "I already have n8n hosted or in cloud", next: "existing-n8n"
            },
            { text: "I don't have setup yet", next: "no-n8n"
            }
        ]
    },
    {
        id: "existing-n8n",
        message: "Let’s start with building something smart.",
        options: [
            { text: "Pick from predefined workflows", next: "workflow-selection"
            },
            { text: "Ask me questions", next: "ask-questions"
            }
        ]
    },
    {
        id: "no-n8n",
        message: "Let's build something together quickly and for free (your first automation is on us).",
        next: "workflow-selection"
    },
    {
        id: "workflow-selection",
        message: "What is your most urgent need?",
        options: [
            { text: "More leads", next: "build-automation"
            },
            { text: "More traffic", next: "build-automation"
            },
            { text: "Less costs", next: "build-automation"
            },
            { text: "Better sales alignment", next: "build-automation"
            }
        ]
    },
    {
        id: "build-automation",
        message: "Let's configure your automation.",
        steps: [
            "CRM: <HubSpot> <Pipedrive> <Other> <I don’t have one>",
            "Data Provider: 'Shall we use Dataprovider X for Z? (Cost: Y)'",
            "Data Management: 'Use Airtable or set up NoCodeDB (recommended)?'",
            "✅ Step 1: Setup API trigger (Guide to get API keys)",
            "✅ Step 2: Configure the prompt (Use predefined structure)",
            "✅ Step 3: Test the workflow",
            "✅ Step 4: Finalize & launch"
        ],
        options: [
            { text: "Finish Setup", next: "chat-mode"
            }
        ]
    },
    {
        id: "chat-mode",
        message: "Your automation is live! Need help with something else?",
        options: [
            { text: "Start a new automation", next: "initial"
            },
            { text: "Ask a question", next: "ask-question"
            }
        ]
    }
];