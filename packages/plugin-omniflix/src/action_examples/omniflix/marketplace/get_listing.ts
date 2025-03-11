export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch the listing" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the listing. Please provide the list id.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "list..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given list id is 'list'.",
                action: "GET_LISTING"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get list, list..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll fetch the list id 'list...'.",
                action: "GET_LISTING"
            }
        }
    ]
]