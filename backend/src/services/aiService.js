import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Service pour l'intégration OpenAI
 */

// Initialiser le client OpenAI
let openai = null

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
} else {
  console.warn('⚠️  OPENAI_API_KEY not found. AI features will be disabled.')
}

/**
 * Générer des cartes flashcard à partir d'un texte
 * @param {string} text - Le texte source
 * @param {number} count - Nombre de cartes à générer (optionnel, défaut: 5)
 * @returns {Promise<Array>} Liste de cartes { question, answer }
 */
export async function generateCardsFromText(text, count = 5) {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
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
 * Générer des cartes à partir d'un sujet
 * @param {string} topic - Le sujet (ex: "Histoire de la Révolution française")
 * @param {number} count - Nombre de cartes (optionnel)
 * @returns {Promise<Array>} Liste de cartes
 */
export async function generateCardsFromTopic(topic, count = 5) {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
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

