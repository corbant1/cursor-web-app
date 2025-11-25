import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    // Call M-Files REST API
    // Try without .aspx first, as some M-Files versions use different endpoint formats
    let apiUrl = `${baseUrl}/REST/server/currentuser`;
    let response = await fetch(apiUrl, {
      headers,
    });
    
    // If that fails, try with .aspx
    if (!response.ok && response.status === 404) {
      apiUrl = `${baseUrl}/REST/server/currentuser.aspx`;
      response = await fetch(apiUrl, {
        headers,
      });
    }
    
    // If still failing, try the authentication endpoint to verify token works
    if (!response.ok && response.status === 404) {
      // Try a simpler endpoint to verify authentication is working
      apiUrl = `${baseUrl}/REST/structure/objecttypes`;
      response = await fetch(apiUrl, {
        headers,
      });
      
      if (response.ok) {
        // Auth works, but currentuser endpoint doesn't exist - return a success with auth confirmation
        const objectTypes = await response.json();
        return NextResponse.json({
          authenticated: true,
          message: 'Authentication successful, but /server/currentuser endpoint not available. Using /structure/objecttypes to verify.',
          objectTypesCount: Array.isArray(objectTypes) ? objectTypes.length : 0,
          note: 'The /server/currentuser endpoint may not be available in this M-Files version. Authentication is working correctly.',
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('M-Files API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: apiUrl,
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch user info',
          details: errorText,
          status: response.status,
          statusText: response.statusText,
        },
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to get user info';
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

