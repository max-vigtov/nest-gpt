import OpenAI from "openai";

interface Options {
	threadId: string;
	assistantId?: string;
}

export const createRunUseCase = async( openai: OpenAI, options: Options ) => {

	const { threadId, assistantId = 'asst_zOCwjjeQ03aVX5thFiV4Djqx' } = options;

	const run = await openai.beta.threads.runs.create(threadId, {
		assistant_id: assistantId,
		//instructions: 		//OJO! Sobreescribe al asistente, las instrucciones por defecto que tiene

	})
	console.log( run );
	
	return run;
}