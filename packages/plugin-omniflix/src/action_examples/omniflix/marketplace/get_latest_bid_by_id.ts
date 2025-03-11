export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch the latest bid by auctionId" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the latest bid by auctionId. Please provide the auctionId.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "auctionId: 2" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given list id is 'list'.",
                action: "GET_LATEST_BID_BY_ID"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get lastest bid by auctionId: 2" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll fetch the latest bid by auctionId: 2'.",
                action: "GET_LATEST_BID_BY_ID"
            }
        }
    ]
]