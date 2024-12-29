# Next.js Maintenance Management System

A comprehensive Next.js application for managing equipment and maintenance records, with PostgreSQL (Vercel-hosted), Prisma ORM, Zod for validation, TanStack Query for data fetching, Tailwind CSS for styling, and Chart.js for data visualization.

## Features

- **Equipment Management**: Track equipment details, status, and maintenance history
- **Maintenance Records**: Log maintenance activities, parts replaced, and technician details
- **Priority and Completion Status**: Prioritize and monitor maintenance tasks
- **Data Visualization**: Interactive charts for insights

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, TanStack Query, Chart.js
- **Backend**: Prisma ORM
- **Database**: PostgreSQL (Vercel-hosted)
- **Validation**: Zod

## Database Schema

## Enums
```
Department (
    Machining
    Assembly
    Packaging
    Shipping
)

Status (
    Operational
    Down
    Maintenance
    Retired
)

MaintenanceType (
    Preventive
    Repair
    Emergency
)

Priority (
    Low
    Medium
    High
)

CompletionStatus (
    Complete
    Incomplete
    PendingParts
)
```

## Tables
```
Equipment (
    id                 String @id @default(cuid())
    name               String
    location           String
    department         Department
    model             String
    serialNumber      String
    installDate       DateTime
    status            Status
    createdAt         DateTime @default(now())
    updatedAt         DateTime? @updatedAt
)

MaintenanceRecord (
    id                String @id @default(cuid())
    equipmentId       String
    date              DateTime
    type              MaintenanceType
    technician        String
    hoursSpent        Int
    description       String
    priority          Priority
    completionStatus  CompletionStatus
)

PartsReplaced (
    id                String @id @default(cuid())
    maintenanceId     String
    name              String
)
```


## Relationships

- **Equipment to MaintenanceRecord**: One-to-Many
  - One piece of equipment can have multiple maintenance records
  - Each maintenance record belongs to one piece of equipment

- **MaintenanceRecord to PartsReplaced**: One-to-Many
  - One maintenance record can have multiple replaced parts
  - Each replaced part belongs to one maintenance record

## Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/Reeyas13/cms.git
cd cms
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set up Environment Variables**
Create a `.env` file with the following variables:
```env
DATABASE_URL="your-postgres-connection-string"
```

4. **Initialize Database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run Development Server**
```bash
npm run dev
```

## Database Management

### Prisma Commands
- Generate Prisma Client: `npx prisma generate`
- Push Schema Changes: `npx prisma db push`
- Reset Database: `npx prisma db reset`
- Open Prisma Studio: `npx prisma studio`




This project is licensed under the MIT License - see the LICENSE.md file for details