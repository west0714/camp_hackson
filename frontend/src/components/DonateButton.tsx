//DonateButton
'use client';

import { useState } from 'react';
import DonateModal from './DonateModal';


export default function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        🎁 投げ銭する
      </button>

      {isOpen && <DonateModal onClose={() => setIsOpen(false)} />}
    </>
  );
}