export default [
    [
        {
            user: "{{user1}}",
            content: { text: "fetch My lists" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the listing. Please wait",
                action: "GET_MY_LISTINGS"
            }
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "get My lists" }
        },
        {
            user: "{{FlixAgent}}",
            content: { 
                text: "I'll help you fetch the listing. Please wait",
                action: "GET_MY_LISTINGS"
            }
        },
    ],
]