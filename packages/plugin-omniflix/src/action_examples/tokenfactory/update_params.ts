export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Update params for token GATA" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you update the parameters for the token denomination GATA.",
                action: "UPDATE_TOKEN_FACTORY_PARAMS"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination 'factory/[your-address]/GATA' updated successfully!\n ✅ Transaction hash: transaction_hash_example",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Update params with missing authority" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: authority",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Update params with invalid params" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: params",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Update params with valid details" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you update the parameters for the token denomination GATA.",
                action: "UPDATE_TOKEN_FACTORY_PARAMS"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination 'factory/[your-address]/GATA' updated successfully!\n ✅ Transaction hash: transaction_hash_example",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Update params with missing params" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: params",
                action: "NONE"
            }
        }
    ]
];