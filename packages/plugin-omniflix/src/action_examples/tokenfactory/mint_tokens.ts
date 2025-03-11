export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Mint 1000 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you mint 1000 STAR tokens",
                action: "MINT_TOKEN_FACTORY_TOKENS"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully minted 1000 STAR tokens, Transaction: ABC123XYZ" }
        // }
    ],
    [
        {
            user: "{{user1}}", 
            content: { text: "Mint 500 TEST tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I notice you don't have permission to mint TEST tokens. You need to be the token admin.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Mint some tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I need to know which token and how many you want to mint. Please specify both the token denomination and amount.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Mint -100 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I cannot mint a negative amount of tokens. Please specify a positive number.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Mint 1000000 STAR tokens" }
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
            content: { text: "Mint INVALID tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I couldn't find a token denomination called INVALID. Please make sure you've created this token denomination first.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Mint 100.5 STAR tokens" }
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
            content: { text: "Mint thousand STAR tokens" }
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
            content: { text: "Mint 0 STAR tokens" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "The amount must be greater than 0. Please specify a positive number of tokens to mint.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Mint STAR tokens to omniflix1abc123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Please specify how many STAR tokens you want to mint.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Mint 500 STAR tokens to invalid_address" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "The address 'invalid_address' is not a valid OmniFlix address. Please provide a valid address starting with 'omniflix1'.",
                action: "NONE"
            }
        }
    ]
];