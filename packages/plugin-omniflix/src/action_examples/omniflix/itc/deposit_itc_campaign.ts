export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Deposit into ITC campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you deposit into an ITC campaign. Please provide the campaignId, denom, and amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "campaignId: 12345" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given campaignId is '12345'. Please provide the denom.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "denom: uflix" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given denom is 'uflix'. Please provide the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "amount: 100" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given amount is '100'. I will proceed to deposit into the campaign.",
                action: "DEPOSIT_ITC_CAMPAIGN"
            }
        }
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "Deposit into ITC campaign, campaignId: 67890, denom: uflix, amount: 200" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I will deposit into the ITC campaign with id '67890', denom 'uflix', and amount '200'.",
                action: "DEPOSIT_ITC_CAMPAIGN"
            }
        }
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Deposit into ITC campaign with missing fields" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you deposit into an ITC campaign. Please provide the campaignId, denom, and amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "campaignId: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given campaignId is empty. Please provide the campaignId to proceed.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "campaignId: 54321" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given campaignId is '54321'. Please provide the denom.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "denom: uflix" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given denom is 'uflix'. Please provide the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "amount: 150" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given amount is '150'. I will proceed to deposit into the campaign.",
                action: "DEPOSIT_ITC_CAMPAIGN"
            }
        }
    ],
];