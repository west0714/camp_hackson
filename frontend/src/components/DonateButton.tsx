//DonateButton
'use client';

import { useState } from 'react';
import DonateModal from './DonateModal';

type DonationData = {
  amount: number;
  comment: string;
};

export default function DonateButton({ 
  streamerId, 
  onDonationSuccess 
}: { 
  streamerId: string; 
  onDonationSuccess?: (donationData: DonationData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDonationSuccess = (donationData: DonationData) => {
    // 支払い成功時のコールバックを呼び出し
    if (onDonationSuccess) {
      onDonationSuccess(donationData);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        募金
      </button>

      {isOpen && (
        <DonateModal 
          streamer_id={streamerId} 
          onClose={() => setIsOpen(false)}
          onDonationSuccess={handleDonationSuccess}
        />
      )}
    </>
  );
}