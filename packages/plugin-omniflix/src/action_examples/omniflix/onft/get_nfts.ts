export default [
    [
        {
            "user": "{{user1}}",
            "content": { "text": "Get collections NFTs" }
        },
        {
            "user": "{{FlixAgent}}",
            "content": {
                "text": "I'll help you get the Collection NFTs. Please provide the denomId.",
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
                "text": "I'll get the collection NFTs of denomId 'onftdenom...'.", 
                "action": "GET_NFTS"
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": { "text": "fetch NFTs of my collection denomId: onftdenom..." }
        },
        {
            "user": "{{FlixAgent}}",
            "content": { 
                "text": "I'll fetch NFTs of denomId 'onftdenom...'.",
                "action": "GET_NFTS"
            }
        }
    ]
]