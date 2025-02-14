export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch My auctions" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the auction. Please wait",
                action: "GET_MY_AUCTIONS"
            }
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get My auctions" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the auction. Please wait",
                action: "GET_MY_AUCTIONS"
            }
        },
    ],
]