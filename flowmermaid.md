graph TD
    A[User Enters Application] --> B{Authentication Status}
    B -->|Not Authenticated| C[Landing Page]
    B -->|Authenticated| D[Dashboard Home]
    
    C --> C1[Login]
    C --> C2[Register]
    C --> C3[Forgot Password]
    
    C1 --> C1a{Valid Credentials?}
    C1a -->|No| C1b[Show Error]
    C1a -->|Yes| C1c{Onboarding Complete?}
    C1c -->|No| E[Onboarding Flow]
    C1c -->|Yes| D
    
    C2 --> C2a[Create Account]
    C2a --> C2b[Create Tenant]
    C2b --> E
    
    C3 --> C3a[Send Reset Email]
    
    subgraph Onboarding
      E --> E1[Step 1: Tenant Setup]
      E1 --> E2[Step 2: Company Details]
      E2 --> E3[Step 3: User Details]
      E3 --> E3a[Upload Profile Picture]
      E3 --> E4[Step 4: Preferences]
      E4 --> E5[Complete Onboarding]
    end
    
    E5 --> D
    
    D --> F[Fixed Sidebar Navigation]
    D --> G[Main Content Area]
    
    F --> F1[Dashboard]
    F --> F2[Leads]
    F --> F3[Contacts]
    F --> F4[Settings]
    F --> F5[User Profile Dropdown]
    
    F5 --> F5a[Profile]
    F5 --> F5b[Logout]
    F5b --> C
    
    G -->|⌘K Shortcut| H[Command Palette]
    H --> H1[Quick Navigation]
    
    F4 --> I[Settings Tabs]
    I --> I1[Tenant Settings]
    I --> I2[User Management]
    I --> I3[Integrations]
    I --> I4[Appearance]
    
    I4 --> I4a[Dark Mode Toggle]
    
    F1 --> J[Dashboard View]
    J --> J1[Stats Overview]
    J --> J2[Recent Leads]
    
    F2 --> K[Leads Management]
    K --> K1[Lead Table]
    K --> K2[Filter Leads]
    K --> K3[Sort Leads]
    
    F3 --> L[Contacts Management]
    L --> L1[Contacts Table]
    L --> L2[Add Contact]
    L --> L3[Edit Contact]
    L --> L4[Delete Contact]