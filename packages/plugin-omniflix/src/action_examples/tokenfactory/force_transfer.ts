export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Force transfer 100 GATA from omniflix1... to omniflix1..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you force transfer 100 GATA from omniflix1... to omniflix1....",
                action: "FORCE_TRANSFER"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Tokens successfully force transferred!\n ✅ Transaction hash: transaction_hash_example",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Force transfer with missing amount" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: amount",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Force transfer with invalid sender address" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: valid sender",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Force transfer with invalid recipient address" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: valid recipient",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Force transfer with missing denom" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: denom",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Force transfer with valid details" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you force transfer 100 GATA from omniflix1... to omniflix1....",
                action: "FORCE_TRANSFER"
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Tokens successfully force transferred!\n ✅ Transaction hash: transaction_hash_example",
                action: "NONE"
            }
        }
    ]
];