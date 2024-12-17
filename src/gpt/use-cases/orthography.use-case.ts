import OpenAI from "openai";

interface Options {
	propmt: string;
}

export const orthographyCheckUseCase = async ( openai: OpenAI, options: Options ) => {

	const { propmt } = options;

	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ 
				role: "system", 
				content: `
					Te serán proveídos textos con posibles errores ortográficos y gramaticales,
					Las palabras usadas deben existir en el diccionario de la Real Academia Español,
					Debes de responder en formato JSON, 
					tu tarea es corregirlos y retornar información soluciones, 
					también debes de dar un porcentaje de acierto por el usuario,
					
					Si no hay errores, debes de retornar un mensaje de felicitaciones.		
					
					Ejemplo de salida:
					{
					userScore: number,
					errors: string, // ['error →> solución']
					message: string, // Usa emojis y texto para felicitar al usuario
					}
				`
			},
			{
				role: "user",
				content: propmt,
			},
		],
		temperature:0.3,
		max_tokens: 150,
		response_format: {
			type: 'json_object'
		}

	});
	
	const jsonResp = JSON.parse( completion.choices[0].message.content );
	return jsonResp;

	return {
		propmt: propmt,
		apikey: process.env.OPENAI_API_KEY
	}
}