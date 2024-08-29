export interface jwt {
    sub: string; // Subject (usually the user ID)
    name: string; // User name
    email: string; // User email
    roles: string[]; // User roles
    exp: number; // Expiration time (Unix timestamp)
    iat: number; // Issued at time (Unix timestamp)
    // Add other claims as needed
  }