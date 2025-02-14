export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Set metadata for token GATA" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you set metadata for the token denomination GATA.",
                action: "SET_TOKEN_FACTORY_DENOM_METADATA"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination 'factory/[your-address]/GATA' metadata set successfully!\n ✅ Transaction hash: transaction_hash_example",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Set metadata for token with short name" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination must be between 3 and 10 characters long. Please provide a valid name.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Set metadata for token GATA without metadata" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token metadata is required. Please provide the metadata for the token.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Set metadata for token GATA with invalid metadata" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token metadata must be an object. Please provide valid metadata.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Set metadata for token GATA with valid metadata" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you set metadata for the token denomination GATA.",
                action: "SET_TOKEN_FACTORY_DENOM_METADATA"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination 'factory/[your-address]/GATA' metadata set successfully!\n ✅ Transaction hash: transaction_hash_example",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Set metadata for token GATA with missing name" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "What would you like to name your token? The name must be 3-10 characters long and contain only uppercase letters and numbers.",
                action: "NONE"
            }
        }
    ]
];