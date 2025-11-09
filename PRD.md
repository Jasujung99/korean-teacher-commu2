# Planning Guide

A comprehensive community platform for Korean language teachers to collaborate, share research, exchange teaching experiences, and build meaningful connections through study groups and professional development.

**Experience Qualities**:
1. **Professional yet Approachable** - The platform should feel academically credible while remaining welcoming and accessible to teachers at all experience levels
2. **Community-Centered** - Every interaction should strengthen connections between teachers, encouraging collaboration over competition
3. **Resource-Rich** - Information should be easy to discover, well-organized, and immediately useful for classroom application

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - This is a full-featured community platform with multiple sections, user authentication, file management, copyright tracking, group systems, and dynamic content feeds

## Essential Features

### Two Main Navigation Areas (Research & Field)

**Research - Professional Development Section**
- Functionality: Organizes academic and pedagogical content into three subsections (Foundational Studies, Educational Research, Practical Research)
- Purpose: Provides structured access to linguistic theory, teaching methodology, and practical classroom research
- Trigger: User clicks "연구" (Research) in main navigation
- Progression: Main menu click → Category selection (기초학문/교육연구/실용연구) → Topic selection → Content feed
- Success criteria: Users can navigate from broad categories to specific topics within 2 clicks

**Field - Multicultural Practice Section**
- Functionality: Shares real classroom experiences and community engagement stories in two subsections (Classroom Field, Multicultural Practice)
- Purpose: Connects theory to practice through authentic teaching stories and multicultural community work
- Trigger: User clicks "현장" (Field) in main navigation
- Progression: Main menu click → Section selection (수업현장/다문화실천) → Topic selection → Content feed
- Success criteria: Teachers find relevant real-world experiences matching their teaching context

### Dual Sidebar System

**Left Sidebar (Static Information)**
- Functionality: Displays announcements, quick links to resource library, upcoming events, and external links
- Purpose: Provides consistent access to platform-wide information and external resources
- Trigger: Always visible on main content pages
- Progression: Persistent sidebar → Click any quick link → Navigate to destination
- Success criteria: Users can access announcements and resources without navigating away from current page

**Right Sidebar (Dynamic Activity)**
- Functionality: Shows popular posts, recent user activity, and active study groups in real-time
- Purpose: Creates sense of community vitality and helps users discover trending content
- Trigger: Updates automatically as platform activity occurs
- Progression: Sidebar updates → User sees interesting activity → Click to explore
- Success criteria: Activity feed updates show content from last 24 hours with accurate engagement metrics

### Study Group System (Hybrid Model)

**Group Discovery Interface**
- Functionality: Dedicated page for finding and joining online/offline study groups with filtering
- Purpose: Facilitates teacher networking and collaborative learning communities
- Trigger: User clicks "모임 찾기" (Find Groups) button in top navigation
- Progression: Click button → View filters (topic/region/level) → Browse groups → Request to join
- Success criteria: Users can filter groups and submit join request within 3 clicks

**Group Creation**
- Functionality: Form to create new study group with topic, meeting format, schedule, and membership settings
- Purpose: Empowers teachers to form specialized learning communities
- Trigger: Click "새 모임 만들기" (Create New Group) button
- Progression: Click create → Fill group details → Set privacy/membership → Publish
- Success criteria: New group appears in discovery interface immediately after creation

### Centralized Resource Library System

**Copyright-Protected Upload Process**
- Functionality: Multi-step upload requiring copyright verification, license selection, categorization, and access control
- Purpose: Protects intellectual property while enabling resource sharing
- Trigger: User clicks upload button in resource library
- Progression: Upload initiation → Copyright confirmation checkboxes → License selection (CC variants or full copyright) → Category/tags → Privacy settings → Unique ID generation
- Success criteria: Every uploaded file has verified copyright status and unique tracking number

**Resource Linking Across Platform**
- Functionality: When writing posts in Research/Field sections, users can link to existing resource library files instead of uploading duplicates
- Purpose: Prevents duplicate uploads and centralizes file management
- Trigger: User clicks attachment button while composing post
- Progression: Compose post → Click attach → Search resource library → Select insertion format (link/card/embed) → Insert reference
- Success criteria: Single file can be referenced by multiple posts with usage tracking

**Resource Dashboard**
- Functionality: Personal dashboard showing upload statistics, download counts, and posts that reference each resource
- Purpose: Gives uploaders insight into resource impact and usage
- Trigger: Navigate to user profile resource management section
- Progression: Profile → My Resources → View individual resource → See stats and citation list
- Success criteria: Dashboard accurately shows download count and lists all posts linking to each resource

### Content Creation & Interaction

**Post Composition**
- Functionality: Rich text editor for creating posts in Research or Field sections with resource linking capability
- Purpose: Enables knowledge sharing with proper attribution and resource references
- Trigger: Click "New Post" in any content section
- Progression: Select section → Choose category → Compose with editor → Attach resources → Set visibility → Publish
- Success criteria: Post appears in correct category feed with attached resources accessible

**Engagement Metrics**
- Functionality: Track and display views, likes, comments, and resource downloads on posts
- Purpose: Surface valuable content and reward contribution
- Trigger: Users interact with content (view, like, comment, download)
- Progression: User action → Metric increments → Displays on post card and popular content feeds
- Success criteria: Popular content appears in right sidebar and drives discoverability

## Edge Case Handling

- **Empty States** - Show helpful prompts when sections have no content ("Be the first to share your research!" with CTA buttons)
- **Copyright Disputes** - Include report button on resources with admin review queue for takedown requests
- **Inactive Groups** - Auto-archive groups with no activity for 90 days, with revival option for members
- **Duplicate Resources** - Show similar file warning before upload based on filename/size matching
- **Broken Resource Links** - Display placeholder card with "Resource no longer available" if referenced file deleted
- **Mobile Navigation** - Collapse dual sidebars into hamburger menu and bottom tabs for mobile viewports
- **Long Category Lists** - Implement collapsible sections and search within navigation for topic discovery

## Design Direction

The design should evoke trust, professionalism, and warmth - like a well-organized university library that also feels like a teacher's lounge. Clean, structured layouts communicate academic credibility while warm colors and friendly micro-interactions create approachability. A minimal interface lets content shine while rich information architecture prevents overwhelming users.

## Color Selection

Complementary palette with warm-cool balance to represent the dual nature of research (cool) and field practice (warm).

- **Primary Color**: Deep Academic Blue `oklch(0.45 0.12 250)` - Represents scholarly research, trust, and professionalism
- **Secondary Colors**: Warm Terracotta `oklch(0.62 0.15 35)` for field/practice sections to convey human connection and real-world warmth; Soft Sage `oklch(0.75 0.08 145)` for resource library to suggest growth and sustainability
- **Accent Color**: Vibrant Coral `oklch(0.68 0.18 25)` - Attention-grabbing for CTAs and important notifications
- **Foreground/Background Pairings**:
  - Background (Warm White `oklch(0.98 0.005 85)`): Dark Gray text `oklch(0.25 0.01 250)` - Ratio 13.2:1 ✓
  - Card (Pure White `oklch(1 0 0)`): Dark Gray text `oklch(0.25 0.01 250)` - Ratio 14.8:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.12 250)`): White text `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Secondary (Terracotta `oklch(0.62 0.15 35)`): White text `oklch(1 0 0)` - Ratio 4.6:1 ✓
  - Accent (Coral `oklch(0.68 0.18 25)`): Dark Gray `oklch(0.25 0.01 250)` - Ratio 5.9:1 ✓
  - Muted (Light Gray `oklch(0.95 0.005 250)`): Medium Gray text `oklch(0.50 0.02 250)` - Ratio 7.1:1 ✓

## Font Selection

Typography should balance academic credibility with digital readability - clean sans-serif for UI elements and content hierarchy, with excellent Korean character support.

- **Typographic Hierarchy**:
  - H1 (Section Headers): Noto Sans KR Bold / 32px / -0.02em letter spacing / line-height 1.2
  - H2 (Category Titles): Noto Sans KR SemiBold / 24px / -0.01em / line-height 1.3
  - H3 (Subsection/Card Titles): Noto Sans KR Medium / 18px / normal / line-height 1.4
  - Body (Content): Noto Sans KR Regular / 16px / normal / line-height 1.6
  - Small (Metadata): Noto Sans KR Regular / 14px / normal / line-height 1.5
  - Caption (Labels): Noto Sans KR Medium / 12px / 0.02em / line-height 1.4

## Animations

Animations should feel purposeful and professional - subtle enough to maintain credibility while adding polish that makes interactions feel responsive and delightful.

- **Purposeful Meaning**: Use motion to indicate state changes (group joining), guide attention (new activity in sidebar), and provide feedback (successful upload confirmation)
- **Hierarchy of Movement**: Prioritize feedback animations on primary actions (post submission, resource upload) over decorative animations on passive elements

## Component Selection

- **Components**: 
  - Navigation: Tabs (main menu), Sheet (mobile sidebar), Command (search overlay)
  - Content Display: Card (post previews, resource items, group listings), Separator (section dividers), Badge (tags, categories), Avatar (user profiles)
  - Forms: Form + Input + Textarea (post composition, group creation), Select (category pickers), Checkbox (copyright verification), RadioGroup (license selection)
  - Interactions: Dialog (resource linking modal, join group confirmation), Tooltip (icon explanations), DropdownMenu (user menu, post actions)
  - Feedback: Toast via Sonner (upload success, join request sent), Progress (upload status)
  - Data: ScrollArea (long category lists), Accordion (collapsible sidebar sections)

- **Customizations**: 
  - Custom NavigationCard component for Research/Field topic navigation with icon + title + description + post count
  - Custom ResourceCard with license badge, download count, and inline preview option
  - Custom GroupCard showing online/offline status, meeting schedule, member count, and topic tags

- **States**: 
  - Buttons: Default with subtle shadow → Hover with lift and shadow growth → Active with scale down → Disabled with opacity reduction
  - Cards: Resting with border → Hover with shadow and border color shift → Active/selected with primary border
  - Inputs: Default with gray border → Focus with primary ring and border → Error with destructive border → Success with green accent

- **Icon Selection**: 
  - @phosphor-icons/react: BookOpen (research), Users (field/groups), FileText (resources), Bell (notifications), MagnifyingGlass (search), Plus (create actions), CaretDown (expandable sections), Download (resource actions), ChatCircle (comments), Heart (likes), TrendUp (popular content)

- **Spacing**: 
  - Container padding: px-6 py-4 (desktop), px-4 py-3 (mobile)
  - Card spacing: p-6 gap-4 (content cards), p-4 gap-3 (compact cards)
  - Section spacing: space-y-8 (major sections), space-y-4 (related groups), gap-2 (inline elements)
  - Grid layouts: gap-6 (card grids on desktop), gap-4 (mobile grids)

- **Mobile**: 
  - Stack dual sidebars into collapsible Sheet accessible via hamburger menu
  - Convert main navigation tabs to bottom navigation bar with icons
  - Reduce card grid from 3 columns → 2 columns → 1 column at breakpoints
  - Make resource linking modal full-screen on mobile
  - Simplify group filters to bottom sheet with apply button
