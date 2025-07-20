import useSWR from 'swr';
import axios from 'axios';

export const useDonationTargets = () => {
  const fetcher = (url: string) => axios.get(url).then(res => res.data);

  const { data } = useSWR(
    'https://geek-camp-hackason-back.onrender.com/api/v1/donation_targets',
    fetcher,
    { revalidateOnReconnect: true }
  );

  return {
    donationTargets: data,
  };
};