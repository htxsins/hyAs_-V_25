export interface MarketingInsight {
  Campaign_Type: string;
  Channel: string;
  total_spend: number;
  total_enrollments: number;
  total_leads: number;
  roi: number;
  conversion_rate: number;
}

export interface MarketingResponse {
  summary: MarketingInsight[];
  suggestions: string[];
  r2: number;
}

/**
 * Fetches marketing insights from the backend.
 */
export async function fetchMarketingInsights(): Promise<MarketingResponse> {
  const res = await fetch('http://127.0.0.1:5000/api/marketing-insights');
  if (!res.ok) throw new Error('Failed to fetch marketing insights');
  return res.json();
}

/**
 * Uploads a CSV file to the backend and returns the processed data.
 * @param formData - The FormData object containing the uploaded file.
 */
export async function uploadCSV(formData: FormData): Promise<MarketingResponse> {
  const res = await fetch('http://127.0.0.1:5000/api/upload-csv', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload and process CSV file');
  }

  return res.json();
}