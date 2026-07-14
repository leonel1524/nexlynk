-- ============================================
-- Nexlynk Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'business', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'business', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);

-- ============================================
-- LOCATIONS TABLE
-- ============================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  whatsapp TEXT,
  schedule JSONB DEFAULT '{}',
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for business lookups
CREATE INDEX idx_locations_business ON locations(business_id);

-- ============================================
-- MENUS TABLE
-- ============================================
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for business lookups
CREATE INDEX idx_menus_business ON menus(business_id);

-- ============================================
-- MENU CATEGORIES TABLE
-- ============================================
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for menu lookups
CREATE INDEX idx_menu_categories_menu ON menu_categories(menu_id);

-- ============================================
-- MENU ITEMS TABLE
-- ============================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category lookups
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view',
    'click_whatsapp',
    'click_maps',
    'click_phone',
    'view_menu',
    'select_item',
    'share'
  )),
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX idx_analytics_business ON analytics_events(business_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Users can view own businesses" ON businesses
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own businesses" ON businesses
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own businesses" ON businesses
  FOR DELETE USING (auth.uid() = owner_id);

-- Public access for active businesses
CREATE POLICY "Public can view active businesses" ON businesses
  FOR SELECT USING (is_active = true);

-- Locations policies
CREATE POLICY "Users can view own business locations" ON locations
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can manage own business locations" ON locations
  FOR ALL USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Public access for active business locations
CREATE POLICY "Public can view active business locations" ON locations
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE is_active = true)
  );

-- Menus policies
CREATE POLICY "Users can view own business menus" ON menus
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can manage own business menus" ON menus
  FOR ALL USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Public access for active business menus
CREATE POLICY "Public can view active business menus" ON menus
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE is_active = true)
  );

-- Menu Categories policies
CREATE POLICY "Users can view own business menu categories" ON menu_categories
  FOR SELECT USING (
    menu_id IN (
      SELECT m.id FROM menus m
      WHERE m.business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own business menu categories" ON menu_categories
  FOR ALL USING (
    menu_id IN (
      SELECT m.id FROM menus m
      WHERE m.business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    )
  );

-- Public access for active business menu categories
CREATE POLICY "Public can view active business menu categories" ON menu_categories
  FOR SELECT USING (
    menu_id IN (
      SELECT m.id FROM menus m
      WHERE m.business_id IN (SELECT id FROM businesses WHERE is_active = true)
    )
  );

-- Menu Items policies
CREATE POLICY "Users can view own business menu items" ON menu_items
  FOR SELECT USING (
    category_id IN (
      SELECT mc.id FROM menu_categories mc
      JOIN menus m ON mc.menu_id = m.id
      WHERE m.business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own business menu items" ON menu_items
  FOR ALL USING (
    category_id IN (
      SELECT mc.id FROM menu_categories mc
      JOIN menus m ON mc.menu_id = m.id
      WHERE m.business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    )
  );

-- Public access for active business menu items
CREATE POLICY "Public can view active business menu items" ON menu_items
  FOR SELECT USING (
    category_id IN (
      SELECT mc.id FROM menu_categories mc
      JOIN menus m ON mc.menu_id = m.id
      WHERE m.business_id IN (SELECT id FROM businesses WHERE is_active = true)
    )
  );

-- Analytics policies (service role only for writes)
CREATE POLICY "Service role can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own business analytics" ON analytics_events
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user signup
-- Automatically creates a profile in public.users when auth.users is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to auto-create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes
CREATE INDEX idx_businesses_owner_active ON businesses(owner_id, is_active);
CREATE INDEX idx_menus_business_active ON menus(business_id, is_active);
CREATE INDEX idx_analytics_business_type ON analytics_events(business_id, event_type);
CREATE INDEX idx_analytics_business_created ON analytics_events(business_id, created_at);
