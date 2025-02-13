export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Change admin of STAR token to omniflix1abc123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you change the admin of STAR token to omniflix1abc123",
                action: "CHANGE_ADMIN"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully changed admin of STAR token to omniflix1abc123, Transaction: ABC123XYZ" }
        // }
    ],
    [
        {
            user: "{{user1}}", 
            content: { text: "Transfer admin rights of TEST token to omniflix1xyz789" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I notice you're not the current admin of TEST token. Only the current admin can transfer admin rights.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Change token admin" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I need to know which token's admin you want to change and the new admin's address. Please provide both.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "Change COSMIC token admin to omniflix1def456" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you change the admin of COSMIC token to omniflix1def456",
                action: "CHANGE_ADMIN"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully changed admin of COSMIC token to omniflix1def456, Transaction: DEF456GHI" }
        // }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Change INVALID token admin to omniflix1abc123" }
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
            content: { text: "Change STAR admin to invalid_address" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "The address 'invalid_address' is not a valid OmniFlix address. Please provide a valid address starting with 'omniflix1'.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Change STAR token admin to current admin" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "The new admin address (omniflix1abc123) is the same as the current admin. Please provide a different address.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Make me admin of STAR token" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "To make you the admin, I need your OmniFlix address. What's your address?",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Change admin of all my tokens to omniflix1abc123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I can only change the admin for one token at a time. Which specific token would you like to change the admin for?",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Remove admin from STAR token" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "A token must always have an admin. Instead of removing the admin, you can transfer admin rights to another address.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Change STAR admin to omniflix1xyz789 and omniflix1abc123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "A token can only have one admin. Please specify a single address to be the new admin.",
                action: "NONE"
            }
        }
    ]
]