export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch the auction" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the auction. Please provide the auction id.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "23" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given auction id is '23'.",
                action: "GET_AUCTION"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get auction, 23" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll fetch the auction id '23'.",
                action: "GET_AUCTION"
            }
        }
    ]
]