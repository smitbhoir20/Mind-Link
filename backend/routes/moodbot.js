const express = require('express');
const router = express.Router();


let groq = null;
let openai = null;
let geminiModel = null;


const openaiKey = process.env.OPENAI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;


if (groqKey) {
    try {
        const Groq = require('groq-sdk');
        groq = new Groq({ apiKey: groqKey });
        console.log(' Groq AI initialized successfully (FREE & FAST!)');
    } catch (e) {
        console.log(' Failed to initialize Groq:', e.message);
    }
}

if (!groq && openaiKey && openaiKey.startsWith('sk-')) {
    try {
        const OpenAI = require('openai');
        openai = new OpenAI({ apiKey: openaiKey });
        console.log(' OpenAI initialized successfully');
    } catch (e) {
        console.log(' Failed to initialize OpenAI:', e.message);
    }
}

if (!groq && !openai && geminiKey && geminiKey.startsWith('AIza')) {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(geminiKey);
        geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log(' Gemini AI initialized successfully');
    } catch (e) {
        console.log(' Failed to initialize Gemini:', e.message);
    }
}

if (!groq && !openai && !geminiModel) {
    console.log('ℹ️ No API key found, using fallback responses');
    console.log('   Get a FREE Groq API key at: https://console.groq.com');
}

// System prompt for MoodBot
const MOODBOT_SYSTEM_PROMPT = `You are MoodBot, a compassionate and supportive AI wellness companion for college students. Your role is to:

1. LISTEN with empathy and validate the user's feelings
2. RESPOND with warmth, understanding, and gentle encouragement
3. OFFER practical coping strategies when appropriate
4. NEVER diagnose or provide medical advice
5. ENCOURAGE professional help when concerns seem serious
6. USE a friendly, Gen-Z appropriate tone (but not cringy)
7. INCLUDE relevant emojis sparingly to add warmth
8. KEEP responses concise but meaningful (2-4 sentences typically)

Remember: You're a supportive friend, not a therapist. Be genuine, caring, and uplifting.

Important: If someone mentions self-harm, suicide, or immediate danger, gently encourage them to reach out to a crisis helpline or trusted adult, while still being supportive.`;

// Chat with MoodBot
router.post('/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }


        if (groq) {
            try {
                const messages = [
                    { role: 'system', content: MOODBOT_SYSTEM_PROMPT },
                    ...conversationHistory.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: message }
                ];

                const completion = await groq.chat.completions.create({
                    model: 'llama-3.1-8b-instant',
                    messages: messages,
                    max_tokens: 200,
                    temperature: 0.7
                });

                const text = completion.choices[0].message.content;
                console.log(' Groq response:', text.substring(0, 80) + '...');
                return res.json({ response: text });
            } catch (error) {
                console.error(' Groq API error:', error.message);
            }
        }


        if (openai) {
            try {
                const messages = [
                    { role: 'system', content: MOODBOT_SYSTEM_PROMPT },
                    ...conversationHistory.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: message }
                ];

                const completion = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: messages,
                    max_tokens: 200,
                    temperature: 0.7
                });

                const text = completion.choices[0].message.content;
                console.log(' OpenAI response:', text.substring(0, 80) + '...');
                return res.json({ response: text });
            } catch (error) {
                console.error(' OpenAI API error:', error.message);
            }
        }


        if (geminiModel) {
            try {
                let prompt = MOODBOT_SYSTEM_PROMPT + '\n\nConversation:\n';
                conversationHistory.forEach(msg => {
                    const role = msg.role === 'user' ? 'User' : 'MoodBot';
                    prompt += `${role}: ${msg.content}\n`;
                });
                prompt += `User: ${message}\n\nMoodBot (respond supportively in 2-4 sentences):`;

                const result = await geminiModel.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                console.log(' Gemini response:', text.substring(0, 80) + '...');
                return res.json({ response: text });
            } catch (error) {
                console.error(' Gemini API error:', error.message);
            }
        }


        console.log('Using fallback response');
        const fallbackResponse = getFallbackResponse(message);
        res.json({ response: fallbackResponse });

    } catch (error) {
        console.error('MoodBot error:', error);
        const fallbackResponse = getFallbackResponse(req.body.message);
        res.json({ response: fallbackResponse });
    }
});


function getFallbackResponse(message) {
    const lowerMessage = (message || '').toLowerCase();

    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
        return "I can sense you're feeling stressed. Remember, it's completely normal to feel this way sometimes. Try taking a few deep breaths - inhale for 4 counts, hold for 4, exhale for 4. You've overcome challenges before, and you can do it again.  What's specifically on your mind?";
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
        return "I'm sorry you're feeling down. Your feelings are valid, and it takes courage to acknowledge them. Remember, tough times don't last, but tough people do.  Is there something specific that triggered these feelings?";
    }

    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
        return "That's wonderful to hear!  Positive feelings are worth celebrating. What's contributing to your good mood today? I'd love to hear about it!";
    }

    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleep')) {
        return "Rest is so important for mental wellbeing. If you're feeling exhausted, your body and mind might be telling you to slow down. Consider taking a short break, maybe a power nap or a gentle walk.  Have you been getting enough sleep lately?";
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone')) {
        return "Feeling lonely can be really hard. But remember, you're not alone in feeling this way - many people experience loneliness. Have you tried our peer chat rooms? Sometimes connecting with others who understand can make a big difference. ";
    }

    if (lowerMessage.includes('exam') || lowerMessage.includes('study') || lowerMessage.includes('test')) {
        return "Academic pressure can feel overwhelming! Here are some tips: break your study sessions into manageable chunks, take regular breaks, and remember that your worth isn't defined by grades.  Would you like some specific study strategies?";
    }

    if (lowerMessage.includes('thank')) {
        return "You're so welcome!  I'm always here whenever you need to talk. Remember, taking care of your mental health is a sign of strength. Is there anything else on your mind?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hey there!  I'm so glad you're here. How are you feeling today? I'm all ears and ready to listen. ";
    }

    return "Thank you for sharing that with me. I'm here to listen and support you. Could you tell me more about how you're feeling? Remember, every emotion is valid, and talking about it is the first step to feeling better. ";
}

module.exports = router;
