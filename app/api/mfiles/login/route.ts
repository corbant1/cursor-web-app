import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuthPluginConfig, getAppropriateRedirectUri, generateAuthorizationUri } from '@/lib/mfilesAuth';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.MFILES_BASE_URL;
    const vaultGuid = process.env.MFILES_VAULT_GUID;
    const authConfigName = process.env.MFILES_AUTH_CONFIG_NAME;

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'MFILES_BASE_URL not configured' },
        { status: 500 }
      );
    }

    if (!vaultGuid) {
      return NextResponse.json(
        { error: 'MFILES_VAULT_GUID not configured' },
        { status: 500 }
      );
    }

    // Get any existing mfilesmsm cookie to forward
    const cookieStore = await cookies();
    const existingMfilesmsm = cookieStore.get('mfilesmsm');
    const cookieHeader = existingMfilesmsm ? `mfilesmsm=${existingMfilesmsm.value}` : undefined;

    // Fetch OAuth plugin configuration
    const { plugin: oauthPlugin, mfilesmsmCookie } = await getOAuthPluginConfig(baseUrl, cookieHeader);

    // Generate state and store in HTTP-only cookie
    const state = randomUUID();
    const redirectUri = getAppropriateRedirectUri(oauthPlugin);

    // Store state, vault GUID, and auth config in cookies
    const response = NextResponse.redirect(
      generateAuthorizationUri(oauthPlugin, state, redirectUri),
      { status: 307 }
    );

    // Set HTTP-only cookies
    response.cookies.set('mfiles_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    response.cookies.set('mfiles_vault_guid', vaultGuid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7, // 7 days
    });

    if (authConfigName) {
      response.cookies.set('mfiles_auth_config', authConfigName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 7, // 7 days
      });
    }

    // Store mfilesmsm cookie if present (Multi-Server Mode)
    if (mfilesmsmCookie) {
      response.cookies.set('mfilesmsm', mfilesmsmCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate login' },
      { status: 500 }
    );
  }
}
