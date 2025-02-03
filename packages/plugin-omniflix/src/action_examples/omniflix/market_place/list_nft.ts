export default [
    [
        {
            user: "{{user1}}",
            content: { text: "List NFT" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you list an NFT. Please provide the NFT id and price.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "onft..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given NFT id is 'onft'. Please provide denomId and the price.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "denomId: onftdenom..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given NFT id is 'onft' and denomId is 'onftdenom'. Please provide the price.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "amount: 100 denom: FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll list the NFT with id 'onft' and denomId 'onftdenom' for you now.",
                action: "LIST_NFT"
            }
        }
    ]
]