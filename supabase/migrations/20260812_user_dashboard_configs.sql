-- Migration: User Config-Driven Dashboard Schema
CREATE TABLE IF NOT EXISTS user_dashboard_configs (
  user_id VARCHAR(255) PRIMARY KEY,
  layout_json JSONB NOT NULL DEFAULT '{
    "theme_preference": "system",
    "layout": [
      { "id": "daily_timeline", "type": "DAILY_ROADMAP", "position": 1, "visible": true },
      { "id": "progress_rings", "type": "COMPACT_2X2", "position": 2, "visible": true },
      { "id": "medicine_alerts", "type": "HIGH_PRIORITY_BANNER", "position": 3, "visible": true },
      { "id": "finance_widget", "type": "FULL_WIDTH_SUMMARY", "position": 4, "visible": true },
      { "id": "floating_actions", "type": "FLOATING_ACTIONS", "position": 5, "visible": true },
      { "id": "retail_inventory", "type": "RETAIL_INVENTORY", "position": 6, "visible": true }
    ]
  }',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_dashboard_configs_user_id ON user_dashboard_configs(user_id);
