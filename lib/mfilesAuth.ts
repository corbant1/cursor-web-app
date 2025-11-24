/**
 * M-Files OAuth Helper Functions
 * Based on the Python oauth_helpers module logic
 */

export interface OAuthPlugin {
  AssemblyName: string;
  Name: string;
  Configuration: {
    ClientID?: string;
    ClientSecret?: string;
    AuthorizationEndpoint?: string;
    TokenEndpoint?: string;
    RedirectUri?: string;
    RedirectURI?: string;
    RedirectURIForNative?: string;
    RedirectURIForMobile?: string;
    RedirectURIForWeb?: string;
    RedirectURIForWOPI?: string;
    Scope?: string;
    Resource?: string;
    SiteRealm?: string;
  };
}

/**
 * Check if a plugin is the OAuth plugin
 */
export function isOAuthPlugin(plugin: any): plugin is OAuthPlugin {
  return plugin?.AssemblyName === 'MFiles.AuthenticationProviders.OAuth';
}

/**
 * Get the appropriate redirect URI from plugin configuration
 * Mirrors the Python helper logic
 * Order: RedirectUri, RedirectURI, RedirectURIForNative, RedirectURIForMobile, RedirectURIForWeb, RedirectURIForWOPI
 */
export function getAppropriateRedirectUri(plugin: OAuthPlugin): string {
  const config = plugin.Configuration;
  
  // Try in order of preference (matching Python implementation)
  if (config.RedirectUri) return config.RedirectUri;
  if (config.RedirectURI) return config.RedirectURI;
  if (config.RedirectURIForNative) return config.RedirectURIForNative;
  if (config.RedirectURIForMobile) return config.RedirectURIForMobile;
  if (config.RedirectURIForWeb) return config.RedirectURIForWeb;
  if (config.RedirectURIForWOPI) return config.RedirectURIForWOPI;
  
  // Fallback
  return 'http://localhost';
}

/**
 * Generate authorization URI
 */
export function generateAuthorizationUri(
  plugin: OAuthPlugin,
  state: string,
  redirectUri: string
): string {
  const config = plugin.Configuration;
  const authEndpoint = config.AuthorizationEndpoint;
  
  if (!authEndpoint) {
    throw new Error('AuthorizationEndpoint not found in OAuth plugin configuration');
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
  });
  
  // Add client_id (with @SiteRealm if configured)
  const clientId = getClientId(plugin);
  const siteRealm = getSiteRealm(plugin);
  if (siteRealm) {
    params.append('client_id', `${clientId}@${siteRealm}`);
  } else {
    params.append('client_id', clientId);
  }
  
  // Add optional scope and resource
  const scope = getScope(plugin);
  if (scope) {
    params.append('scope', scope);
  }
  
  const resource = getResource(plugin);
  if (resource) {
    params.append('resource', resource);
  }
  
  return `${authEndpoint}?${params.toString()}`;
}

/**
 * Get token endpoint from plugin
 */
export function getTokenEndpoint(plugin: OAuthPlugin): string {
  const endpoint = plugin.Configuration.TokenEndpoint;
  if (!endpoint) {
    throw new Error('TokenEndpoint not found in OAuth plugin configuration');
  }
  return endpoint;
}

/**
 * Get client ID from plugin
 */
export function getClientId(plugin: OAuthPlugin): string {
  const clientId = plugin.Configuration.ClientID;
  if (!clientId) {
    throw new Error('ClientID not found in OAuth plugin configuration');
  }
  return clientId;
}

/**
 * Get client secret (from environment, not plugin config)
 */
export function getClientSecret(): string {
  const secret = process.env.MFILES_CLIENT_SECRET;
  if (!secret) {
    throw new Error('MFILES_CLIENT_SECRET not set in environment');
  }
  return secret;
}

/**
 * Get scope from plugin
 */
export function getScope(plugin: OAuthPlugin): string | undefined {
  return plugin.Configuration.Scope;
}

/**
 * Get resource from plugin
 */
export function getResource(plugin: OAuthPlugin): string | undefined {
  return plugin.Configuration.Resource;
}

/**
 * Get site realm from plugin
 */
export function getSiteRealm(plugin: OAuthPlugin): string | undefined {
  return plugin.Configuration.SiteRealm;
}

/**
 * Result of fetching OAuth plugin configuration
 */
export interface OAuthPluginConfigResult {
  plugin: OAuthPlugin;
  mfilesmsmCookie: string | null;
}

/**
 * Get OAuth plugin configuration from M-Files server
 * Returns both the plugin and any mfilesmsm cookie from the response
 */
export async function getOAuthPluginConfig(
  baseUrl: string,
  cookies?: string
): Promise<OAuthPluginConfigResult> {
  const url = `${baseUrl}/REST/server/authenticationprotocols.aspx`;
  
  const headers: HeadersInit = {};
  if (cookies) {
    headers['Cookie'] = cookies;
  }
  
  const response = await fetch(url, {
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch OAuth config: ${response.statusText}`);
  }
  
  // Capture mfilesmsm cookie if present
  const setCookieHeader = response.headers.get('set-cookie');
  const mfilesmsmCookie = extractMfilesmsmCookie(setCookieHeader);
  
  const plugins: any[] = await response.json();
  
  const oauthPlugin = plugins.find(isOAuthPlugin);
  
  if (!oauthPlugin) {
    throw new Error('No OAuth plugin configured');
  }
  
  return {
    plugin: oauthPlugin as OAuthPlugin,
    mfilesmsmCookie,
  };
}

/**
 * Extract mfilesmsm cookie from Set-Cookie header
 * Handles both single and multiple Set-Cookie headers
 */
export function extractMfilesmsmCookie(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;
  
  // Handle multiple Set-Cookie headers (they may be comma-separated or in an array)
  // First, try to find mfilesmsm directly in the header string
  const mfilesmsmMatch = setCookieHeader.match(/mfilesmsm=([^;,]+)/i);
  if (mfilesmsmMatch) {
    return mfilesmsmMatch[1];
  }
  
  // If not found, try splitting by comma (for multiple cookies)
  // Note: This is a fallback - Set-Cookie headers are typically separated by newlines in raw headers
  // but fetch API may combine them differently
  const cookies = setCookieHeader.split(',').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.toLowerCase().startsWith('mfilesmsm=')) {
      const match = cookie.match(/mfilesmsm=([^;]+)/i);
      return match ? match[1] : null;
    }
  }
  
  return null;
}

