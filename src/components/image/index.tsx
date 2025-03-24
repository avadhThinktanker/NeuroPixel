import { useState, FormEvent, KeyboardEvent } from "react";
import { OpenAI } from "openai";

interface CustomImageGenerateParams extends OpenAI.ImageGenerateParams {
    extra_body?: {
        response_extension: string;
        width: number;
        height: number;
        num_inference_steps: number;
        seed: number;
        negative_prompt: string;
    };
}

interface Image {
    model1: string | null;
    model2: string | null;
}

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
    const [images, setImages] = useState<Image>({ model1: null, model2: null });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const client = new OpenAI({
        baseURL: "https://api.studio.nebius.com/v1/",
        apiKey: import.meta.env.VITE_SOME_KEY as string,
        dangerouslyAllowBrowser: true,
    });

    const MODELS = {
        model1: "black-forest-labs/flux-dev",
        model2: "stability-ai/sdxl",
    } as const;

    const generateImage = async (model: string): Promise<string> => {
        const completion = await client.images.generate({
            model,
            prompt,
            response_format: "url",
            n: 1,
            extra_body: {
                response_extension: "webp",
                width: 512,
                height: 512,
                num_inference_steps: 30,
                seed: -1,
                negative_prompt: "",
            },
        } as CustomImageGenerateParams);
        return completion.data[0].url as string;
    };

    const handleGenerateImage = async (
        e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
    ) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError("");
        setImages({ model1: null, model2: null });
        setGeneratedPrompt(prompt);

        try {
            const [url1, url2] = await Promise.all([
                generateImage(MODELS.model1),
                generateImage(MODELS.model2),
            ]);

            setImages({
                model1: url1,
                model2: url2,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError("Failed to generate images: " + errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
            setPrompt("");
            setIsEditing(false);
        }
    };

    const handleEditPrompt = () => {
        setIsEditing(true);
        setPrompt(generatedPrompt);
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
                Generate Your Images
            </h2>
            <form onSubmit={handleGenerateImage} className="space-y-4">
                <div>
                    <label
                        htmlFor="prompt"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Enter your prompt
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Generate your Image..."
                        className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[100px]"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleGenerateImage(e);
                            }
                        }}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? "Generating..." : "Generate Images"}
                </button>
            </form>

            {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

            {(images.model1 || images.model2) && (
                <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                        {!isEditing && (
                            <p className="text-lg text-gray-800">Prompt: {generatedPrompt}</p>
                        )}
                        {!isEditing && (
                            <button
                                onClick={handleEditPrompt}
                                className="ml-4 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Edit Prompt
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.model1 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Model 1 (Flux Dev):
                                </h3>
                                <img
                                    src={images.model1}
                                    alt="Generated from Model 1"
                                    className="mt-2 w-full rounded-md shadow-lg"
                                />
                            </div>
                        )}
                        {images.model2 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Model 2 (stability):
                                </h3>
                                <img
                                    src={images.model2}
                                    alt="Generated from Model 2"
                                    className="mt-2 w-full rounded-md shadow-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGenerator;
