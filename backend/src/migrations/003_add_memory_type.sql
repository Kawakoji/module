-- Migration 003 : Ajout du type de mémoire au profil
-- À exécuter dans Supabase SQL Editor après la migration 002

-- Ajouter la colonne memory_type à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS memory_type TEXT CHECK (memory_type IN ('visual', 'auditory', 'kinesthetic', 'reading'));

-- Ajouter une colonne pour savoir si le test a été fait
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS memory_test_completed BOOLEAN DEFAULT FALSE;

-- Commentaire pour documenter les types
COMMENT ON COLUMN public.profiles.memory_type IS 'Type de mémoire préféré: visual (visuelle), auditory (auditive), kinesthetic (kinesthésique), reading (lecture/écriture)';
COMMENT ON COLUMN public.profiles.memory_test_completed IS 'Indique si l''utilisateur a complété le test de mémoire';

