import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Service pour l'intégration IA
 * Supporte : OpenAI, Hugging Face (gratuit), et génération simple (sans IA)
 */

// Configuration des providers
// Par défaut, on essaie OpenAI si disponible, sinon on utilise la génération simple
const AI_PROVIDER = process.env.AI_PROVIDER // 'openai', 'huggingface', 'simple', ou auto-détection
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

// Initialiser le client OpenAI
let openai = null
let useOpenAI = false

if (OPENAI_API_KEY) {
  // Si une clé OpenAI est fournie, l'utiliser (même si AI_PROVIDER n'est pas défini)
  if (!AI_PROVIDER || AI_PROVIDER === 'openai') {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
    useOpenAI = true
    console.log('✅ OpenAI client initialized (using free credits)')
  }
} else {
  if (AI_PROVIDER === 'openai') {
    console.warn('⚠️  OPENAI_API_KEY not found. OpenAI features will be disabled.')
    console.warn('💡 Get free $5 credits at: https://platform.openai.com/api-keys')
  }
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
  // Nettoyer et segmenter le texte
  const cleanedText = text.trim().replace(/\s+/g, ' ')
  const sentences = cleanedText
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && s.length < 500)

  if (sentences.length === 0) {
    throw new Error('Le texte est trop court ou ne contient pas de phrases valides (minimum 15 caractères par phrase)')
  }

  const cards = []
  const usedIndices = new Set()
  const stopWords = new Set([
    'dans', 'avec', 'pour', 'sont', 'cette', 'aussi', 'comme', 'mais', 'plus', 'tout', 'tous',
    'toute', 'toutes', 'sans', 'sous', 'sur', 'par', 'les', 'des', 'une', 'un', 'le', 'la',
    'qui', 'que', 'quoi', 'quand', 'où', 'comment', 'pourquoi'
  ])

  // Générer des cartes à partir des phrases
  const maxIterations = Math.min(count * 3, sentences.length * 2)
  for (let iteration = 0; iteration < maxIterations && cards.length < count; iteration++) {
    let sentenceIndex
    let attempts = 0
    do {
      sentenceIndex = Math.floor(Math.random() * sentences.length)
      attempts++
      if (attempts > 50) break
    } while (usedIndices.has(sentenceIndex) && usedIndices.size < sentences.length)

    if (attempts > 50) break

    usedIndices.add(sentenceIndex)
    const sentence = sentences[sentenceIndex]

    // Extraire des mots-clés importants (noms, adjectifs)
    const words = sentence
      .replace(/[^\w\sàâäéèêëïîôùûüÿç]/gi, ' ')
      .split(/\s+/)
      .map((w) => w.toLowerCase().trim())
      .filter((w) => w.length > 4 && !stopWords.has(w))
      .filter((w) => /^[a-zàâäéèêëïîôùûüÿç]+$/i.test(w)) // Uniquement des mots (pas de nombres)

    if (words.length === 0) continue

    // Sélectionner un mot-clé important (priorité aux mots plus longs)
    const sortedWords = words.sort((a, b) => b.length - a.length)
    const keyword = sortedWords[0] || words[0]

    // Générer différents types de questions
    const questionTypes = [
      `Qu'est-ce que ${keyword} ?`,
      `Définissez ${keyword}`,
      `Expliquez ${keyword}`,
      `Quel est le rôle de ${keyword} ?`,
      `Quelle est l'importance de ${keyword} ?`,
    ]

    const question = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    
    // Réponse : la phrase complète (truncée si nécessaire)
    let answer = sentence
    if (answer.length > 250) {
      answer = answer.substring(0, 247) + '...'
    }

    cards.push({
      question: question,
      answer: answer,
    })
  }

  // Si on n'a pas assez de cartes, créer des cartes de définition
  if (cards.length < count) {
    const allWords = cleanedText
      .replace(/[^\w\sàâäéèêëïîôùûüÿç]/gi, ' ')
      .split(/\s+/)
      .map((w) => w.toLowerCase().trim())
      .filter((w) => w.length > 5 && !stopWords.has(w))
      .filter((w) => /^[a-zàâäéèêëïîôùûüÿç]+$/i.test(w))

    const uniqueWords = [...new Set(allWords)]
    
    for (let i = cards.length; i < count && uniqueWords.length > 0; i++) {
      const word = uniqueWords[Math.floor(Math.random() * uniqueWords.length)]
      const wordIndex = uniqueWords.indexOf(word)
      uniqueWords.splice(wordIndex, 1)

      // Trouver une phrase contenant ce mot
      const containingSentence = sentences.find((s) => 
        s.toLowerCase().includes(word)
      ) || sentences[Math.floor(Math.random() * sentences.length)]

      cards.push({
        question: `Qu'est-ce que ${word} ?`,
        answer: containingSentence.length > 250 
          ? containingSentence.substring(0, 247) + '...' 
          : containingSentence,
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
  if (!openai || !useOpenAI) {
    console.log('📝 Using simple rule-based generation (free, no API key)')
    console.log('💡 To use OpenAI (with free $5 credits): https://platform.openai.com/api-keys')
    return generateCardsSimple(text, count)
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
  if (!openai || !useOpenAI) {
    console.log('📝 Using simple rule-based generation (free, no API key)')
    console.log('💡 To use OpenAI (with free $5 credits): https://platform.openai.com/api-keys')
    return generateCardsFromTopicSimple(topic, count)
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

