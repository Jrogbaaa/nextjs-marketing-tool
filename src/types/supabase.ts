export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          name: string;
          title: string;
          company: string;
          location: string;
          profile_url: string;
          summary: string;
          skills: string[];
          experience: Json[];
          education: Json[];
          connections: number;
          connection_degree?: number;
          analyzed: boolean;
          created_at: string;
          updated_at?: string;
          scrape_data: Json;
        };
        Insert: {
          id?: string;
          name: string;
          title: string;
          company: string;
          location: string;
          profile_url: string;
          summary?: string;
          skills?: string[];
          experience?: Json[];
          education?: Json[];
          connections?: number;
          connection_degree?: number;
          analyzed?: boolean;
          created_at?: string;
          updated_at?: string;
          scrape_data?: Json;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          company?: string;
          location?: string;
          profile_url?: string;
          summary?: string;
          skills?: string[];
          experience?: Json[];
          education?: Json[];
          connections?: number;
          connection_degree?: number;
          analyzed?: boolean;
          created_at?: string;
          updated_at?: string;
          scrape_data?: Json;
        };
      };
      insights: {
        Row: {
          id: string;
          lead_id: string;
          type: string;
          title: string;
          content: string;
          confidence_score: number;
          action_points?: string[];
          related_insights?: string[];
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          type: string;
          title: string;
          content: string;
          confidence_score: number;
          action_points?: string[];
          related_insights?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          type?: string;
          title?: string;
          content?: string;
          confidence_score?: number;
          action_points?: string[];
          related_insights?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          insight_id: string;
          lead_id: string;
          rating: number;
          comment?: string;
          created_at: string;
          updated_at?: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          insight_id: string;
          lead_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          insight_id?: string;
          lead_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name?: string;
          avatar_url?: string;
          role: string;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          avatar_url?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
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