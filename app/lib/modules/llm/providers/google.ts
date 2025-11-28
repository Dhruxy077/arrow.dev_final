import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Simple inline key rotator to avoid circular dependency
class SimpleKeyRotator {
  private keys: string[] = [];
  private currentIndex: number = 0;

  constructor(apiKeysString: string) {
    this.keys = apiKeysString
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (this.keys.length === 0) {
      throw new Error('No API keys provided');
    }

    console.log(`[GoogleProvider] Initialized with ${this.keys.length} API key(s)`);
  }

  getNextKey(): string {
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }

  getTotalKeys(): number {
    return this.keys.length;
  }
}

// Global rotator instance (singleton per key configuration)
let globalRotator: SimpleKeyRotator | null = null;
let lastApiKeysString: string | null = null;

export default class GoogleProvider extends BaseProvider {
  name = 'Google';
  getApiKeyLink = 'https://aistudio.google.com/app/apikey';

  config = {
    apiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
  };

  staticModels: ModelInfo[] = [
    /*
     * Essential fallback models - only the most reliable/stable ones
     * Gemini 1.5 Pro: 2M context, 8K output limit (verified from API docs)
     */
    {
      name: 'gemini-1.5-pro',
      label: 'Gemini 1.5 Pro',
      provider: 'Google',
      maxTokenAllowed: 2000000,
      maxCompletionTokens: 8192,
    },

    // Gemini 1.5 Flash: 1M context, 8K output limit, fast and cost-effective
    {
      name: 'gemini-1.5-flash',
      label: 'Gemini 1.5 Flash',
      provider: 'Google',
      maxTokenAllowed: 1000000,
      maxCompletionTokens: 8192,
    },
  ];

  /**
   * Get or create the API key rotator instance
   */
  private getRotator(apiKeysString: string): SimpleKeyRotator {
    // Create new rotator if keys changed or doesn't exist
    if (!globalRotator || lastApiKeysString !== apiKeysString) {
      globalRotator = new SimpleKeyRotator(apiKeysString);
      lastApiKeysString = apiKeysString;
    }
    return globalRotator;
  }

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    });

    if (!apiKey) {
      throw `Missing Api Key configuration for ${this.name} provider`;
    }

    // Use rotator to get an available key
    const rotator = this.getRotator(apiKey);
    const currentKey = rotator.getNextKey();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${currentKey}`, {
      headers: {
        ['Content-Type']: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models from Google API: ${response.status} ${response.statusText}`);
    }

    const res = (await response.json()) as any;

    if (!res.models || !Array.isArray(res.models)) {
      throw new Error('Invalid response format from Google API');
    }

    // Filter out models with very low token limits and experimental/unstable models
    const data = res.models.filter((model: any) => {
      const hasGoodTokenLimit = (model.outputTokenLimit || 0) > 8000;
      const isStable = !model.name.includes('exp') || model.name.includes('flash-exp');

      return hasGoodTokenLimit && isStable;
    });

    return data.map((m: any) => {
      const modelName = m.name.replace('models/', '');

      // Get accurate context window from Google API
      let contextWindow = 32000; // default fallback

      if (m.inputTokenLimit && m.outputTokenLimit) {
        // Use the input limit as the primary context window (typically larger)
        contextWindow = m.inputTokenLimit;
      } else if (modelName.includes('gemini-1.5-pro')) {
        contextWindow = 2000000; // Gemini 1.5 Pro has 2M context
      } else if (modelName.includes('gemini-1.5-flash')) {
        contextWindow = 1000000; // Gemini 1.5 Flash has 1M context
      } else if (modelName.includes('gemini-2.0-flash')) {
        contextWindow = 1000000; // Gemini 2.0 Flash has 1M context
      } else if (modelName.includes('gemini-pro')) {
        contextWindow = 32000; // Gemini Pro has 32k context
      } else if (modelName.includes('gemini-flash')) {
        contextWindow = 32000; // Gemini Flash has 32k context
      }

      // Cap at reasonable limits to prevent issues
      const maxAllowed = 2000000; // 2M tokens max
      const finalContext = Math.min(contextWindow, maxAllowed);

      // Get completion token limit from Google API
      let completionTokens = 8192; // default fallback (Gemini 1.5 standard limit)

      if (m.outputTokenLimit && m.outputTokenLimit > 0) {
        completionTokens = Math.min(m.outputTokenLimit, 128000); // Use API value, cap at reasonable limit
      }

      return {
        name: modelName,
        label: `${m.displayName} (${finalContext >= 1000000 ? Math.floor(finalContext / 1000000) + 'M' : Math.floor(finalContext / 1000) + 'k'} context)`,
        provider: this.name,
        maxTokenAllowed: finalContext,
        maxCompletionTokens: completionTokens,
      };
    });
  }

  getModelInstance(options: {
    model: string;
    serverEnv: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    // Use rotator to get next available key
    const rotator = this.getRotator(apiKey);
    const currentKey = rotator.getNextKey();

    console.log(`[GoogleProvider] Using API key for model ${model} (${rotator.getTotalKeys()} keys configured)`);

    const google = createGoogleGenerativeAI({
      apiKey: currentKey,
    });

    return google(model);
  }
}
