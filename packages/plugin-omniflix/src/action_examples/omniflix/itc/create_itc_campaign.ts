export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Create an ITC campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level (0 for Burn, 1 for Transfer, 2 for Hold), claim type (0 for FT, 1 for NFT, 2 for both FT and NFT), nftDenomId, amount, maxAllowedClaims, start time in minutes from now, duration, and deposit if applicable.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "name: ITCTesting#2, description: ITC Campaign Testing" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given campaign name is 'ITCTesting#2' and description is 'ITC Campaign Testing'. Please provide the interaction level (0 for Burn, 1 for Transfer, 2 for Hold).",
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
                text: "Given interaction level is '1'. Please provide the claim type (0 for FT, 1 for NFT, 2 for both FT and NFT).",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "claimType: 0" } // User specifies claim type as FT
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given claim type is '0'. Please provide the deposit amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "depositAmount: 100" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given deposit amount is '100'. Please provide the nftDenomId.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "nftDenomId: onftdenom4e4842923316436baf8f7b5e2a7c375b" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftDenomId is 'onftdenom4e4842923316436baf8f7b5e2a7c375b'. Please provide the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "amount: 1000000" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given amount is '1000000'. Please provide the maxAllowedClaims.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "maxAllowedClaims: 10" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is '10'. Please provide the start time in minutes from now (e.g., '5' for 5 minutes).",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "startFromTimeInMinutes: 5" } // User specifies 5 minutes from now
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startFromTimeInMinutes is '5'. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "duration: 10000" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given duration is '10000'. Please provide the distribution type (0 for Instant, 1 for Stream).",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "distributionType: 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given distribution type is '0'. I will create the ITC campaign.",
                action: "CREATE_ITC_CAMPAIGN"
            }
        },
    ],
    [
        {
            user: "{{user2}}",
            content: { text: "Create an ITC campaign with claimType 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level (0 for Burn, 1 for Transfer, 2 for Hold), claim type (0 for FT, 1 for NFT, 2 for both FT and NFT), nftDenomId, amount, maxAllowedClaims, start time in minutes from now, duration, and nftMintDetails.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "name: NFT Campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given name is 'NFT Campaign'. Please provide a description.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "description: Campaign for NFT distribution." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given description is 'Campaign for NFT distribution'. Please provide the interaction level (0 for Burn, 1 for Transfer, 2 for Hold).",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "interaction: 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given interaction level is '1'. Please provide the claim type (0 for FT, 1 for NFT, 2 for both FT and NFT).",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "claimType: 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given claim type is '1'. Please provide the nftMintDetails.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "nftMintDetails: { denomId: 'nftDenom', name: 'NFT Name', description: 'NFT Description', mediaUri: 'https://example.com/media', previewUri: 'https://example.com/preview', royaltyShare: '0.01', transferable: true, extensible: true, nsfw: false, data: '0x...', uriHash: 'hash...', startIndex: 0n, nameDelimiter: '.' }" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftMintDetails are provided. Please provide the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "amount: 2000000" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given amount is '2000000'. Please provide the maxAllowedClaims.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "maxAllowedClaims: 15" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is '15'. Please provide the start time in minutes from now (e.g., '5' for 5 minutes).",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "startFromTimeInMinutes: 10" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startFromTimeInMinutes is '10'. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "duration: 20" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given duration is '20'. I will create the ITC campaign.",
                action: "CREATE_ITC_CAMPAIGN"
            }
        },
    ],
    [
        {
            user: "{{user3}}",
            content: { text: "Create an ITC campaign with claimType 2" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level (0 for Burn, 1 for Transfer, 2 for Hold), claim type (0 for FT, 1 for NFT, 2 for both FT and NFT), nftDenomId, amount, maxAllowedClaims, start time in minutes from now, duration, deposit, and nftMintDetails.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "name: Campaign 2" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given name is 'Campaign 2'. Please provide a description.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "description: This is another test campaign." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given description is 'This is another test campaign'. Please provide the interaction level (0 for Burn, 1 for Transfer, 2 for Hold).",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "interaction: 1" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given interaction level is '1'. Please provide the claim type (0 for FT, 1 for NFT, 2 for both FT and NFT).",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "claimType: 2" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given claim type is '2'. Please provide the deposit amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "depositAmount: 150" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given deposit amount is '150'. Please provide the nftMintDetails.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "nftMintDetails: { denomId: 'nftDenom2', name: 'NFT Name 2', description: 'NFT Description 2', mediaUri: 'https://example.com/media2', previewUri: 'https://example.com/preview2', royaltyShare: '0.02', transferable: true, extensible: true, nsfw: false, data: '0x...', uriHash: 'hash2...', startIndex: 0n, nameDelimiter: '.' }" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftMintDetails are provided. Please provide the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "amount: 2500000" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given amount is '2500000'. Please provide the maxAllowedClaims.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "maxAllowedClaims: 25" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is '25'. Please provide the start time in minutes from now (e.g., '5' for 5 minutes).",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "startFromTimeInMinutes: 15" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startFromTimeInMinutes is '15'. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "duration: 30" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given duration is '30'. I will create the ITC campaign.",
                action: "CREATE_ITC_CAMPAIGN"
            }
        },
    ],
    [
        {
            user: "{{user4}}",
            content: { text: "Create an ITC campaign with missing fields" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level (0 for Burn, 1 for Transfer, 2 for Hold), claim type (0 for FT, 1 for NFT, 2 for both FT and NFT), nftDenomId, amount, maxAllowedClaims, start time in minutes from now, duration, and deposit if applicable.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "name: My Campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given name is 'My Campaign'. Please provide a description.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "description: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given description is empty. Please provide the interaction level (0 for Burn, 1 for Transfer, 2 for Hold).",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "interaction: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given interaction level is empty. Please provide the claim type (0 for FT, 1 for NFT, 2 for both FT and NFT).",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "claimType: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given claim type is empty. Please provide the nftDenomId.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "nftDenomId: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftDenomId is empty. Please provide the amount.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "amount: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given amount is empty. Please provide the maxAllowedClaims.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "maxAllowedClaims: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is empty. Please provide the start time.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "startFromTimeInMinutes: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startFromTimeInMinutes is empty. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "duration: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: description, interaction, claimType, nftDenomId, amount, maxAllowedClaims, startFromTimeInMinutes, duration.",
                action: "NONE"
            }
        },
    ],
    [
        {
            user: "{{user5}}",
            content: { text: "Create an ITC campaign for FT" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the details.",
                action: "NONE"
            }
        },
        {
            user: "{{user5}}",
            content: { text: "name: FT Campaign, description: Campaign for FT distribution, interaction: 1, claimType: 0, nftDenomId: '', amount: 1000000, maxAllowedClaims: 10, depositAmount: '100', startFromTimeInMinutes: 5, duration: 10000, distributionType: 0" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Successfully created FT campaign.",
                action: "CREATE_ITC_CAMPAIGN"
            }
        },
    ],
    [
        {
            user: "{{user6}}",
            content: { text: "Create an ITC campaign for NFT" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the details.",
                action: "NONE"
            }
        },
        {
            user: "{{user6}}",
            content: { text: "name: NFT Campaign, description: Campaign for NFT distribution, interaction: 1, claimType: 1, nftDenomId: 'nftDenom', amount: 2000000, maxAllowedClaims: 15, startFromTimeInMinutes: 10, duration: 20000" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Successfully created NFT campaign.",
                action: "CREATE_ITC_CAMPAIGN"
            }
        },
    ],
    [
        {
            user: "{{user7}}",
            content: { text: "Create an ITC campaign missing fields" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the details.",
                action: "NONE"
            }
        },
        {
            user: "{{user7}}",
            content: { text: "name: Incomplete Campaign, interaction: 1, claimType: 0, amount: 1000000, maxAllowedClaims: 10" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Missing required fields: description, nftDenomId, startFromTimeInMinutes, duration.",
                action: "NONE"
            }
        },
    ],
];