

import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
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

        console.log("OpenRouter Response:", data);

        if (!response.ok) {
            throw new Error(
                data?.error?.message || "OpenRouter API request failed"
            );
        }

        if (!data?.choices?.[0]?.message?.content) {
            throw new Error("AI did not return a valid response");
        }

        return data.choices[0].message.content;

    } catch (err) {

        console.log("OpenRouter Error:", err);

        throw err;
    }
};

export default getOpenAIAPIResponse;