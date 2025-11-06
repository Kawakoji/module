-- Migration 002 : Mise à jour des politiques RLS pour l'authentification
-- À exécuter dans Supabase SQL Editor après la migration 001

-- Supprimer les anciennes politiques publiques
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Decks are viewable by everyone" ON public.decks;
DROP POLICY IF EXISTS "Decks are insertable by everyone" ON public.decks;
DROP POLICY IF EXISTS "Decks are updatable by everyone" ON public.decks;
DROP POLICY IF EXISTS "Decks are deletable by everyone" ON public.decks;
DROP POLICY IF EXISTS "Cards are viewable by everyone" ON public.cards;
DROP POLICY IF EXISTS "Cards are insertable by everyone" ON public.cards;
DROP POLICY IF EXISTS "Cards are updatable by everyone" ON public.cards;
DROP POLICY IF EXISTS "Cards are deletable by everyone" ON public.cards;

-- ===== PROFILES =====
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Les profils sont créés automatiquement lors de l'inscription (via trigger)

-- ===== DECKS =====
-- Les utilisateurs peuvent voir leurs propres decks
CREATE POLICY "Users can view own decks" ON public.decks
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres decks
CREATE POLICY "Users can create own decks" ON public.decks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs propres decks
CREATE POLICY "Users can update own decks" ON public.decks
  FOR UPDATE USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres decks
CREATE POLICY "Users can delete own decks" ON public.decks
  FOR DELETE USING (auth.uid() = user_id);

-- ===== CARDS =====
-- Les utilisateurs peuvent voir les cartes de leurs decks
CREATE POLICY "Users can view cards from own decks" ON public.cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des cartes dans leurs decks
CREATE POLICY "Users can create cards in own decks" ON public.cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent mettre à jour les cartes de leurs decks
CREATE POLICY "Users can update cards in own decks" ON public.cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent supprimer les cartes de leurs decks
CREATE POLICY "Users can delete cards from own decks" ON public.cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();




