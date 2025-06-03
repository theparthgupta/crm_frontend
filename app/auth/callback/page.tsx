"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Assuming you use js-cookie for client-side cookie handling

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('AuthCallbackPage useEffect running');
    // In a real application, you would likely receive a token or session information
    // from your backend after Google OAuth redirection.
    // This might be via query parameters, or more securely,
    // your backend sets an HTTP-only cookie directly.

    // --- Example (less secure): Reading from URL query parameter ---
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Assuming your backend sends a 'token' query param

    console.log('Token from URL params:', token);

    if (token) {
      // Store the token (e.g., in a cookie or local storage)
      // Using js-cookie for demonstration. Consider secure, http-only cookies
      // set by the backend for better security.
      Cookies.set('authToken', token, { expires: 7 }); // Example: expires in 7 days
      console.log('Authentication successful. Token stored.');
      console.log('Cookie after setting:', Cookies.get('authToken'));
      // Redirect to the campaign list page
      router.push('/campaigns');
    } else {
      console.error('Authentication failed: No token received.');
      // Redirect to login or an error page
      router.push('/login'); // Or '/auth/error'
    }

    // --- Recommended (more secure): Backend sets HTTP-only cookie ---
    // If your backend sets an HTTP-only cookie, you might not need to read
    // anything from the URL here. Your frontend API utility would automatically
    // send the cookie with requests.
    //
    // For this callback page, if using http-only cookies, you might just
    // need to check if the redirect happened and then fetch user data
    // or simply redirect home, relying on route guards to handle
    // the unauthenticated case if the cookie wasn't set for some reason.
    // router.push('/campaigns'); // Redirect to campaigns

  }, [router]);

  // You can render a loading state here while processing the callback
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  );
} 