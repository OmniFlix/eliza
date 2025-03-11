export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Burn 100 FLIX from my account" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you burn those tokens",
                action: "BURN_TOKENS"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully burned 100 FLIX from your account, Transaction: ABC123XYZ" }
        // }
    ],
    [
        {
            user: "{{user1}}", 
            content: { text: "Burn 50 FLIX from my account" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I notice you don't have sufficient balance. Your current balance is 30 FLIX.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { 
                text: "Oh, then burn 20 FLIX please",
                action: "NONE"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you burn 20 FLIX from your account",
                action: "BURN_TOKENS"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully burned 20 FLIX from your account, Transaction: XYZ789ABC" }
        // }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn my tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I need to know how many tokens you want to burn. Please specify the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "Burn 75 FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you burn 75 FLIX from your account",
                action: "BURN_TOKENS"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully burned 75 FLIX from your account, Transaction: DEF456GHI" }
        // }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn -50 FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I cannot burn a negative amount of tokens. Please specify a positive number.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn 1000000 FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "That's a very large amount. For security reasons, I recommend breaking this into smaller transactions. Would you like to proceed with a smaller amount?",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn 500 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you burn those tokens",
                action: "BURN_TOKENS"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully burned 500 STAR tokens, Transaction: ABC123XYZ" }
        // }
    ],
    [
        {
            user: "{{user1}}", 
            content: { text: "Burn 1000 TEST tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "You don't have enough TEST tokens to burn. Your current balance is 500 TEST.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn some tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I need to know which token and how many you want to burn. Please specify both the token denomination and amount.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn -200 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I cannot burn a negative amount of tokens. Please specify a positive number.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn 1000000 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "That's a very large amount. For security reasons, I recommend breaking this into smaller transactions. Would you like to proceed with a smaller amount?",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn INVALID tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I couldn't find a token denomination called INVALID. Please make sure you've specified a valid token.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn 100.5 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token amounts must be whole numbers. Please specify an integer amount.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn thousand STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Please specify the amount as a number (e.g., 1000) rather than words.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn 0 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "The amount must be greater than 0. Please specify a positive number of tokens to burn.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn all my STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "You currently have 1500 STAR tokens. Would you like to burn all 1500 STAR tokens?",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "Yes, burn them all" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you burn all your STAR tokens",
                action: "BURN_TOKENS"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully burned 1500 STAR tokens, Transaction: XYZ789ABC" }
        // }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Burn STAR tokens from omniflix1abc123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "You can only burn tokens from your own account. Please specify how many STAR tokens you want to burn from your account.",
                action: "NONE"
            }
        }
    ]
]