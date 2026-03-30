'use client';

import { useState } from 'react';
import { Session, TaxPro, tcvlpOnboarding } from '@/lib/api';
import styles from './shared.module.css';

interface Props {
  session: Session;
  pro: TaxPro | null;
  onUpdated: (pro: TaxPro) => void;
}

export default function Settings({ session, pro, onUpdated }: Props) {
  const [firmName, setFirmName] = useState(pro?.firm_name ?? '');
  const [displayName, setDisplayName] = useState(pro?.display_name ?? '');
  const [welcomeMessage, setWelcomeMessage] = useState(pro?.welcome_message ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await tcvlpOnboarding({ firm_name: firmName, display_name: displayName, welcome_message: welcomeMessage });
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Settings</h1>
      <p className={styles.pageDesc}>Update your firm information and client-facing messaging.</p>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Firm Name <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="Jones Tax Solutions"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Jane Jones, CPA"
            className={styles.input}
          />
          <span className={styles.hint}>Shown on your client landing page</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Welcome Message</label>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Welcome! I help clients like you recover IRS penalties using the Kwong ruling…"
            rows={4}
            className={styles.textarea}
          />
          <span className={styles.hint}>Displayed on your client-facing landing page</span>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {saved && <div className={styles.successMsg}>✓ Settings saved successfully</div>}

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
