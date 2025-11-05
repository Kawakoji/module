import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Service pour l'intégration IA
 * Supporte : OpenAI, Hugging Face (gratuit), et génération simple (sans IA)
 */

// Configuration des providers
const AI_PROVIDER = process.env.AI_PROVIDER || 'simple' // 'openai', 'huggingface', 'simple'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

// Initialiser le client OpenAI
let openai = null
if (OPENAI_API_KEY && AI_PROVIDER === 'openai') {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  })
  console.log('✅ OpenAI client initialized')
} else if (AI_PROVIDER === 'openai') {
  console.warn('⚠️  OPENAI_API_KEY not found. OpenAI features will be disabled.')
}

// Initialiser Hugging Face (optionnel)
let huggingFaceAvailable = false
if (HUGGINGFACE_API_KEY && AI_PROVIDER === 'huggingface') {
  huggingFaceAvailable = true
  console.log('✅ Hugging Face API available')
} else if (AI_PROVIDER === 'huggingface') {
  console.warn('⚠️  HUGGINGFACE_API_KEY not found. Using simple generation instead.')
}

if (AI_PROVIDER === 'simple') {
  console.log('✅ Using simple rule-based generation (free, no API key needed)')
}

/**
 * Génération simple basée sur des règles (gratuit, sans IA)
 * @param {string} text - Le texte source
 * @param {number} count - Nombre de cartes à générer
 * @returns {Array} Liste de cartes { question, answer }
 */
function generateCardsSimple(text, count = 5) {
  const sentences = text
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 500)

  if (sentences.length === 0) {
    throw new Error('Le texte est trop court ou ne contient pas de phrases valides')
  }

  const cards = []
  const usedIndices = new Set()

  // Générer des cartes à partir des phrases
  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    let sentenceIndex
    do {
      sentenceIndex = Math.floor(Math.random() * sentences.length)
    } while (usedIndices.has(sentenceIndex) && usedIndices.size < sentences.length)

    usedIndices.add(sentenceIndex)
    const sentence = sentences[sentenceIndex]

    // Extraire des mots-clés ou concepts importants
    const words = sentence
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .filter((w) => !['dans', 'avec', 'pour', 'sont', 'cette', 'cette', 'aussi', 'comme'].includes(w.toLowerCase()))

    if (words.length === 0) continue

    // Créer une question basée sur la phrase
    const keyword = words[Math.floor(Math.random() * Math.min(words.length, 3))]
    const question = `Qu'est-ce que ${keyword} ?` || `Quel est le rôle de ${keyword} ?`

    // Réponse : la phrase complète ou une version simplifiée
    let answer = sentence
    if (answer.length > 200) {
      answer = answer.substring(0, 197) + '...'
    }

    cards.push({
      question: question || `Question sur : ${sentence.substring(0, 50)}...`,
      answer: answer || sentence,
    })
  }

  // Si on n'a pas assez de cartes, créer des cartes à partir de définitions simples
  while (cards.length < count && cards.length < sentences.length * 2) {
    const sentence = sentences[Math.floor(Math.random() * sentences.length)]
    const words = sentence.split(/\s+/).filter((w) => w.length > 5)

    if (words.length > 0) {
      const term = words[0]
      cards.push({
        question: `Définissez : ${term}`,
        answer: sentence.length > 200 ? sentence.substring(0, 197) + '...' : sentence,
      })
    }
  }

  return cards.slice(0, count)
}

/**
 * Générer des cartes flashcard à partir d'un texte
 * @param {string} text - Le texte source
 * @param {number} count - Nombre de cartes à générer (optionnel, défaut: 5)
 * @returns {Promise<Array>} Liste de cartes { question, answer }
 */
export async function generateCardsFromText(text, count = 5) {
  // Utiliser la génération simple si OpenAI n'est pas configuré
  if (!openai && AI_PROVIDER !== 'openai') {
    console.log('📝 Using simple rule-based generation (free)')
    return generateCardsSimple(text, count)
  }

  if (!openai) {
    throw new Error('OpenAI API key not configured. Set AI_PROVIDER=simple for free generation.')
  }

  if (!text || !text.trim()) {
    throw new Error('Le texte est requis pour générer des cartes')
  }

  if (count < 1 || count > 20) {
    throw new Error('Le nombre de cartes doit être entre 1 et 20')
  }

  const prompt = `Tu es un expert en création de flashcards éducatives. À partir du texte suivant, génère ${count} cartes flashcard de qualité avec des questions et réponses claires et concises.

Règles importantes :
- Chaque carte doit avoir une question claire et précise
- La réponse doit être concise mais complète (maximum 200 mots)
- Les questions doivent tester la compréhension, pas seulement la mémorisation
- Varie les types de questions (concept, définition, application, comparaison)
- Format de sortie : JSON uniquement, avec un objet contenant un tableau "cards" :
{
  "cards": [
    {
      "question": "Question 1",
      "answer": "Réponse 1"
    },
    {
      "question": "Question 2",
      "answer": "Réponse 2"
    }
  ]
}

Texte source :
${text.trim()}

Génère exactement ${count} cartes au format JSON.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Tu es un expert en création de flashcards éducatives. Tu génères toujours du JSON valide sans markdown, avec un objet contenant un tableau "cards" d\'objets {question, answer}.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

      const responseContent = completion.choices[0].message.content.trim()

    // Parser la réponse JSON
    let parsedResponse
    try {
      // Nettoyer la réponse (enlever les markdown code blocks si présents)
      let cleanContent = responseContent
      if (cleanContent.includes('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      } else if (cleanContent.includes('```')) {
        cleanContent = cleanContent.replace(/```\s*/g, '')
      }

      // Essayer de parser directement
      parsedResponse = JSON.parse(cleanContent.trim())
    } catch (parseError) {
      // Si ce n'est pas du JSON pur, essayer d'extraire le JSON
      const jsonMatch = responseContent.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        // Essayer de trouver un objet JSON
        const objMatch = responseContent.match(/\{[\s\S]*\}/)
        if (objMatch) {
          parsedResponse = JSON.parse(objMatch[0])
        } else {
          throw new Error('Impossible de parser la réponse de l\'IA : ' + parseError.message)
        }
      }
    }

    // Extraire les cartes
    let cards = []
    if (Array.isArray(parsedResponse)) {
      cards = parsedResponse
    } else if (parsedResponse.cards && Array.isArray(parsedResponse.cards)) {
      cards = parsedResponse.cards
    } else if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
      cards = parsedResponse.questions
    } else if (parsedResponse.flashcards && Array.isArray(parsedResponse.flashcards)) {
      cards = parsedResponse.flashcards
    } else {
      // Essayer de trouver un tableau dans l'objet
      const arrayKey = Object.keys(parsedResponse).find(
        (key) => Array.isArray(parsedResponse[key])
      )
      if (arrayKey) {
        cards = parsedResponse[arrayKey]
      }
    }

    // Valider et nettoyer les cartes
    const validatedCards = cards
      .filter((card) => card && card.question && card.answer)
      .map((card) => ({
        question: card.question.trim(),
        answer: card.answer.trim(),
      }))
      .slice(0, count) // Limiter au nombre demandé

    if (validatedCards.length === 0) {
      throw new Error('Aucune carte valide générée par l\'IA')
    }

    return validatedCards
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`Erreur OpenAI API: ${error.message}`)
    }
    throw error
  }
}

/**
 * Génération simple à partir d'un sujet (gratuit, sans IA)
 * @param {string} topic - Le sujet
 * @param {number} count - Nombre de cartes
 * @returns {Array} Liste de cartes
 */
function generateCardsFromTopicSimple(topic, count = 5) {
  // Générer des questions basiques sur le sujet
  const questionTemplates = [
    `Qu'est-ce que ${topic} ?`,
    `Quel est l'historique de ${topic} ?`,
    `Quels sont les concepts clés de ${topic} ?`,
    `Comment fonctionne ${topic} ?`,
    `Quelles sont les caractéristiques principales de ${topic} ?`,
    `Quels sont les éléments importants de ${topic} ?`,
    `Définissez ${topic}`,
    `Expliquez ${topic}`,
  ]

  const cards = []
  for (let i = 0; i < count; i++) {
    const template = questionTemplates[i % questionTemplates.length]
    cards.push({
      question: template,
      answer: `Informations sur ${topic}. Pour obtenir des réponses détaillées, utilisez un texte source ou configurez une clé API OpenAI.`,
    })
  }

  return cards
}

/**
 * Générer des cartes à partir d'un sujet
 * @param {string} topic - Le sujet (ex: "Histoire de la Révolution française")
 * @param {number} count - Nombre de cartes (optionnel)
 * @returns {Promise<Array>} Liste de cartes
 */
export async function generateCardsFromTopic(topic, count = 5) {
  // Utiliser la génération simple si OpenAI n'est pas configuré
  if (!openai && AI_PROVIDER !== 'openai') {
    console.log('📝 Using simple rule-based generation (free)')
    return generateCardsFromTopicSimple(topic, count)
  }

  if (!openai) {
    throw new Error('OpenAI API key not configured. Set AI_PROVIDER=simple for free generation.')
  }

  const prompt = `Crée ${count} cartes flashcard éducatives sur le sujet : "${topic}"

Chaque carte doit avoir :
- Une question claire et précise
- Une réponse concise mais complète (maximum 200 mots)

Format JSON uniquement avec un objet contenant un tableau "cards" :
{
  "cards": [
    {
      "question": "Question 1",
      "answer": "Réponse 1"
    }
  ]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Tu es un expert en création de flashcards. Génère toujours du JSON valide avec un objet contenant un tableau "cards" d\'objets {question, answer}.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

      const responseContent = completion.choices[0].message.content.trim()

      // Parser la réponse (même logique que generateCardsFromText)
      let cleanContent = responseContent
      if (cleanContent.includes('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      } else if (cleanContent.includes('```')) {
        cleanContent = cleanContent.replace(/```\s*/g, '')
      }

      const parsedResponse = JSON.parse(cleanContent.trim())

      // Extraire les cartes
      let cards = []
      if (Array.isArray(parsedResponse)) {
        cards = parsedResponse
      } else if (parsedResponse.cards) {
        cards = parsedResponse.cards
      } else if (parsedResponse.flashcards) {
        cards = parsedResponse.flashcards
      } else {
        const arrayKey = Object.keys(parsedResponse).find(
          (key) => Array.isArray(parsedResponse[key])
        )
        if (arrayKey) cards = parsedResponse[arrayKey]
      }

    return cards
      .filter((card) => card && card.question && card.answer)
      .map((card) => ({
        question: card.question.trim(),
        answer: card.answer.trim(),
      }))
      .slice(0, count)
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`Erreur OpenAI API: ${error.message}`)
    }
    throw error
  }
}

