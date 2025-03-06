export default [
    [
        {
            user: "{{user1}}",
            content: { text: "Create an ITC campaign" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level, nftDenomId, amount, maxAllowedClaims, claimType, startTime, duration, and deposit if applicable.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
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
            user: "{{user1}}",
            content: { text: "description: This is a test campaign." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given description is 'This is a test campaign'. Please provide the interaction level.",
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
                text: "Given interaction level is '1'. Please provide the claim type.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "claimType: 0" }
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
            content: { text: "nftDenomId: onftdenom..." }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given nftDenomId is 'onftdenom'. Please provide the amount.",
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
            content: { text: "maxAllowedClaims: 10n" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is '10n'. Please provide the startTime.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "startTime: 5" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startTime is '5'. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user1}}",
            content: { text: "duration: 10n" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given duration is '10n'. I will create the ITC campaign.",
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
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level, nftDenomId, amount, maxAllowedClaims, claimType, startTime, duration, and nftMintDetails.",
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
                text: "Given description is 'Campaign for NFT distribution'. Please provide the interaction level.",
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
                text: "Given interaction level is '1'. Please provide the claim type.",
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
            content: { text: "maxAllowedClaims: 15n" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is '15n'. Please provide the startTime.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "startTime: 10" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startTime is '10'. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user2}}",
            content: { text: "duration: 20n" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given duration is '20n'. I will create the ITC campaign.",
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
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level, nftDenomId, amount, maxAllowedClaims, claimType, startTime, duration, deposit, and nftMintDetails.",
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
                text: "Given description is 'This is another test campaign'. Please provide the interaction level.",
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
                text: "Given interaction level is '1'. Please provide the claim type.",
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
            content: { text: "maxAllowedClaims: 25n" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given maxAllowedClaims is '25n'. Please provide the startTime.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "startTime: 15" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startTime is '15'. Please provide the duration.",
                action: "NONE"
            }
        },
        {
            user: "{{user3}}",
            content: { text: "duration: 30n" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given duration is '30n'. I will create the ITC campaign.",
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
                text: "I'll create an ITC campaign. Please provide the name, description, interaction level, nftDenomId, amount, maxAllowedClaims, claimType, startTime, duration, and deposit if applicable.",
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
                text: "Given description is empty. Please provide the interaction level.",
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
                text: "Given interaction level is empty. Please provide the claim type.",
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
                text: "Given maxAllowedClaims is empty. Please provide the startTime.",
                action: "NONE"
            }
        },
        {
            user: "{{user4}}",
            content: { text: "startTime: " }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "Given startTime is empty. Please provide the duration.",
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
                text: "Missing required fields: description, interaction, claimType, nftDenomId, amount, maxAllowedClaims, startTime, duration.",
                action: "NONE"
            }
        },
    ],
];