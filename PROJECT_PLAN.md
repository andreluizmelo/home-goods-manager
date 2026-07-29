# Home Goods Inventory Manager - Project Plan

## Project Overview

A web-based inventory management system for household goods tracking, enabling users to monitor product quantities, expiration dates, consumption timelines, and purchase history. Multi-user SaaS platform with authentication, recipe integration, and intelligent notifications.

**Tech Stack:** Next.js, React, TypeScript, PostgreSQL, Docker, LocalStack  
**Authentication:** Multi-tenant with per-user data isolation  
**Testing:** Jest + React Testing Library, 80%+ coverage enforced via pre-commit hooks  
**Deployment:** Local Docker development, cloud-ready architecture

---

## Core Data Model

### 1. **Products** (Master Catalog)
Represents the definition/template for a product class.

```
Product
├── id (UUID)
├── userId (FK to User)
├── name (string) - e.g., "All-Purpose Flour"
├── category (enum: Food, Meat, Cleaning, Dairy, etc.)
├── shelf_life_days (int, optional) - unopened expiration in days from purchase
├── opened_shelf_life_days (int, optional) - consumption deadline after opened
├── unit_type (enum: pieces, grams, ml, liters, kg, etc.)
├── productGroup (FK, optional) - for grouping substitutes
├── brand (string, optional)
├── barcode (string, optional)
├── notes (text, optional)
├── created_at, updated_at
└── is_archived (boolean)

ProductGroup
├── id (UUID)
├── userId (FK)
├── name (string) - e.g., "Flour" (groups all flour brands)
├── category (string)
└── notes (text, optional)
```

### 2. **Inventory** (Instances)
Individual units in storage.

```
InventoryItem
├── id (UUID)
├── userId (FK)
├── productId (FK to Product)
├── quantity (int) - count of unopened instances
├── purchase_date (date)
├── expiration_date (date)
├── purchase_price (decimal, optional)
├── opened_instances (array/relation) - linked to OpenedInstance
├── location (string, optional) - e.g., "Kitchen Cabinet", "Freezer"
├── notes (text, optional)
├── created_at, updated_at
└── is_consumed (boolean) - logical delete marker

OpenedInstance
├── id (UUID)
├── inventoryItemId (FK)
├── opened_date (date)
├── opened_shelf_life_deadline (date - calculated from opened_date + product.opened_shelf_life_days)
├── quantity_remaining (enum: Full/AlmostFull, Half, AlmostEmpty, Empty - qualitative)
├── notes (text, optional)
└── consumption_logs (array/relation)

ConsumptionLog
├── id (UUID)
├── userId (FK)
├── inventoryItemId (FK, optional) - set when consuming whole unit(s) directly, no opened state needed
├── openedInstanceId (FK, optional) - set when consuming part of an already-opened item
├── recipeMakingId (FK, optional) - set when this consumption happened while making a recipe
├── consumed_date (date)
├── quantity_type (enum: Whole, Qualitative)
├── quantity_whole (int, optional) - e.g. "used 2 whole units"
├── qualitative_amount (enum, optional: ALittle, Some, Half, Most, All)
├── measured_amount + measured_unit (decimal + string, optional) - for users who want precision (grams, ml)
└── notes (text, optional)
```
Exactly one of `inventoryItemId` / `openedInstanceId` is set on a given log. This single table replaces the earlier separate `ProductUsageEntry` concept — recipe-driven consumption and everyday consumption are the same event, just optionally tagged with a `recipeMakingId`.

### 3. **Products + Recipes**

```
Recipe
├── id (UUID)
├── userId (FK)
├── name (string) - e.g., "Bread Dough"
├── description (text, optional)
├── instructions (text, optional)
├── yield_description (string) - e.g., "2 loaves"
├── recipe_ingredients (array/relation)
├── created_at, updated_at
└── is_archived (boolean)

RecipeIngredient
├── id (UUID)
├── recipeId (FK)
├── productId (FK)
├── quantity_description (enum: Little, One, Few, Multiple, Custom + optional custom text)
└── notes (text, optional)

RecipeMaking
├── id (UUID)
├── userId (FK)
├── recipeId (FK)
├── made_date (date)
├── consumption_logs (array/relation) - see ConsumptionLog above, tagged via recipeMakingId
└── notes (text, optional)
```

### 4. **Shopping & Pricing**

```
ShoppingList
├── id (UUID)
├── userId (FK)
├── name (string)
├── list_type (enum: Shopping, Cart)
├── items (array/relation)
├── created_at, updated_at
└── status (enum: Active, Completed, Archived)

ShoppingListItem
├── id (UUID)
├── shoppingListId (FK)
├── productId (FK, optional)
├── custom_item_name (string, optional) - for items not yet in Product DB
├── planned_quantity (int)
├── planned_price_unit (decimal, optional)
├── estimated_total_price (decimal, optional)
├── is_purchased (boolean)
└── notes (text, optional)

PriceHistory
├── id (UUID)
├── productId (FK)
├── userId (FK)
├── price_unit (decimal)
├── currency (string - default USD)
├── purchase_date (date)
├── store (string, optional)
└── notes (text, optional)
```

### 5. **Notifications & Alerts**

```
NotificationPreference
├── id (UUID)
├── userId (FK)
├── notification_type (enum: ExpiringFood, OpenedExpiring, LowStock)
├── days_before_expiry (int) - e.g., 3 days before expiration
├── is_enabled (boolean)
└── delivery_method (enum: InApp, Email - future: SMS)
```

No persisted alert/queue table for now. Since background workers are out of scope until a later phase, expiration urgency is computed on the fly at render time (dashboard/inventory page load) using `NotificationPreference` thresholds and each item's expiration/opened-deadline date. An `ExpirationAlert`-style table (with dismiss state, delivery tracking) can be introduced later if email/push notifications are built.

### 6. **Users**

```
User
├── id (UUID)
├── email (string, unique)
├── password_hash (string)
├── name (string)
├── household_name (string, optional) - e.g., "Smith Household"
├── preferences (JSON)
├── created_at, updated_at
└── is_active (boolean)
```

---

## Feature Breakdown

### Phase 1: MVP (Core Inventory)
1. ✅ User authentication (sign up, login)
2. ✅ Product CRUD (create, read, update, delete, archive)
3. ✅ Inventory Item management (add unopened instances)
4. ✅ Dashboard: expiring soon list
5. ✅ Basic notification preferences
6. ✅ Product grouping (substitutes)

### Phase 2: Enhanced Tracking
1. ✅ Opened instance tracking (mark as opened, qualitative remaining qty)
2. ✅ Consumption logging (track usage over time)
3. ✅ Opened shelf-life deadline calculation & alerts
4. ✅ Inventory item locations
5. ✅ Search & filtering by category, expiration, status

### Phase 3: Recipes & Meal Planning
1. ✅ Recipe creation & management
2. ✅ Recipe ingredient mapping with quantity descriptions
3. ✅ Recipe making workflow (select items, mark as consumed/opened)
4. ✅ Batch product consumption from recipe

### Phase 4: Shopping & Pricing
1. ✅ Price history per product
2. ✅ Shopping list creation
3. ✅ Cart functionality with price previews
4. ✅ Price comparison & alerts (vs. historical average)
5. ✅ Product suggestions based on low stock

### Phase 5: Advanced (Future)
1. ⏳ Multi-household sharing (shared inventory)
2. ⏳ Email/SMS notifications (via 3rd party services)
3. ⏳ Barcode scanning (mobile app)
4. ⏳ Automated reorder suggestions
5. ⏳ Household member roles & permissions

---

## Architecture Overview

### Frontend Architecture
```
Next.js App (App Router)
├── /app
│   ├── auth/ (login, signup, forgot password)
│   ├── dashboard/ (main inventory view)
│   ├── products/ (product management)
│   ├── inventory/ (inventory instances)
│   ├── recipes/ (recipe management & making)
│   ├── shopping/ (lists & carts)
│   ├── settings/ (notifications, preferences)
│   └── layout.tsx (auth middleware, navigation)
├── /components
│   ├── ProductForm
│   ├── InventoryList
│   ├── OpenedInstanceModal
│   ├── ExpirationAlert
│   ├── RecipeMaker
│   └── ShoppingCart
├── /hooks
│   ├── useAuth
│   ├── useProducts
│   ├── useInventory
│   ├── useRecipes
│   └── useNotifications
├── /lib
│   ├── api/ (client-side API wrappers)
│   ├── utils/ (date calculations, formatting)
│   └── db/ (Prisma client)
└── /styles
```

### Backend API (Next.js API Routes)
```
/api
├── auth/
│   ├── register
│   ├── login
│   ├── logout
│   └── session
├── products/
│   ├── [id] (GET, PUT, DELETE)
│   ├── (POST for create)
│   └── /groups (product group management)
├── inventory/
│   ├── [id] (GET, PUT, DELETE)
│   ├── (POST for create)
│   └── /opened-instances (opened tracking)
├── recipes/
│   ├── [id] (GET, PUT, DELETE)
│   ├── (POST for create)
│   └── /makings (recipe making logs)
├── shopping/
│   ├── lists/[id]
│   └── price-history
└── notifications/
    ├── preferences
    └── alerts
```

### Database
- **PostgreSQL** (primary)
- **Prisma ORM** (type-safe queries)
- **LocalStack DynamoDB** (optional: for future notification queue)

### Authentication
- **NextAuth.js v5** or **Supabase Auth**
- JWT-based session management
- Role: User (basic) - extensible for future household members

---

## Technical Implementation Details

### 1. Expiration Date Logic
- **Unopened products:** Use `expiration_date` from InventoryItem
- **Opened products:** Calculate deadline = `opened_date + product.opened_shelf_life_days`
- **Alert threshold:** Configurable via NotificationPreference (default 3 days)
- **Alert dismissed:** Soft flag to avoid re-notifying

### 2. Quantity Tracking
- **Unopened:** Simple integer count
- **Opened:** Qualitative enum (Full, Half, AlmostEmpty, Empty)
- **Consumed:** Update consumption logs, don't hard delete
- **Recipe usage:** Update both inventory & opened instance records

### 3. Product Grouping Strategy
- ProductGroup.id links substitute products
- UI shows "Flour (Brand A, Brand B available)" when viewing inventory
- Shopping list can suggest "any flour" or specific brand
- Recipes reference generic Product, but user selects specific brand when making

### 4. Price History
- Store per-purchase price (unitprice) in PriceHistory
- Calculate average/median historical price
- Shopping cart alerts if planned_price > (average + 10%) or similar logic
- Trend graph showing price over time

### 5. Recipe Making Workflow
```
1. User selects recipe
2. System shows ingredients needed
3. User selects which specific inventory items to use
4. If multiple unopened instances available → prompt to choose
5. User indicates if opening an unopened package
6. User logs consumption (qualitative for opened instances)
7. System updates inventory & consumption logs
```

---

## Database Schema (Prisma)

Key models in `prisma/schema.prisma`:
- `User` (authentication & ownership)
- `Product` (definitions with shelf-life rules)
- `ProductGroup` (grouping substitutes)
- `InventoryItem` (owned quantity + expiry date)
- `OpenedInstance` (tracking opened items & consumption)
- `ConsumptionLog` (historical usage)
- `Recipe` & `RecipeIngredient`
- `RecipeMaking` & `ProductUsageEntry`
- `ShoppingList` & `ShoppingListItem`
- `PriceHistory`
- `NotificationPreference` & `ExpirationAlert`

All models include:
- `id` (UUID primary key)
- `userId` (foreign key for multi-tenancy)
- `createdAt` / `updatedAt` timestamps
- Soft deletes where appropriate (`isArchived` boolean)

---

## Development Setup

### Local Environment
```bash
# Docker Compose includes:
- PostgreSQL (port 5432)
- LocalStack (port 4566) - for future AWS services
- Next.js dev server (port 3000)
- pgAdmin (port 5050) - optional for DB management
```

### Environment Variables
```
DATABASE_URL=postgresql://user:password@localhost:5432/home_goods_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
LOCALSTACK_ENDPOINT=http://localhost:4566
NODE_ENV=development
```

### Pre-commit Hooks
- Run `yarn lint-staged` (ESLint on staged files, Prisma format + validate on the schema)
- Run `yarn type-check` (TypeScript)
- Run `yarn test` (Jest with coverage threshold: 80%)

### Testing Strategy
- **Unit tests:** Individual components, hooks, utilities (target: 80%)
- **Integration tests:** API routes with mocked DB (Prisma mock)
- **E2E tests:** Critical workflows (login, add inventory, consume item)
- **Test structure:** `__tests__` folder alongside source files

---

## UI/Design Considerations (For Claude Design Input)

### Key Screens/Views

1. **Dashboard/Home**
   - Expiring items widget (sorted by urgency)
   - Quick stats (total items, opened items, recipes made this week)
   - Recent activity feed
   - Quick actions: Add item, Create recipe, Go shopping

2. **Products List**
   - Search, filter by category
   - View product details (shelf-life rules, current inventory count)
   - CRUD actions
   - Grouping view (show substitute products together)

3. **Inventory View**
   - List grouped by expiration date (danger, warning, safe)
   - Filter: category, status (unopened/opened/consumed), location
   - Item card: name, quantity, expiry date, opened status
   - Quick actions: mark as opened, consume, delete

4. **Opened Instance Detail**
   - Item name, opened date, deadline date
   - Qualitative quantity selector (radio buttons: Full, Half, Almost Empty, Empty)
   - Consumption log (dates used)
   - Days until deadline badge (color-coded)

5. **Recipe Management**
   - Recipe list with yield info
   - Recipe detail: ingredients, instructions
   - "Make recipe" action → workflow modal

6. **Recipe Making Workflow**
   - Ingredient checklist (select from available inventory)
   - If multiple unopened options → dropdown to choose
   - Mark as opened? (toggle per ingredient)
   - Consumption log entries
   - Confirm & save

7. **Shopping List**
   - List name, type (shopping/cart)
   - Items with quantity, unit price, total
   - Checkbox for purchased items
   - Price total with comparison to historical average
   - Export/print option

8. **Settings**
   - Notification preferences (enable/disable, days before expiry)
   - Household name
   - Default units/preferences
   - Account management

### Design System Tokens
- **Colors:** Primary (teal/green for "fresh"), Warning (orange for "expiring"), Danger (red for "expired")
- **Typography:** Clean, readable for quick scanning
- **Spacing:** Generous whitespace for mobile usability (responsive design)
- **Components:** Card-based layout, modal for complex workflows
- **Accessibility:** WCAG 2.1 AA compliant

---

## Development Phases & Milestones

### Week 1-2: Project Setup & Auth
- [ ] Project scaffolding (Next.js, Prisma, TypeScript setup)
- [ ] Docker Compose configuration
- [ ] Database schema design & migrations
- [ ] Authentication implementation (NextAuth.js)
- [ ] Basic layout & navigation
- [ ] Tests: Auth routes, middleware

### Week 3-4: Core Inventory (Phase 1)
- [ ] Product CRUD (API + UI)
- [ ] Product grouping UI
- [ ] Inventory Item CRUD (unopened instances)
- [ ] Expiration date calculations
- [ ] Dashboard with expiring items widget
- [ ] Tests: 70%+ coverage on API routes

### Week 5-6: Opened Tracking (Phase 2)
- [ ] Opened instance tracking (mark as opened)
- [ ] Qualitative quantity selector UI
- [ ] Consumption logging
- [ ] Opened shelf-life deadline calculation & alerts
- [ ] Search & filtering
- [ ] Tests: 75%+ coverage

### Week 7-8: Recipes (Phase 3)
- [ ] Recipe CRUD
- [ ] Recipe ingredient mapping
- [ ] Recipe making workflow
- [ ] Batch product consumption
- [ ] Tests: 78%+ coverage

### Week 9-10: Shopping & Pricing (Phase 4)
- [ ] Price history tracking
- [ ] Shopping list/cart creation
- [ ] Price comparison & alerts
- [ ] Tests: 80%+ coverage target

### Week 11-12: Polish & Testing
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] UI/UX refinement
- [ ] Documentation
- [ ] Final coverage audit (80%+ enforced)

---

## API Response Examples

### Get Inventory (with expiration status)
```json
{
  "data": [
    {
      "id": "uuid1",
      "product": { "name": "All-Purpose Flour", "category": "Food" },
      "quantity": 3,
      "expirationDate": "2026-08-15",
      "purchaseDate": "2026-07-15",
      "purchasePrice": 3.99,
      "openedInstances": [
        {
          "id": "opened1",
          "openedDate": "2026-07-20",
          "deadlineDate": "2026-07-25",
          "quantityRemaining": "Half",
          "daysUntilDeadline": 2,
          "urgency": "high"
        }
      ],
      "status": "expiring_soon",
      "location": "Kitchen Cabinet"
    }
  ]
}
```

### Create Recipe Making
```json
{
  "recipeId": "recipe1",
  "usedItems": [
    {
      "inventoryItemId": "inv1",
      "quantityUsed": "Few",
      "markedAsOpened": true
    },
    {
      "openedInstanceId": "opened2",
      "quantityUsed": "Half"
    }
  ],
  "notes": "Made 2 loaves for freezer"
}
```

---

## Security Considerations

1. **Multi-tenancy:** All queries filtered by `userId`
2. **Authentication:** JWT tokens, secure httpOnly cookies
3. **Authorization:** Row-level security via userId checks
4. **Data Validation:** Zod/Yup for input validation
5. **XSS Prevention:** React escaping, no dangerouslySetInnerHTML
6. **CSRF Protection:** NextAuth.js built-in CSRF tokens
7. **SQL Injection:** Prisma parameterized queries only
8. **Password:** Bcrypt hashing, minimum 8 characters

---

## Future Enhancements

- Multi-household sharing with role-based access
- Mobile app (React Native/Expo)
- Barcode scanning for quick inventory addition
- AI-powered recipe suggestions based on available items
- Price comparison with nearby stores (if store location added)
- Automatic reorder reminders for regularly consumed items
- Export inventory as PDF/CSV
- Dark mode support
- Internationalization (i18n) for multiple languages

---

## Success Criteria

- ✅ MVP deploys locally via Docker
- ✅ All pages responsive (mobile, tablet, desktop)
- ✅ Unit test coverage: 80%+ enforced via pre-commit
- ✅ Authentication working with user data isolation
- ✅ Core workflows (add item, consume, make recipe) tested E2E
- ✅ No critical bugs in MVP features
- ✅ Code documented with JSDoc comments on complex functions
