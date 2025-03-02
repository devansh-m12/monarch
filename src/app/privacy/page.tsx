'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Introduction</h2>
            <p>
              This Privacy Policy explains how MONARCH (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, and shares your information when you use our audio recognition service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Audio recordings when you use the recognition feature</li>
              <li>Information about songs you add to the database</li>
              <li>Technical information about your device and connection</li>
              <li>Usage data and interaction with our service</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and improve our audio recognition service</li>
              <li>Match audio samples against our database</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Troubleshoot issues and maintain service quality</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
            <p>
              Audio recordings are processed in real-time and are not stored permanently. 
              We retain fingerprint data and song information in our database to provide the recognition service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@monarch-app.com.
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