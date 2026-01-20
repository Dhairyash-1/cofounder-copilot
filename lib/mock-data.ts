// Mock data for Cofounder Copilot MVP

export interface Task {
  id: string;
  title: string;
  description: string;
  source: "email" | "meeting" | "task";
  urgency: "high" | "medium" | "low";
  sender?: string;
  senderEmail?: string;
  timestamp: string;
  emailContext?: string;
  aiReply?: string;
}

export interface Meeting {
  id: string;
  title: string;
  attendee: string;
  attendees: Array<{
    name: string;
    avatar?: string;
  }>;
  team?: string;
  platform: "zoom" | "meet" | "teams";
  startTime: string;
  endTime: string;
}

export const todaysTasks: Task[] = [
  {
    id: "1",
    title: "Reply to investor update request",
    description: "Sarah from Sequoia requested Q4 metrics update",
    source: "email",
    urgency: "high",
    sender: "Sarah Chen",
    senderEmail: "sarah.chen@sequoiacap.com",
    timestamp: "2 hours ago",
    emailContext: `Hi,

Hope you're doing well! As we approach the end of Q4, I wanted to check in on how things are progressing.

Could you send over the latest metrics when you get a chance? Specifically interested in:
- Monthly Active Users
- Revenue growth
- Burn rate

Looking forward to our next board meeting.

Best,
Sarah`,
    aiReply: `Hi Sarah,

Thanks for reaching out! Here's our Q4 update:

**Key Metrics:**
- MAU: 45,000 (↑32% from Q3)
- MRR: $125K (↑28% from Q3)
- Burn rate: $85K/month (18 months runway)

**Highlights:**
- Launched 3 major features
- Closed 2 enterprise deals
- Team grew from 8 to 12

Happy to dive deeper on any of these in our next call.

Best regards`,
  },
  {
    id: "2",
    title: "Prepare for product roadmap review",
    description: "Engineering sync at 2pm - need to finalize Q1 priorities",
    source: "meeting",
    urgency: "high",
    sender: "Team Calendar",
    timestamp: "In 3 hours",
    emailContext: "Quarterly product roadmap review with engineering team. Key decisions needed on Q1 feature priorities and resource allocation.",
    aiReply: `Suggested talking points:

1. **Top 3 Q1 Priorities**
   - User onboarding improvements
   - API v2 launch
   - Mobile app beta

2. **Resource Allocation**
   - 2 engineers on core product
   - 1 engineer on infrastructure
   - 1 engineer on mobile

3. **Key Dependencies**
   - Design specs by Jan 15
   - API documentation complete`,
  },
  {
    id: "3",
    title: "Follow up with enterprise lead",
    description: "Acme Corp demo went well - they asked for pricing",
    source: "email",
    urgency: "medium",
    sender: "John Smith",
    senderEmail: "john.smith@acmecorp.com",
    timestamp: "Yesterday",
    emailContext: `Great demo yesterday! The team was really impressed with the product.

A few questions:
1. What's the pricing for 500+ users?
2. Do you offer annual contracts?
3. What's the implementation timeline?

Looking forward to moving this forward.

John`,
    aiReply: `Hi John,

Thanks for the great conversation yesterday! Glad the team found value in the demo.

**Regarding your questions:**

1. **Enterprise pricing (500+ users):** $15/user/month, volume discounts available
2. **Annual contracts:** Yes, with 20% discount on annual commitment
3. **Implementation:** 2-4 weeks typical, includes dedicated onboarding support

I'd love to schedule a call to discuss your specific needs. How does Thursday at 2pm work?

Best regards`,
  },
  {
    id: "4",
    title: "Review and sign partnership agreement",
    description: "Legal sent final draft of the TechFlow partnership",
    source: "email",
    urgency: "medium",
    sender: "Legal Team",
    senderEmail: "legal@company.com",
    timestamp: "3 hours ago",
    emailContext: "The final partnership agreement with TechFlow is ready for your review and signature. Key terms have been negotiated and approved.",
  },
  {
    id: "5",
    title: "Weekly team standup notes",
    description: "Summarize blockers from yesterday's standup",
    source: "task",
    urgency: "low",
    timestamp: "Recurring",
  },
];

export const todaysMeetings: Meeting[] = [
  {
    id: "1",
    title: "Product Roadmap Review",
    attendee: "Engineering Team",
    attendees: [
      { name: "Alex Kim" },
      { name: "Maria Garcia" },
      { name: "David Lee" },
      { name: "Emma Wilson" },
    ],
    team: "Engineering",
    platform: "zoom",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    id: "2",
    title: "Investor Check-in",
    attendee: "Sarah Chen",
    attendees: [
      { name: "Sarah Chen" },
      { name: "Michael Brown" },
    ],
    team: "Board",
    platform: "meet",
    startTime: "16:00",
    endTime: "16:30",
  },
  {
    id: "3",
    title: "Design Review",
    attendee: "Design Team",
    attendees: [
      { name: "Lisa Park" },
      { name: "Tom Anderson" },
    ],
    team: "Product",
    platform: "zoom",
    startTime: "17:00",
    endTime: "17:45",
  },
];

export const userProgress = {
  completed: 3,
  total: 8,
  percentage: 37.5,
};
