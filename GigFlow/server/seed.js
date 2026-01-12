import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Gig from './models/Gig.js';
import Bid from './models/Bid.js';

dotenv.config();

const users = [
  {
    name: 'Demo User',
    email: 'demo@gigflow.com',
    password: 'demo123',
    bio: 'Full-stack developer with 5 years of experience',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'UI/UX Designer passionate about creating beautiful interfaces',
    skills: ['Figma', 'Adobe XD', 'CSS', 'Tailwind'],
  },
  {
    name: 'Mike Chen',
    email: 'mike@example.com',
    password: 'password123',
    bio: 'Mobile developer specializing in React Native',
    skills: ['React Native', 'iOS', 'Android', 'TypeScript'],
  },
  {
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    bio: 'Content writer and digital marketing specialist',
    skills: ['Copywriting', 'SEO', 'Content Strategy', 'Social Media'],
  },
  {
    name: 'Alex Wilson',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Backend developer focused on scalable systems',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
  },
];

const gigTemplates = [
  {
    title: 'Build a Modern E-commerce Website with React',
    description: `We're looking for an experienced React developer to build a modern e-commerce website. The project includes:

• Product catalog with filtering and search
• Shopping cart functionality
• User authentication and profiles
• Payment integration (Stripe)
• Admin dashboard for managing products
• Responsive design for all devices

Requirements:
- 3+ years of React experience
- Experience with e-commerce platforms
- Knowledge of state management (Redux or Context)
- API integration experience

We prefer developers who can work independently and communicate effectively. The deadline is flexible but we'd like to launch within 6 weeks.`,
    budget: 3500,
    category: 'Web Development',
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    deadlineDays: 45,
  },
  {
    title: 'Mobile App UI/UX Design for Fitness Application',
    description: `Seeking a talented UI/UX designer to create the complete design for our fitness mobile application.

Project Scope:
• User research and personas
• Wire-framing and prototyping
• High-fidelity mockups for 15+ screens
• Design system and component library
• Interaction design and animations
• Handoff documentation for developers

Key Features to Design:
- Onboarding flow
- Workout tracking
- Progress dashboard
- Social features
- Settings and profile

Deliverables should be in Figma with organized layers and components. Looking for someone with a portfolio showcasing mobile app designs.`,
    budget: 2000,
    category: 'UI/UX Design',
    skills: ['Figma', 'Mobile Design', 'Prototyping', 'User Research'],
    deadlineDays: 21,
  },
  {
    title: 'Develop Cross-Platform Mobile App with React Native',
    description: `We need a React Native developer to build a cross-platform mobile application for iOS and Android.

App Features:
• User authentication (social login included)
• Real-time messaging
• Push notifications
• Location-based services
• In-app purchases
• Offline functionality

Technical Requirements:
- Experience with React Native CLI (not Expo)
- Firebase integration
- State management with Redux Toolkit
- Unit testing experience
- CI/CD pipeline setup

The app should follow Apple and Google design guidelines. Previous experience with chat applications is a plus.`,
    budget: 5000,
    category: 'Mobile Development',
    skills: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
    deadlineDays: 60,
  },
  {
    title: 'SEO Optimization and Content Strategy for Tech Blog',
    description: `Looking for an SEO specialist to improve our tech blog's search rankings and develop a content strategy.

Current Situation:
• Blog with 50+ articles
• Monthly traffic: ~5,000 visitors
• Main topics: web development, cloud computing

Goals:
• Increase organic traffic by 200% in 6 months
• Improve keyword rankings for 20 target keywords
• Establish content pillars and topic clusters

Deliverables:
- Technical SEO audit and fixes
- Keyword research and mapping
- Content calendar for 3 months
- On-page optimization guidelines
- Monthly progress reports

Experience with tech/developer content is essential.`,
    budget: 1500,
    category: 'Digital Marketing',
    skills: ['SEO', 'Content Strategy', 'Google Analytics', 'Keyword Research'],
    deadlineDays: 30,
  },
  {
    title: 'Create Brand Identity and Logo Design',
    description: `Startup company seeking a creative designer to develop our complete brand identity.

Deliverables:
• Primary logo and variations
• Color palette and typography
• Brand guidelines document
• Business card and letterhead design
• Social media kit (profile images, covers, templates)
• Icon set for website/app

Brand Personality:
- Modern and innovative
- Trustworthy and professional
- Approachable and friendly

We're in the fintech space, targeting young professionals. Please share your portfolio with similar brand projects.`,
    budget: 1800,
    category: 'Graphic Design',
    skills: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Typography'],
    deadlineDays: 14,
  },
  {
    title: 'Write Technical Documentation for SaaS Product',
    description: `We need a technical writer to create comprehensive documentation for our SaaS platform.

Documentation Needed:
• Getting started guide
• API documentation
• Feature tutorials (10+ features)
• Troubleshooting guide
• FAQ section
• Release notes template

Requirements:
- Experience with developer documentation
- Ability to understand technical concepts
- Clear and concise writing style
- Experience with documentation tools (GitBook, Readme.io)

Our platform is a project management tool for software teams. Technical background is preferred but not required.`,
    budget: 2200,
    category: 'Content Writing',
    skills: ['Technical Writing', 'Documentation', 'API Docs', 'Markdown'],
    deadlineDays: 28,
  },
  {
    title: 'Video Editing for YouTube Channel (10 Videos)',
    description: `Looking for a skilled video editor to edit 10 videos for our tech YouTube channel.

Video Details:
• Average length: 10-15 minutes edited
• Raw footage provided: 30-60 minutes per video
• Style: educational tech content

Requirements:
• Add intros/outros (templates provided)
• Background music and sound effects
• Motion graphics for key points
• Color grading and audio cleanup
• Thumbnail creation (3 options per video)
• Captions/subtitles

Turnaround: 2-3 videos per week
Software: Premiere Pro or DaVinci Resolve

Please share examples of similar YouTube video edits.`,
    budget: 1200,
    category: 'Video Editing',
    skills: ['Premiere Pro', 'After Effects', 'Motion Graphics', 'Color Grading'],
    deadlineDays: 35,
  },
  {
    title: 'Data Entry and CRM Migration Project',
    description: `We're migrating from one CRM to another and need help with data entry and cleanup.

Project Scope:
• Export data from legacy system
• Clean and format data (remove duplicates, standardize)
• Import to new CRM (HubSpot)
• Verify data accuracy
• Create documentation of the process

Data Volume:
- ~5,000 contacts
- ~2,000 companies
- ~10,000 activity records

Requirements:
- Experience with CRM systems
- Strong attention to detail
- Excel/Google Sheets proficiency
- Available for 20-30 hours over 2 weeks

Confidentiality agreement required.`,
    budget: 800,
    category: 'Data Entry',
    skills: ['Excel', 'CRM', 'Data Cleaning', 'HubSpot'],
    deadlineDays: 14,
  },
  {
    title: 'Python Automation Script for Data Processing',
    description: `We need a Python developer to create an automation script for processing CSV files and generating reports.

Tasks:
• Read data from multiple CSV sources
• Clean and validate data entries
• Merge datasets and remove duplicates
• Generate summary reports in Excel format
• Schedule script to run daily via cron

Technical Requirements:
- Proficiency in Python 3.x
- Experience with Pandas and OpenPyXL
- Understanding of data validation techniques
- Ability to write clean, documented code`,
    budget: 1200,
    category: 'Other',
    skills: ['Python', 'Pandas', 'Automation', 'Data Processing'],
    deadlineDays: 14,
  },
  {
    title: 'Custom WordPress Theme Development',
    description: `Looking for a WordPress expert to convert our Figma design into a fully functional custom theme.

Requirements:
• Pixel-perfect conversion from Figma mockups
• Custom post types for portfolio and testimonials
• Gutenberg blocks for flexible content editing
• Mobile responsive across all device sizes
• Optimized for Core Web Vitals and SEO

Please provide links to previous WordPress themes you have developed. Budget is negotiable for exceptional candidates.`,
    budget: 2500,
    category: 'Web Development',
    skills: ['WordPress', 'PHP', 'Gutenberg', 'Responsive Design'],
    deadlineDays: 30,
  },
  {
    title: 'Social Media Management and Content Creation',
    description: `We are seeking a social media specialist to manage our brand presence across multiple platforms.

Scope of Work:
• Manage Instagram, Twitter, LinkedIn, and TikTok accounts
• Create 20 posts per month with custom graphics
• Engage with followers and respond to comments
• Monthly analytics reports and strategy recommendations
• Hashtag research and trend monitoring

Requirements:
- 2+ years social media management experience
- Strong copywriting and visual design skills
- Knowledge of scheduling tools (Buffer, Hootsuite)
- Experience with B2B tech companies preferred`,
    budget: 1800,
    category: 'Digital Marketing',
    skills: ['Social Media', 'Content Creation', 'Copywriting', 'Analytics'],
    deadlineDays: 30,
  },
  {
    title: 'AWS Infrastructure Setup and DevOps Support',
    description: `Seeking an experienced DevOps engineer to set up our cloud infrastructure on AWS.

Responsibilities:
• Design and implement VPC architecture
• Set up EC2 instances with auto-scaling groups
• Configure RDS PostgreSQL with read replicas
• Implement CI/CD pipeline using GitHub Actions
• Set up monitoring with CloudWatch and alerts
• Document all infrastructure as Terraform code

Must have AWS certification or equivalent experience. Security best practices are a must.`,
    budget: 5500,
    category: 'Web Development',
    skills: ['AWS', 'Terraform', 'Docker', 'CI/CD', 'Linux'],
    deadlineDays: 45,
  },
];

const bidMessages = [
  "Hi! I've reviewed your project requirements and I'm confident I can deliver excellent results. I have 5+ years of experience in this field and have completed similar projects. Let me know if you'd like to discuss further.",
  "This project aligns perfectly with my expertise. I've worked on several similar projects and can bring valuable insights. My approach would be to first understand your specific needs, then create a detailed plan before execution.",
  "I'm excited about this opportunity! Your project requirements match my skill set perfectly. I can start immediately and am committed to delivering high-quality work within your timeline.",
  "Thank you for posting this project. I have extensive experience in this area and would love to contribute. I'm detail-oriented and always ensure client satisfaction. Looking forward to working together!",
  "Great project! I specialize in exactly what you're looking for. My previous clients have been very satisfied with my work quality and communication. I'm available to start right away.",
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Bid.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create gigs
    const gigs = [];
    for (let i = 0; i < gigTemplates.length; i++) {
      const template = gigTemplates[i];
      const client = createdUsers[i % createdUsers.length];
      
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + template.deadlineDays);

      gigs.push({
        title: template.title,
        description: template.description,
        budget: template.budget,
        category: template.category,
        skills: template.skills,
        deadline,
        client: client._id,
        status: 'open',
        bidsCount: 0,
      });
    }

    const createdGigs = await Gig.create(gigs);
    console.log(`💼 Created ${createdGigs.length} gigs`);

    // Create bids
    const bids = [];
    for (const gig of createdGigs) {
      // Get users who are not the gig owner
      const potentialBidders = createdUsers.filter(
        (u) => u._id.toString() !== gig.client.toString()
      );

      // Random number of bids (1-3) per gig
      const numBids = Math.floor(Math.random() * 3) + 1;
      const selectedBidders = potentialBidders
        .sort(() => 0.5 - Math.random())
        .slice(0, numBids);

      for (const bidder of selectedBidders) {
        const bidAmount = Math.floor(
          gig.budget * (0.7 + Math.random() * 0.4)
        ); // 70-110% of budget
        const deliveryTime = Math.floor(Math.random() * 14) + 7; // 7-21 days
        const message = bidMessages[Math.floor(Math.random() * bidMessages.length)];

        bids.push({
          gig: gig._id,
          freelancer: bidder._id,
          amount: bidAmount,
          message,
          deliveryTime,
          status: 'pending',
        });
      }
    }

    const createdBids = await Bid.create(bids);
    console.log(`📝 Created ${createdBids.length} bids`);

    // Update gig bid counts
    for (const gig of createdGigs) {
      const bidCount = createdBids.filter(
        (b) => b.gig.toString() === gig._id.toString()
      ).length;
      await Gig.findByIdAndUpdate(gig._id, { bidsCount: bidCount });
    }
    console.log('✅ Updated bid counts');

    // Update user stats
    for (const user of createdUsers) {
      const gigsPosted = createdGigs.filter(
        (g) => g.client.toString() === user._id.toString()
      ).length;
      await User.findByIdAndUpdate(user._id, { gigsPosted });
    }
    console.log('✅ Updated user stats');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Demo Account:');
    console.log('   Email: demo@gigflow.com');
    console.log('   Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
