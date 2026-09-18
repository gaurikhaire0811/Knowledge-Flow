
import "dotenv/config";

const getOpenAIAPIRespnse = async (message) => {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENRouter_API_KEY}`
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-ultra-550b-a55b:free",
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        };

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            options
        );

        const data = await response.json();

        // Check if OpenAI API returned an error
        if (!response.ok) {
            console.log("OpenRouter API Error:", data);
            throw new Error(
                data?.error?.message || "OpenRouter API request failed"
            );
        }

        console.log("OpenRouter Response:", data);

        return data.choices[0].message.content;

    } catch (err) {
        console.log("OpenRouetr Error:", err);
        throw err;
    }
};

export default getOpenAIAPIRespnse;