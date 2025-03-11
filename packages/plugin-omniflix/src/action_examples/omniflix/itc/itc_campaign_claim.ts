export default [
    [
        {
            user: "{{user1}}",
            content: { text: "claim itc campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you claim an ITC campaign. Please provide the campaignId, nftId, and interaction level.",
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
                text: "Given campaignId is '12345'. Please provide the nftId.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "nftId: onft123" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftId is 'onft123'. Please provide the interaction level.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "interaction: 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given interaction level is '1'. I will proceed to claim the campaign.",
                action: "ITC_CAMPAIGN_CLAIM"
            }
        }
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "Claim ITC campaign, campaignId: 67890, nftId: onft456, interaction: 2" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I will claim the ITC campaign with id '67890', nftId 'onft456', and interaction level '2'.",
                action: "ITC_CAMPAIGN_CLAIM"
            }
        }
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Claim ITC campaign with missing fields" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you claim an ITC campaign. Please provide the campaignId, nftId, and interaction level.",
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
                text: "Given campaignId is '54321'. Please provide the nftId.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "nftId: onft789" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftId is 'onft789'. Please provide the interaction level.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "interaction: 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given interaction level is '0'. I will proceed to claim the campaign.",
                action: "ITC_CAMPAIGN_CLAIM"
            }
        }
    ],
];