export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch auctions by price denom" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch auctions. Please provide the price denom.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "uflix" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given price denom is uflix'.",
                action: "GET_AUCTIONS_BY_PRICE_DENOM"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { 
                text: "fetch auctions by price denom: uflix':",
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Here are the auctions with price denom uflix':",
                action: "GET_AUCTIONS_BY_PRICE_DENOM"
            }
        }
    ]
]