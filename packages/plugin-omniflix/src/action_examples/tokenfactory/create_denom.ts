export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Create a new token denom called STAR" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you create a new token denomination called STAR",
                action: "CREATE_TOKEN_FACTORY_DENOM"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully created token denom STAR, Transaction: ABC123XYZ" }
        // }
    ],
    [
        {
            user: "{{user1}}", 
            content: { text: "Create token TEST" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you create a new token denomination called TEST",
                action: "CREATE_TOKEN_FACTORY_DENOM"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully created token denom TEST, Transaction: XYZ789ABC" }
        // }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create a new token" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I need to know what you want to name your token. Please provide a name for the token denomination.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token denom FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Sorry, FLIX is a reserved token denomination and cannot be created. Please choose a different name.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token 123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination names must start with a letter and can only contain letters, numbers, and underscores. Please provide a valid name.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token TEST_TOKEN" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you create a new token denomination called TEST_TOKEN",
                action: "CREATE_TOKEN_FACTORY_DENOM"
            }
        },
        // {
        //     user: "{{FlixAgent}}",
        //     content: { text: "Successfully created token denom TEST_TOKEN, Transaction: DEF456GHI" }
        // }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token @invalid" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination names cannot contain special characters. Only letters, numbers, and underscores are allowed. Please provide a valid name.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token VERYLONGTOKENNAME123456789" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Token denomination name is too long. Please use a shorter name (maximum 20 characters).",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token TEST" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "A token denomination called TEST already exists. Please choose a different name.",
                action: "NONE"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create token with description" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I need the name for your token denomination. The description can be added later. What would you like to name your token?",
                action: "NONE"
            }
        }
    ]
]