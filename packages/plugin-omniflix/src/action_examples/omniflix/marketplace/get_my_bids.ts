export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch My bids" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the bids. Please wait",
                action: "GET_MY_BIDS"
            }
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get My bids" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the bids. Please wait",
                action: "GET_MY_BIDS"
            }
        },
    ],
]