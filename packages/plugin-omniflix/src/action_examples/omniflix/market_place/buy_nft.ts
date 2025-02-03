export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Buy NFT" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you buy an NFT. Please provide the listId, price.",
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
                text: "Given list id is 'list...'. Please provide price",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "amount: 10 denom: FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll buy the NFT with list id 'list...', price '10FLIX'.",
                action: "BUY_NFT"
            }
        },
    ]
]