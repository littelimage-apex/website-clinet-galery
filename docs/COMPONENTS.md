# Component Documentation

## UI Components (`/src/components/ui/`)

### Button

A versatile button component with multiple variants.

```tsx
import { Button } from '@/components/ui'

// Primary button
<Button variant="primary">Click Me</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Learn More</Button>

// Sage (success/download) button
<Button variant="sage">Download All</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'sage'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Show loading spinner |

### Input

Text input with label and error handling.

```tsx
import { Input } from '@/components/ui'

<Input
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  error="Invalid email address"
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text displayed above input |
| `error` | `string` | Error message displayed below input |
| All standard `<input>` props | - | Passed through to underlying element |

### Textarea

Multi-line text input.

```tsx
import { Textarea } from '@/components/ui'

<Textarea
  label="Notes for the Editor"
  placeholder="Any special requests..."
  rows={4}
/>
```

### Card

Container component with variants.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Session Details</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View Gallery</Button>
  </CardFooter>
</Card>
```

**Card Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Card style |

---

## Landing Components (`/src/components/landing/`)

### Hero

Full-width hero section with headline and CTA.

```tsx
import Hero from '@/components/landing/Hero'

<Hero />
```

Features:
- Large headline: "Capturing life's most precious beginnings"
- Subtext with value proposition
- "Client Portal" button linking to `/login`
- Background with soft gradient

### PortfolioGrid

Expandable masonry grid for portfolio display.

```tsx
import PortfolioGrid from '@/components/landing/PortfolioGrid'

<PortfolioGrid />
```

Features:
- Initial display: 8 images
- "View Full Portfolio" button expands in-place
- Masonry layout (2-4 columns responsive)
- Image hover effect (scale 1.05 + shadow)
- Uses placeholder images from picsum.photos

### PricingCards

Three-tier pricing display.

```tsx
import PricingCards from '@/components/landing/PricingCards'

<PricingCards />
```

Packages:
| Package | Photos | Description |
|---------|--------|-------------|
| Mini Session | 5 | Perfect for milestone moments |
| Classic | 10 | Our most popular package |
| Premium | 20 | The complete experience |

### ContactForm

Simple contact form section.

```tsx
import ContactForm from '@/components/landing/ContactForm'

<ContactForm />
```

Fields:
- Name
- Email
- Message
- Submit button

---

## Portal Components (`/src/components/portal/`)

### Sidebar

Permanent left sidebar for project navigation.

```tsx
import Sidebar from '@/components/portal/Sidebar'

<Sidebar projects={projects} currentProjectId={id} />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `projects` | `Project[]` | List of user's projects |
| `currentProjectId` | `string?` | Currently active project |

Features:
- Logo at top
- Project list with stage badges
- User menu at bottom
- Logout functionality

### ProjectCard

Card displaying project summary.

```tsx
import ProjectCard from '@/components/portal/ProjectCard'

<ProjectCard project={project} />
```

Displays:
- Child name
- Occasion
- Session date
- Current stage badge
- Selection progress

### StageBadge

Visual indicator for project stage.

```tsx
import StageBadge from '@/components/portal/StageBadge'

<StageBadge stage={1} />  // "Choosing your favorites"
<StageBadge stage={2} />  // "In the darkroom"
<StageBadge stage={3} />  // "Ready to cherish"
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `stage` | `1 \| 2 \| 3` | Current project stage |

---

## Gallery Components (`/src/components/gallery/`)

### SelectionGallery

Stage 1 gallery for image selection.

```tsx
import SelectionGallery from '@/components/gallery/SelectionGallery'

<SelectionGallery
  project={project}
  images={images}
  onSubmit={handleSubmit}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `project` | `Project` | Current project data |
| `images` | `string[]` | List of image filenames |
| `onSubmit` | `() => void` | Callback when selection submitted |

Features:
- Grid of watermarked previews
- Click to toggle selection
- Floating selection counter
- Enforces `package_limit`
- Click image to open modal for notes
- "Submit Selection" button

### ReviewGallery

Stage 2 gallery for reviewing edited images.

```tsx
import ReviewGallery from '@/components/gallery/ReviewGallery'

<ReviewGallery
  project={project}
  images={images}
  onApproveAll={handleApproveAll}
/>
```

Features:
- Grid of edited versions
- Shows revision status per image
- Click to open review modal
- "Approve All" button

### DeliveryView

Stage 3 view for final image download.

```tsx
import DeliveryView from '@/components/gallery/DeliveryView'

<DeliveryView project={project} images={images} />
```

Features:
- Celebratory header
- Grid of final high-res images
- "Download All" button
- Individual download buttons
- Thank you message

### ImageCard

Individual image in gallery grid.

```tsx
import ImageCard from '@/components/gallery/ImageCard'

<ImageCard
  src={imageUrl}
  filename={filename}
  isSelected={selected}
  onSelect={() => toggleSelect(filename)}
  onClick={() => openModal(filename)}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Image URL |
| `filename` | `string` | Image filename |
| `isSelected` | `boolean` | Selection state |
| `onSelect` | `() => void` | Toggle selection callback |
| `onClick` | `() => void` | Open modal callback |

### ImageModal

Focused view modal for image details.

```tsx
import ImageModal from '@/components/gallery/ImageModal'

<ImageModal
  isOpen={isOpen}
  image={selectedImage}
  onClose={() => setIsOpen(false)}
  onSave={handleSave}
/>
```

Stage 1 features:
- Large image view
- "Face Swap" toggle
- "Notes for the Editor" textarea
- Save button

Stage 2 features:
- Version comparison
- Revision thread
- Feedback input
- Approve/Request Revision buttons

### SelectionCounter

Floating counter showing selection progress.

```tsx
import SelectionCounter from '@/components/gallery/SelectionCounter'

<SelectionCounter selected={7} limit={10} />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `selected` | `number` | Currently selected count |
| `limit` | `number` | Maximum allowed selections |

### RevisionThread

Conversation-style revision history.

```tsx
import RevisionThread from '@/components/gallery/RevisionThread'

<RevisionThread revisions={revisions} />
```

Features:
- Message bubbles for each revision
- Client messages on right (lavender)
- Editor notes on left (cream)
- Timestamps

---

## Admin Components (`/src/components/admin/`)

### ProjectsTable

Overview table of all projects.

```tsx
import ProjectsTable from '@/components/admin/ProjectsTable'

<ProjectsTable projects={allProjects} />
```

Columns:
- Client Name
- Child Name
- Occasion
- Stage (with badge)
- Selection Progress (visual bar)
- Status
- Last Updated

### ProgressBar

Visual progress indicator.

```tsx
import ProgressBar from '@/components/admin/ProgressBar'

<ProgressBar current={8} total={10} />
```

### StatsCards

Quick stats overview.

```tsx
import StatsCards from '@/components/admin/StatsCards'

<StatsCards stats={dashboardStats} />
```

Shows:
- Total active projects
- Projects per stage
- Completed this month
