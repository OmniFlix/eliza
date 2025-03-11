export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch listing by nft" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the listing. Please provide the NFT Id.",
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
                text: "Given NFT Id is onft.Please wait i will fetch'.",
                action: "GET_LISTING_BY_NFT"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get the list my NFT Id, onft..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll fetch the list by given NFT Id 'onft'.",
                action: "GET_LISTING_BY_NFT"
            }
        }
    ]
]