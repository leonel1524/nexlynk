-- ============================================
-- Nexlynk Seed Data
-- For development and testing
-- ============================================

-- IMPORTANT: This seed script assumes you have already:
-- 1. Created a user via Supabase Auth (signup/login)
-- 2. That user has a profile in public.users
--
-- To use this script:
-- 1. First register a user through the app or Supabase Auth
-- 2. Copy the user's UUID from auth.users or public.users
-- 3. Replace 'YOUR_USER_ID_HERE' below with that UUID
-- 4. Run the script

-- ============================================
-- CONFIGURATION
-- Replace this with your actual user ID
-- ============================================
DO $$
DECLARE
  test_user_id UUID := 'e0954c43-2188-4bf6-b9b7-11176e41f6ea';  -- <-- CHANGE THIS!
  business_id UUID;
  menu_id UUID;
  entrada_cat_id UUID;
  fuerte_cat_id UUID;
  bebida_cat_id UUID;
BEGIN
  -- Check if placeholder was replaced
  IF test_user_id = 'YOUR_USER_ID_HERE'::UUID THEN
    RAISE EXCEPTION 'Please replace YOUR_USER_ID_HERE with your actual user ID from auth.users';
  END IF;

  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) THEN
    RAISE EXCEPTION 'User with ID % does not exist in public.users. Create a user first via Supabase Auth.', test_user_id;
  END IF;

  -- ============================================
  -- INSERT TEST BUSINESS
  -- ============================================
  INSERT INTO businesses (
    id,
    owner_id,
    slug,
    name,
    description,
    phone,
    whatsapp,
    email,
    is_active,
    plan
  ) VALUES (
    uuid_generate_v4(),
    'e0954c43-2188-4bf6-b9b7-11176e41f6ea',
    'restaurante-el-sabor',
    'Restaurante El Sabor',
    'La mejor comida tradicional venezolana de la ciudad. Más de 20 años de experiencia.',
    '+584121234567',
    '+584121234567',
    'info@elsabor.com',
    true,
    'free'
  )
  RETURNING id INTO business_id;

  -- ============================================
  -- INSERT TEST LOCATIONS
  -- ============================================
  INSERT INTO locations (
    business_id,
    name,
    address,
    latitude,
    longitude,
    phone,
    whatsapp,
    schedule,
    is_main
  ) VALUES (
    business_id,
    'Sede Principal',
    'Av. Principal, Caracas, Venezuela',
    10.4806,
    -66.9036,
    '+584121234567',
    '+584121234567',
    '{"lun-vie": "8am - 10pm", "sab": "9am - 11pm", "dom": "9am - 9pm"}',
    true
  );

  INSERT INTO locations (
    business_id,
    name,
    address,
    latitude,
    longitude,
    phone,
    whatsapp,
    schedule,
    is_main
  ) VALUES (
    business_id,
    'Sucursal Playa',
    'Playa El Ángel, La Guaira',
    10.6000,
    -66.8333,
    '+584127654321',
    '+584127654321',
    '{"sab-dom": "10am - 6pm"}',
    false
  );

  -- ============================================
  -- INSERT TEST MENU
  -- ============================================
  INSERT INTO menus (
    business_id,
    name,
    description,
    is_active,
    sort_order
  ) VALUES (
    business_id,
    'Menú Principal',
    'Nuestros platos más populares',
    true,
    0
  )
  RETURNING id INTO menu_id;

  -- ============================================
  -- INSERT TEST CATEGORIES
  -- ============================================
  INSERT INTO menu_categories (menu_id, name, description, sort_order)
  VALUES (menu_id, 'Entradas', 'Para comenzar', 0)
  RETURNING id INTO entrada_cat_id;

  INSERT INTO menu_categories (menu_id, name, description, sort_order)
  VALUES (menu_id, 'Platos Fuertes', 'Nuestros platos principales', 1)
  RETURNING id INTO fuerte_cat_id;

  INSERT INTO menu_categories (menu_id, name, description, sort_order)
  VALUES (menu_id, 'Bebidas', 'Refrescos y jugos naturales', 2)
  RETURNING id INTO bebida_cat_id;

  -- ============================================
  -- INSERT TEST ITEMS - ENTRADAS
  -- ============================================
  INSERT INTO menu_items (category_id, name, description, price, is_available, sort_order)
  VALUES 
    (entrada_cat_id, 'Empanadas', 'Empanadas de carne, queso o combinadas (4 unidades)', 3.50, true, 0),
    (entrada_cat_id, 'Tequeños', '10 tequeños crocantes con salsa rosada', 5.00, true, 1),
    (entrada_cat_id, 'Mandocas', '3 mandocas con queso de mano', 4.00, true, 2);

  -- ============================================
  -- INSERT TEST ITEMS - PLATOS FUERTES
  -- ============================================
  INSERT INTO menu_items (category_id, name, description, price, is_available, sort_order)
  VALUES 
    (fuerte_cat_id, 'Pabellón Criollo', 'Arroz, caraotas negras, carne mechada y plátano frito', 12.00, true, 0),
    (fuerte_cat_id, 'Arepas con Reina Pepiada', '2 arepas con pollo guisado y aguacate', 8.00, true, 1),
    (fuerte_cat_id, 'Hallaquita', 'Hallaquita con carne mechada y plátano maduro', 10.00, true, 2),
    (fuerte_cat_id, 'Asado Negro', 'Carne asada con arroz blanco y ensalada', 14.00, true, 3);

  -- ============================================
  -- INSERT TEST ITEMS - BEBIDAS
  -- ============================================
  INSERT INTO menu_items (category_id, name, description, price, is_available, sort_order)
  VALUES 
    (bebida_cat_id, 'Jugo Natural', 'Jugo de guayaba, parchita o naranja', 2.00, true, 0),
    (bebida_cat_id, 'Chicha Andina', 'Chicha andina bien fría', 2.50, true, 1),
    (bebida_cat_id, 'Coca-Cola 500ml', 'Refresco Coca-Cola', 1.50, true, 2);

  -- ============================================
  -- INSERT TEST ANALYTICS EVENTS
  -- ============================================
  INSERT INTO analytics_events (business_id, event_type, metadata, ip_address)
  VALUES 
    (business_id, 'page_view', '{}', '192.168.1.1'),
    (business_id, 'click_whatsapp', '{}', '192.168.1.1'),
    (business_id, 'view_menu', '{}', '192.168.1.1'),
    (business_id, 'click_maps', '{}', '192.168.1.2'),
    (business_id, 'page_view', '{}', '192.168.1.3'),
    (business_id, 'select_item', '{"item_name": "Pabellón Criollo"}', '192.168.1.3');

  RAISE NOTICE 'Seed data created successfully for business: %', business_id;
END $$;
