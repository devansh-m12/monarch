'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the MONARCH audio recognition service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p>
              MONARCH provides an audio recognition service that allows users to identify songs by listening to audio from their microphone or device. The service also allows users to add songs to the database from Spotify.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
            <p className="mb-2">As a user of MONARCH, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate information when using the service</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to reverse engineer or bypass any security measures</li>
              <li>Not use the service to infringe on intellectual property rights</li>
              <li>Not use the service to distribute harmful content or malware</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the MONARCH service, including but not limited to the design, software, text, graphics, and logos, are owned by MONARCH or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
            <p>
              MONARCH integrates with third-party services such as Spotify and YouTube. Your use of these services is subject to their respective terms of service and privacy policies.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
            <p>
              MONARCH is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p>
              In no event shall MONARCH be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with the use of our service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes by posting the new Terms on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MONARCH operates, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@monarch-app.com.
            </p>
          </section>
        </div>
        
        <div className="mt-10 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </main>
  );
} 