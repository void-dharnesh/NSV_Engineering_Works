import { useState } from 'react';
import { Phone } from 'lucide-react';

function isPhoneDevice() {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(userAgent);
}

function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[^\d+]/g, '');
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

function SmartCallLink({ phoneNumber, className, children }) {
  const [copied, setCopied] = useState(false);
  const telNumber = normalizePhoneNumber(phoneNumber);

  const handleClick = async (event) => {
    if (isPhoneDevice()) return;

    event.preventDefault();
    await copyToClipboard(phoneNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <a className={className} href={`tel:${telNumber}`} onClick={handleClick}>
      <Phone size={18} aria-hidden="true" />
      {copied ? 'Number Copied' : children}
    </a>
  );
}

export default SmartCallLink;
