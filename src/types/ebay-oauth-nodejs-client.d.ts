declare module 'ebay-oauth-nodejs-client' {
  interface EbayAuthTokenOptions {
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
  }

  class EbayAuthToken {
    constructor(options: EbayAuthTokenOptions);
    
    getApplicationToken(environment: 'PRODUCTION' | 'SANDBOX', scope: string): Promise<string>;
    
    generateUserAuthorizationUrl(
      environment: 'PRODUCTION' | 'SANDBOX', 
      scopes: string[], 
      options?: { prompt?: string; state?: string }
    ): string;
    
    exchangeCodeForAccessToken(
      environment: 'PRODUCTION' | 'SANDBOX', 
      code: string
    ): Promise<string>;
    
    getAccessToken(
      environment: 'PRODUCTION' | 'SANDBOX', 
      refreshToken: string, 
      scopes: string[]
    ): Promise<string>;
  }

  export = EbayAuthToken;
} 