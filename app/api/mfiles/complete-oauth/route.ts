import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getOAuthPluginConfig,
  getAppropriateRedirectUri,
  getTokenEndpoint,
  getClientId,
  getClientSecret,
  getScope,
  getResource,
  getSiteRealm,
  extractMfilesmsmCookie,
} from '@/lib/mfilesAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { redirectUrl } = body;

    if (!redirectUrl || typeof redirectUrl !== 'string') {
      return NextResponse.json(
        { error: 'redirectUrl is required' },
        { status: 400 }
      );
    }

    // Parse the redirect URL to extract code and state
    const url = new URL(redirectUrl);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code found in URL' },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { error: 'No state parameter found in URL' },
        { status: 400 }
      );
    }

    // Validate state matches cookie
    const cookieStore = await cookies();
    const storedState = cookieStore.get('mfiles_oauth_state');

    if (!storedState || storedState.value !== state) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    // Clear the state cookie (one-time use)
    const baseUrl = process.env.MFILES_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'MFILES_BASE_URL not configured' },
        { status: 500 }
      );
    }

    // Get mfilesmsm cookie to forward
    const existingMfilesmsm = cookieStore.get('mfilesmsm');
    const cookieHeader = existingMfilesmsm ? `mfilesmsm=${existingMfilesmsm.value}` : undefined;

    // Fetch OAuth plugin configuration again
    const { plugin: oauthPlugin, mfilesmsmCookie: mfilesmsmFromConfig } = await getOAuthPluginConfig(baseUrl, cookieHeader);
    const redirectUri = getAppropriateRedirectUri(oauthPlugin);
    const tokenEndpoint = getTokenEndpoint(oauthPlugin);
    const clientId = getClientId(oauthPlugin);
    const siteRealm = getSiteRealm(oauthPlugin);
    const clientSecret = getClientSecret();

    // Build token request body
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    });

    // Add client_id with @SiteRealm if needed
    if (siteRealm) {
      tokenParams.append('client_id', `${clientId}@${siteRealm}`);
    } else {
      tokenParams.append('client_id', clientId);
    }

    tokenParams.append('client_secret', clientSecret);

    // Add optional scope and resource
    const scope = getScope(oauthPlugin);
    if (scope) {
      tokenParams.append('scope', scope);
    }

    const resource = getResource(oauthPlugin);
    if (resource) {
      tokenParams.append('resource', resource);
    }

    // Call token endpoint
    const tokenHeaders: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (cookieHeader) {
      tokenHeaders['Cookie'] = cookieHeader;
    }

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: tokenHeaders,
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.json(
        { error: 'Token exchange failed', details: errorText },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in || 3600; // Default to 1 hour

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token in response' },
        { status: 500 }
      );
    }

    // Handle Multi-Server Mode: capture mfilesmsm cookie from response
    // Prefer the one from token response, fall back to config response
    const setCookieHeader = tokenResponse.headers.get('set-cookie');
    let mfilesmsmValue = extractMfilesmsmCookie(setCookieHeader);
    if (!mfilesmsmValue && mfilesmsmFromConfig) {
      mfilesmsmValue = mfilesmsmFromConfig;
    }

    // Build response
    const response = NextResponse.json({ ok: true });

    // Clear state cookie
    response.cookies.delete('mfiles_oauth_state');

    // Store access token
    response.cookies.set('mfiles_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
    });

    // Store refresh token if provided
    if (refreshToken) {
      response.cookies.set('mfiles_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30, // 30 days
      });
    }

    // Store mfilesmsm cookie if present
    if (mfilesmsmValue) {
      response.cookies.set('mfilesmsm', mfilesmsmValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('Complete OAuth error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete OAuth flow' },
      { status: 500 }
    );
  }
}

