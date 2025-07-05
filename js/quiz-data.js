const scenarios = [
    // Email Scenarios
    {
        id: 1,
        type: "email",
        content: {
            sender: "security@paypa1.com",
            subject: "Urgent: Your account will be suspended",
            body: "Dear valued customer,\n\nWe've detected unusual login activity on your account from a device in Romania. If this wasn't you, please verify your account immediately by clicking the link below:\n\nhttp://paypa1-login.com/verify-account\n\nFailure to verify within 24 hours will result in account suspension.\n\nSincerely,\nPayPal Security Team",
            logo: "paypal-like"
        },
        clues: [
            {
                element: "sender",
                explanation: "The sender's domain is misspelled (paypa1.com instead of paypal.com)"
            },
            {
                element: "link",
                explanation: "The URL doesn't match PayPal's official domain (should be paypal.com)"
            },
            {
                element: "subject",
                explanation: "Creates false urgency to pressure you into acting quickly"
            }
        ],
        isPhishing: true
    },
    {
        id: 2,
        type: "email",
        content: {
            sender: "no-reply@accounts.google.com",
            subject: "New sign-in to your Google Account",
            body: "Hi John,\n\nA new sign-in was detected on your Google Account.\n\nDevice: iPhone 13\nLocation: San Francisco, CA\nTime: June 15, 2023, 10:23 AM PST\n\nIf this was you, you can ignore this alert. If you don't recognize this activity, please secure your account.\n\nView activity: https://security.google.com/activity\n\nThanks,\nThe Google Account Team",
            logo: "google"
        },
        clues: [
            {
                element: "sender",
                explanation: "Comes from official google.com domain"
            },
            {
                element: "content",
                explanation: "Provides specific details about the login attempt"
            },
            {
                element: "link",
                explanation: "Links to the official Google security page"
            }
        ],
        isPhishing: false
    },
    
    // Website Scenarios
    {
        id: 3,
        type: "website",
        content: {
            url: "https://www.faceb00k-login.com",
            title: "Facebook - Log In or Sign Up",
            content: "Welcome to Facebook. Log in to connect with friends and the world around you.",
            loginForm: true
        },
        clues: [
            {
                element: "url",
                explanation: "Domain is misspelled (faceb00k instead of facebook)"
            },
            {
                element: "ssl",
                explanation: "Often phishing sites won't have proper SSL certificates"
            }
        ],
        isPhishing: true
    },
    {
        id: 4,
        type: "website",
        content: {
            url: "https://www.linkedin.com/login",
            title: "LinkedIn: Log In or Sign Up",
            content: "Welcome back to LinkedIn. Sign in to stay updated on your professional world.",
            loginForm: true
        },
        clues: [
            {
                element: "url",
                explanation: "Correct LinkedIn domain"
            },
            {
                element: "ssl",
                explanation: "Proper HTTPS security"
            }
        ],
        isPhishing: false
    },
    
    // SMS Scenarios
    {
        id: 5,
        type: "sms",
        content: {
            sender: "Amazon",
            message: "URGENT: Your Amazon package cannot be delivered due to address issues. Update now: http://amzn-delivery-update.com/12345"
        },
        clues: [
            {
                element: "url",
                explanation: "Suspicious domain (not amazon.com)"
            },
            {
                element: "language",
                explanation: "Creates false urgency with ALL CAPS and 'URGENT'"
            }
        ],
        isPhishing: true
    },
    {
        id: 6,
        type: "sms",
        content: {
            sender: "Chase",
            message: "Chase Alert: $1,200 purchase at Best Buy on 06/15. Reply YES if authorized, NO if not. Msg&Data rates may apply."
        },
        clues: [
            {
                element: "content",
                explanation: "Provides specific transaction details"
            },
            {
                element: "disclaimer",
                explanation: "Includes standard message about rates"
            }
        ],
        isPhishing: false
    },
    
    // 4 more scenarios would be here in a complete implementation
];

// Function to get random scenarios for quiz mode
function getRandomScenarios(count) {
    const shuffled = [...scenarios].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
