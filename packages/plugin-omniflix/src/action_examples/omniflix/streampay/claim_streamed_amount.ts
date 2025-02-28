export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Claim the streamed amount for stream ID sp3483" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you claim the streamed amount for stream ID sp3483.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "streamId: sp3483 claimer: omniflix1xyz..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Claiming the streamed amount for stream ID sp3483 now.",
                action: "CLAIM_STREAMED_AMOUNT"
            }
        }
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "I want to claim the streamed amount from stream ID sp6789" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you claim the streamed amount from stream ID sp6789.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "streamId: sp6789 claimer: omniflix1abc..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Claiming the streamed amount for stream ID sp6789 now.",
                action: "CLAIM_STREAMED_AMOUNT"
            }
        }
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Can you help me claim the amount for stream ID sp1111?" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Sure! I'll help you claim the amount for stream ID sp1111.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "streamId: sp1111 claimer: omniflix1def..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Claiming the streamed amount for stream ID sp1111 now.",
                action: "CLAIM_STREAMED_AMOUNT"
            }
        }
    ],
    [
        {
            user: "{{user4}}",
            content: { text: "Claim the streamed amount for stream ID sp2222 immediately" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Claiming the streamed amount for stream ID sp2222 immediately.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "streamId: sp2222 claimer: omniflix1ghi..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Claiming the streamed amount for stream ID sp2222 now.",
                action: "CLAIM_STREAMED_AMOUNT"
            }
        }
    ]
];