export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Send a stream of 100 FLIX to omniflix1xyz... for 1 hour with stream type 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you send a stream payment of 100 FLIX that will last for 1 hour.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "amount: 100 denom: FLIX duration: 3600 streamType: 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create a stream payment of 100 FLIX lasting one hour.",
                action: "STREAM_SEND"
            }
        }
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create a non-cancellable stream of 50 FLIX to omniflix1abc... that lasts for 24 hours with stream type 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you set up a non-cancellable stream payment of 50 FLIX for 24 hours.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "amount: 50 denom: FLIX duration: 86400 cancellable: false streamType: 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create a non-cancellable stream of 50 FLIX for 24 hours.",
                action: "STREAM_SEND"
            }
        }
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "Start a stream payment of 1000 FLIX to omniflix1def... for 1 week with a payment fee of 10 FLIX" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you create a stream payment of 1000 FLIX lasting one week with a custom payment fee.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "amount: 1000 denom: FLIX duration: 604800 paymentFee: 10 streamType: 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create a stream payment of 1000 FLIX for one week with a payment fee of 10 FLIX.",
                action: "STREAM_SEND"
            }
        }
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Send 75 FLIX to omniflix1ghi... over 12 hours with periods" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you create a stream payment with multiple periods.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "amount: 75 denom: FLIX duration: 43200 periods: [{amount: 25, duration: 14400}] streamType: 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create a stream payment of 75 FLIX over 12 hours with specified periods.",
                action: "STREAM_SEND"
            }
        }
    ],
    [
        {
            user: "{{user4}}",
            content: { text: "Create a stream to send 200 FLIX to omniflix1jkl... over 48 hours with a different stream type" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you create a stream with a different stream type.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "amount: 200 denom: FLIX duration: 172800 streamType: 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create a stream payment of 200 FLIX over 48 hours with a different stream type.",
                action: "STREAM_SEND"
            }
        }
    ]
]