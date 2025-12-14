import { InitialDataStructure } from './types/initialData.ts';

declare global {
    interface DisqusConfig {
        page: {
            identifier: string;
            url: string;
        };
        callbacks: {
            onReady?: Array<() => void>;
        };
    }

    type DisqusConfigFunction = (this: DisqusConfig) => void;

    interface Window {
        DISQUS?: {
            reset: (options: { reload: boolean; config: DisqusConfigFunction }) => void;
        };
        disqus_config?: DisqusConfigFunction;
        __INITIAL_DATA__?: InitialDataStructure;
    }
}

export {};
