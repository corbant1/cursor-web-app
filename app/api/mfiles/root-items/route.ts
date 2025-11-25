import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('mfiles_access_token');
    const vaultGuid = cookieStore.get('mfiles_vault_guid');
    const authConfig = cookieStore.get('mfiles_auth_config');
    const mfilesmsm = cookieStore.get('mfilesmsm');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.MFILES_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'MFILES_BASE_URL not configured' },
        { status: 500 }
      );
    }

    if (!vaultGuid) {
      return NextResponse.json(
        { error: 'Vault GUID not found' },
        { status: 500 }
      );
    }

    // Build headers
    const headers: HeadersInit = {
      Authorization: `Bearer ${accessToken.value}`,
      'X-Vault': vaultGuid.value,
    };

    if (authConfig) {
      headers['X-AuthConfig'] = authConfig.value;
    }

    // Add mfilesmsm cookie if present (for Multi-Server Mode)
    if (mfilesmsm) {
      headers['Cookie'] = `mfilesmsm=${mfilesmsm.value}`;
    }

    // Call M-Files REST API for root items
    const apiUrl = `${baseUrl}/REST/objects`;
    const response = await fetch(apiUrl, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('M-Files API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch root items', details: errorText },
        { status: response.status }
      );
    }

    // Check for mfilesmsm cookie in response and update if needed
    const setCookieHeader = response.headers.get('set-cookie');
    const data = await response.json();

    const result = NextResponse.json(data);

    // Update mfilesmsm cookie if present in response
    if (setCookieHeader) {
      const mfilesmsmMatch = setCookieHeader.match(/mfilesmsm=([^;]+)/);
      if (mfilesmsmMatch) {
        result.cookies.set('mfilesmsm', mfilesmsmMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 86400 * 7, // 7 days
        });
      }
    }

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get root items';
    console.error('Get root items error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

