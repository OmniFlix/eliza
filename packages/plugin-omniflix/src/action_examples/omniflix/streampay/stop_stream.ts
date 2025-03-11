export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Stop the stream with ID stream12345" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you stop the stream with ID stream12345.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "streamId: stream12345" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll stop the stream with ID stream12345 for you now.",
                action: "STOP_STREAM"
            }
        }
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "I want to stop my stream with ID stream67890" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you stop the stream with ID stream67890.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "streamId: stream67890" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll stop the stream with ID stream67890 for you now.",
                action: "STOP_STREAM"
            }
        }
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Can you stop the stream with ID stream11111?" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Sure! Stopping the stream with ID stream11111.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "streamId: stream11111" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll stop the stream with ID stream11111 for you now.",
                action: "STOP_STREAM"
            }
        }
    ],
    [
        {
            user: "{{user4}}",
            content: { text: "Stop the stream with ID stream22222 immediately" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Stopping the stream with ID stream22222 immediately.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "streamId: stream22222" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll stop the stream with ID stream22222 for you now.",
                action: "STOP_STREAM"
            }
        }
    ]
];