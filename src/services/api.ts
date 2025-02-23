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
  
  export async function fetchMarketingInsights(): Promise<MarketingResponse> {
    const res = await fetch('http://127.0.0.1:5000/api/marketing-insights');
    if (!res.ok) throw new Error('Failed to fetch marketing insights');
    return res.json();
  }
  