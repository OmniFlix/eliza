export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Cancel ITC campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you cancel an ITC campaign. Please provide the campaign id.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: 12345 }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given campaign id is '12345'. I will proceed to cancel the campaign.",
                action: "CANCEL_ITC_CAMPAIGN"
            }
        }
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "Cancel ITC campaign, campaign id: 67890" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I will cancel the ITC campaign with id '67890'.",
                action: "CANCEL_ITC_CAMPAIGN"
            }
        }
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Cancel ITC campaign with missing id" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you cancel an ITC campaign. Please provide the campaign id.",
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
                text: "Given campaign id is empty. Please provide the campaign id to proceed.",
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
                text: "Given campaign id is '54321'. I will proceed to cancel the campaign.",
                action: "CANCEL_ITC_CAMPAIGN"
            }
        }
    ],
];