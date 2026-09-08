"use client";

import React, { useState } from 'react';

export interface EventRecord {
  no: number;
  region?: string;
  country: string;
  city: string;
  event_name: string;
  dates: string;
  venue?: string;
  location_address?: string;
  official_website: string;
  organizer?: string;
  event_category?: string;
  business_lines: string;
  strategic_focus?: string;
  relevance_lifewood?: string;
  target_audience?: string;
  estimated_attendees?: string;
  exhibitor_sponsor_opportunity?: string;
  booth_sponsorship_cost: string;
  registration_deadline?: string;
  contact_email?: string;
  contact_person?: string;
  linkedin_social_media?: string;
  participation_recommendation: string;
  fit_score: number;
  priority_level: string;
  key_notes?: string;
  source_links?: string;
}

export default function EventScraperDashboard() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [query, setQuery] = useState('tech exhibition 2027 Singapore OR Malaysia OR Philippines');

  const handleCrawl = async () => {
    setLoading(true);
    setStatusText('Running Google Search and Apify Crawlers...');

    try {
      // First try backend service at port 5000, fallback to relative API if available
      let res: Response;
      try {
        res = await fetch('http://localhost:5000/api/crawl-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
      } catch {
        res = await fetch('/api/crawl-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
      }

      setStatusText('Applying Lifewood 27-column audit and Fit Scoring...');
      const result = await res.json();

      if (result.success) {
        setEvents(result.data || []);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err: any) {
      alert(`Network failure: ${err.message}. Ensure backend pipeline is running (node server.js on port 5000).`);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: '#133020' }}>
          Tech Exhibition Discovery Engine (Batch 11)
        </h2>
        <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
          Crawl target: Sep 1, 2026 – Dec 31, 2027 (Fit Score ≥ 3) | Apify + Google GenAI
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          placeholder="e.g. tech exhibition 2027 Singapore OR Hong Kong OR United States"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleCrawl}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#94a3b8' : '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {loading ? 'Processing Pipeline...' : 'Start Search & Crawl'}
        </button>
      </div>

      {loading && (
        <div style={{ padding: '12px 16px', background: '#e0f2fe', borderRadius: '6px', marginBottom: '16px' }}>
          <p style={{ color: '#0284c7', margin: 0, fontSize: '13px', fontWeight: 600 }}>
            ⏳ {statusText}
          </p>
        </div>
      )}

      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>#</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Event</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Dates</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Location</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Business Line</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Fit</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Priority</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Booth Cost</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0' }}>Link</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && !loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px 16px', color: '#888' }}>
                  No records yet. Run a search query to populate.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.no} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px' }}>{e.no}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{e.event_name}</td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{e.dates}</td>
                  <td style={{ padding: '10px 12px' }}>{e.city}, {e.country}</td>
                  <td style={{ padding: '10px 12px' }}>{e.business_lines}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: e.fit_score >= 4 ? '#046241' : '#b45309' }}>
                    {e.fit_score}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: e.priority_level === 'High' ? '#fee2e2' : '#fef3c7',
                      color: e.priority_level === 'High' ? '#b91c1c' : '#92400e',
                    }}>
                      {e.priority_level}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>{e.booth_sponsorship_cost}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <a
                      href={e.official_website}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0284c7', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
