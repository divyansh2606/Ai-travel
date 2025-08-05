const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
});

async function generateItinerary(destination, startDate, endDate, interests) {
  try {
    console.log('Starting itinerary generation for:', destination);
    console.log('OpenAI API Key available:', !!process.env.OPENAI_API_KEY);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    console.log('Calculated trip duration:', days, 'days');
    
    const prompt = `Create a detailed daily travel itinerary for a ${days}-day trip to ${destination} from ${startDate} to ${endDate}. 
    
    Focus on these interests: ${interests.join(', ')}.
    
    Please structure the response as a JSON object with the following format:
    {
      "destination": "${destination}",
      "duration": "${days} days",
      "interests": ["${interests.join('", "')}"],
      "itinerary": [
        {
          "day": 1,
          "date": "${startDate}",
          "activities": [
            {
              "time": "09:00 AM",
              "activity": "Activity description",
              "location": "Location name",
              "type": "sightseeing/food/adventure/culture"
            }
          ]
        }
      ]
    }
    
    Make sure to include:
    - Realistic timing for activities
    - Popular attractions and hidden gems
    - Local cuisine recommendations
    - Cultural experiences
    - Practical travel tips
    - Estimated costs for major activities
    
    Return only the JSON object, no additional text.`;

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');
    const content = response.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const parsedResponse = JSON.parse(content);
      console.log('Successfully parsed JSON response');
      return parsedResponse;
    } catch (parseError) {
      console.log('JSON parsing failed, returning raw text');
      // If JSON parsing fails, return the raw text
      return {
        destination,
        duration: `${days} days`,
        interests,
        itinerary: content,
        raw: true
      };
    }
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
}

module.exports = { generateItinerary };
