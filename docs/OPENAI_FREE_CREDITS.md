# 🆓 Utiliser OpenAI Gratuitement avec les Crédits Gratuits

## 💰 Crédits Gratuits OpenAI

OpenAI offre **5 $ de crédits gratuits** pour tester l'API lors de la création d'un compte.

## 📝 Comment obtenir votre clé API gratuite

### 1. Créer un compte OpenAI

1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Cliquez sur **Sign up** (ou **Log in** si vous avez déjà un compte)
3. Créez un compte avec votre email ou connectez-vous avec Google/Microsoft

### 2. Obtenir votre clé API

1. Une fois connecté, allez dans **API keys** (ou **Settings → API keys**)
2. Cliquez sur **Create new secret key**
3. Donnez un nom (ex: "Moduleia")
4. **Copiez la clé** (elle ne sera affichée qu'une fois !)
   - Format : `sk-...` (environ 50 caractères)

### 3. Ajouter la clé dans Vercel

1. Allez sur [vercel.com](https://vercel.com) → votre projet
2. **Settings** → **Environment Variables**
3. Cliquez sur **Add New**
4. Ajoutez :
   - **Variable Name** : `OPENAI_API_KEY`
   - **Value** : Collez votre clé (`sk-...`)
   - **Environment** : Cochez Production, Preview, Development
5. Cliquez sur **Save**
6. **Redéployez** votre application

## 💡 Utilisation des crédits

- **5 $ de crédits gratuits** = environ 500 000 tokens avec GPT-3.5-turbo
- **1 génération de 5 cartes** ≈ 1000-2000 tokens
- **Vous pouvez générer environ 250-500 fois** avec les crédits gratuits

## 🔄 Comportement de l'application

- **Si `OPENAI_API_KEY` est configurée** : Utilise OpenAI (gratuit avec vos crédits)
- **Si `OPENAI_API_KEY` n'est pas configurée** : Utilise la génération simple (gratuite, sans IA)

## 📊 Coûts après les crédits gratuits

Une fois les 5 $ épuisés :
- GPT-3.5-turbo : ~0.50 $ pour 1 million de tokens en entrée
- ~0.75 $ pour 1 million de tokens en sortie
- **Très économique** : 1000 générations ≈ 0.10-0.20 $

## ✅ Alternative : Génération Simple

Si vous ne voulez pas utiliser OpenAI, l'application utilise automatiquement la **génération simple** (gratuite, sans API) qui :
- Analyse le texte
- Extrait les mots-clés
- Génère des questions basiques

C'est moins intelligent que l'IA, mais **100% gratuit** et fonctionne immédiatement.

