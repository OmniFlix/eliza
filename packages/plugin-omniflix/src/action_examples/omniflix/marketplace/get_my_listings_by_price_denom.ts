export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch my listings by price denom" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help fetch your listings. Please provide the price denom.",
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
                action: "GET_MY_LISTINGS_BY_PRICE_DENOM"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { 
                text: "fetch my listing by price denom: uflix':",
            }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Here are the listings with price denom uflix':",
                action: "GET_MY_LISTINGS_BY_PRICE_DENOM"
            }
        }
    ]
]