export const projects = [
    {
        title: 'E-bank',
        live: 'https://codecanyon.net/item/ebank-complete-online-banking-system-with-dps-loan/30597974?s_rank=6',
        github: '',
        thumbnail: '/projects/1.webp',
        description: 'E-bank is a banking application including DPS and Loan',
        tech: ['php', 'laravel 8', 'javascript']
    },
    {
        title: 'Lenden',
        live: 'https://codecanyon.net/item/lenden-multipurpose-payment-gateway-system-saas/32131005?s_rank=3',
        github: '',
        thumbnail: '/projects/2.webp',
        description: 'Lenden is Multipurpose Payment Gateway System ( SAAS )',
        tech: ['php', 'laravel 8', 'javascript']
    },
    {
        title: 'Timelock',
        live: 'https://codecanyon.net/item/timelock-project-management-system-with-screenshot-capture/32354442?s_rank=2',
        github: '',
        thumbnail: '/projects/3.webp',
        description: 'Timelock is SAAS based project management system which includes a kanban layout & Screenshot capture',
        tech: ['php', 'laravel 8', 'javascript']
    },
    {
        title: 'Routine Management System',
        live: '',
        github: 'https://github.com/fazleyrabby/routine-lte',
        thumbnail: '/projects/4.webp',
        description: 'This project was created using Laravel and mysql on my last semester as my final year project',
        tech: ['php', 'laravel 8', 'jquery']
    },
    {
        title: 'Portfolio Site',
        live: '',
        github: 'https://github.com/fazleyrabby/astro-portfolio',
        thumbnail: '/projects/5.webp',
        thumbnail_dark: '/projects/5dark.webp',
        description: 'This project was created using Astro & Tailwind CSS',
        tech: ['astro', 'tailwind', 'javascript']
    }
]


export const experiences = [
    {
        name: 'Freelance',
        link: '#',
        from: 'Jan 2019',
        to: 'December 2020',
        role: 'Web Developer',
        contributions: [
            'Class Evaluation System',
            'Shop Management System',
            'Library Management System',
    ],
        timeline: new Date("2019-01-01")
    },
    {
        name: 'Amcoders',
        link: 'https://codecanyon.net/user/amcoders',
        from: 'Jan 2021',
        to: 'July 2021',
        role: 'Laravel Developer',
        contributions: ['Building Backend Web app with Laravel',
            'Payment Gateway Integration (Stripe, Paypal)',
            'Two Step Authentication, Multi Auth,Email queue',
            'Custom Middleware Implementation',
            'CV Builder with Jquery and Ajax',
            'Multiple API Integration (Mailchimp, Twilio)',
            'Dynamic Kanban Layout for project management with Jquery UI',
            'Bus Seat Management with Javascript',
        ],
        timeline: new Date("2021-07-06")
    },
    {
        name: 'Electronic First FZ LLE',
        link: 'https://www.electronicfirst.com/',
        from: 'October 2021',
        to: 'Present',
        role: 'Software Engineer',
        contributions: ['Backend Maintenance',
            'Adding New Features',
            'Debugging existing errors',
            'Refactoring & Optimizations',
            'Implementing custom API\'s',
            'Improving Data Loading Time',
            'Laravel Version Upgrades',
            'Custom Livewire Features Implementation'
        ],
        timeline: new Date("2021-10-15")
    }
]