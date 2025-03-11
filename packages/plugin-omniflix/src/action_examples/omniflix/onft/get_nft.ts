export default [
    [
        {
            "user": "{{user1}}",
            "content": { "text": "Get single NFT" }
        },
        {
            "user": "{{FlixAgent}}",
            "content": {
                "text": "I'll help you get the NFT. Please provide the denomId & NFTId.",
                "action": "NONE" 
            }
        },
        {
            "user": "{{user1}}",
            "content": { "text": "denom id: onftdenom..." }
        },
        {
            "user": "{{FlixAgent}}",
            "content": { 
                "text": "I got the denomId 'onftdenom...'. Now please provide the NFTId.", 
                "action": "NONE"
            }
        },
        {
            "user": "{{user1}}",
            "content": { "text": "NFT id: 1" }
        },
        {
            "user": "{{FlixAgent}}",
            "content": { 
                "text": "I got the denomId 'denom' &  NFTId '1'. Fetching the NFT...",
                "action": "GET_SINGLE_NFT",
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": { "text": "fetch NFT of my collection denomId: onftdenom... &  NFTId: 1" }
        },
        {
            "user": "{{FlixAgent}}",
            "content": { 
                "text": "I'll fetch NFT of denomId 'onftdenom...' & NFTId '1'.",
                "action": "GET_SINGLE_NFT"
            }
        }
    ]
]