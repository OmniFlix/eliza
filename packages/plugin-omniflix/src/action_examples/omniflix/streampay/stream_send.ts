import { ActionExample } from "@elizaos/core";

const examples: ActionExample[][] = [
    [
        {
            role: "user",
            content: "Send a stream of 100 FLIX to omniflix1xyz... for 1 hour"
        },
        {
            role: "assistant",
            content: `I'll help you send a stream payment of 100 FLIX that will last for 1 hour.

\`\`\`json
{
    "recipientAddress": "omniflix1xyz...",
    "amount": {
        "denom": "uflix",
        "amount": "100000000"
    },
    "duration": {
        "seconds": 3600,
        "nanos": 0
    },
    "streamType": 0,
    "cancellable": true,
    "paymentFee": {
        "denom": "uflix",
        "amount": "1000"
    }
}
\`\`\`
`
        }
    ],
    [
        {
            role: "user",
            content: "Create a non-cancellable stream of 50 FLIX to omniflix1abc... that lasts for 24 hours"
        },
        {
            role: "assistant",
            content: `I'll help you set up a non-cancellable stream payment of 50 FLIX for 24 hours.

\`\`\`json
{
    "recipientAddress": "omniflix1abc...",
    "amount": {
        "denom": "uflix",
        "amount": "50000000"
    },
    "duration": {
        "seconds": 86400,
        "nanos": 0
    },
    "streamType": 0,
    "cancellable": false,
    "paymentFee": {
        "denom": "uflix",
        "amount": "1000"
    }
}
\`\`\`
`
        }
    ],
    [
        {
            role: "user",
            content: "Start a stream payment of 1000 FLIX to omniflix1def... for 1 week with a payment fee of 10 FLIX"
        },
        {
            role: "assistant",
            content: `I'll help you create a stream payment of 1000 FLIX lasting one week with a custom payment fee.

\`\`\`json
{
    "recipientAddress": "omniflix1def...",
    "amount": {
        "denom": "uflix",
        "amount": "1000000000"
    },
    "duration": {
        "seconds": 604800,
        "nanos": 0
    },
    "streamType": 0,
    "cancellable": true,
    "paymentFee": {
        "denom": "uflix",
        "amount": "10000000"
    }
}
\`\`\`
`
        }
    ],
    [
        {
            role: "user",
            content: "Send 75 FLIX to omniflix1ghi... over 12 hours with periods"
        },
        {
            role: "assistant",
            content: `I'll help you create a stream payment with multiple periods.

\`\`\`json
{
    "recipientAddress": "omniflix1ghi...",
    "amount": {
        "denom": "uflix",
        "amount": "75000000"
    },
    "duration": {
        "seconds": 43200,
        "nanos": 0
    },
    "streamType": 0,
    "periods": [
        {
            "amount": {
                "denom": "uflix",
                "amount": "25000000"
            },
            "duration": {
                "seconds": 14400,
                "nanos": 0
            }
        }
    ],
    "cancellable": true,
    "paymentFee": {
        "denom": "uflix",
        "amount": "1000"
    }
}
\`\`\`
`
        }
    ],
    [
        {
            role: "user",
            content: "Create a stream to send 200 FLIX to omniflix1jkl... over 48 hours with a different stream type"
        },
        {
            role: "assistant",
            content: `I'll help you create a stream with a different stream type.

\`\`\`json
{
    "recipientAddress": "omniflix1jkl...",
    "amount": {
        "denom": "uflix",
        "amount": "200000000"
    },
    "duration": {
        "seconds": 172800,
        "nanos": 0
    },
    "streamType": 1,
    "cancellable": true,
    "paymentFee": {
        "denom": "uflix",
        "amount": "1000"
    }
}
\`\`\`
`
        }
    ]
];

export default examples;