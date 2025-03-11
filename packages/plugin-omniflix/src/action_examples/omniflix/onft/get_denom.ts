export default [
    [
        {
            "user": "{{user1}}",
            "content": { "text": "Get denom" }
        },
        {
            "user": "{{FlixAgent}}",
            "content": {
                "text": "I'll help you get the denom. Please provide the denom id.",
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
                "text": "I'll get the denom with id 'onftdenom...'.", 
                "action": "GET_DENOM"
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": { "text": "fetch denom" }
        },
        {
            "user": "{{FlixAgent}}",
            "content": { 
                "text": "I'll fetch the denom now.",
                "action": "GET_DENOM"
            }
        }
    ]
]