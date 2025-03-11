export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch auction by nft" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the auction. Please provide the NFT Id.",
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
                text: "Given NFT Id is onft.Please wait i will fetch auction'.",
                action: "GET_AUCTION_BY_NFT"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get the auction my NFT Id, onft..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll fetch the list by given NFT Id 'onft'.",
                action: "GET_AUCTION_BY_NFT"
            }
        }
    ]
]