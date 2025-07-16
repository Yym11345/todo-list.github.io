export interface Database {
  public: {
    Tables: {
      genes: {
        Row: {
          id: string;
          name: string;
          organism: string;
          enzyme_type: string;
          function: string;
          sequence: string;
          length: number;
          domain: string;
          accession: string;
          completeness: 'complete' | 'partial';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          organism: string;
          enzyme_type: string;
          function: string;
          sequence: string;
          length: number;
          domain: string;
          accession: string;
          completeness: 'complete' | 'partial';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          organism?: string;
          enzyme_type?: string;
          function?: string;
          sequence?: string;
          length?: number;
          domain?: string;
          accession?: string;
          completeness?: 'complete' | 'partial';
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          organization: string | null;
          research_field: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          organization?: string | null;
          research_field?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          organization?: string | null;
          research_field?: string | null;
          updated_at?: string;
        };
      };
      search_history: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          filters: any;
          results_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          filters?: any;
          results_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          filters?: any;
          results_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}