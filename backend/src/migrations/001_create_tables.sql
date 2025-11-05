-- Migration 001 : Création des tables de base pour Moduleia
-- À exécuter dans Supabase SQL Editor

-- Table des utilisateurs (gérée par Supabase Auth, mais on peut ajouter des champs supplémentaires)
-- Note: Supabase Auth crée automatiquement une table auth.users
-- On crée une table profiles pour les données supplémentaires

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des decks
CREATE TABLE IF NOT EXISTS public.decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table des cartes
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  -- Champs pour la révision espacée (algorithme SM2)
  ease_factor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_next_review ON public.cards(next_review);

-- RLS (Row Level Security) - À activer plus tard avec l'authentification
-- Pour l'instant, on désactive RLS pour simplifier le développement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (pour permettre l'accès public temporairement - sera modifié à l'étape 4)
-- Ces politiques seront remplacées par des politiques d'authentification dans l'étape 4

-- Profiles: lecture publique pour l'instant
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Decks: lecture et écriture publiques pour l'instant
CREATE POLICY "Decks are viewable by everyone" ON public.decks
  FOR SELECT USING (true);

CREATE POLICY "Decks are insertable by everyone" ON public.decks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Decks are updatable by everyone" ON public.decks
  FOR UPDATE USING (true);

CREATE POLICY "Decks are deletable by everyone" ON public.decks
  FOR DELETE USING (true);

-- Cards: lecture et écriture publiques pour l'instant
CREATE POLICY "Cards are viewable by everyone" ON public.cards
  FOR SELECT USING (true);

CREATE POLICY "Cards are insertable by everyone" ON public.cards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Cards are updatable by everyone" ON public.cards
  FOR UPDATE USING (true);

CREATE POLICY "Cards are deletable by everyone" ON public.cards
  FOR DELETE USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON public.decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour le compteur de cartes d'un deck
CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.decks
    SET card_count = card_count + 1
    WHERE id = NEW.deck_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.decks
    SET card_count = GREATEST(0, card_count - 1)
    WHERE id = OLD.deck_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement le compteur de cartes
CREATE TRIGGER update_card_count_on_insert
  AFTER INSERT ON public.cards
  FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

CREATE TRIGGER update_card_count_on_delete
  AFTER DELETE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();



