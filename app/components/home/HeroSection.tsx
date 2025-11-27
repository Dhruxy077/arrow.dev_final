import React, { useState } from 'react';

export function HeroSection() {
    const [inputValue, setInputValue] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    return (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
            {/* Hero Text */}
            <div className="text-center mb-8 max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    Think It. Type It. Launch It.
                </h1>
                <p className="text-lg md:text-xl text-gray-400">
                    Build production-ready applications with AI
                </p>
            </div>

            {/* Main Input Box */}
            <div className="w-full max-w-3xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="What can I build for you today?"
                        className="w-full min-h-[120px] bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-base"
                    />

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-700 dark:text-gray-300">
                                <div className="i-ph:paperclip text-lg" />
                                Attach
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-700 dark:text-gray-300">
                                <div className="i-ph:file-arrow-down text-lg" />
                                Import
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPublic(!isPublic)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-700 dark:text-gray-300"
                            >
                                <div className={isPublic ? "i-ph:lock-open" : "i-ph:lock"} />
                                {isPublic ? 'Public' : 'Private'}
                            </button>
                            <button className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Framework Icons Bar */}
            <div className="mt-8 w-full max-w-3xl">
                <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Frameworks</span>
                            <div className="flex items-center gap-3">
                                <FrameworkIcon icon="i-logos:react" label="React" />
                                <FrameworkIcon icon="i-logos:vue" label="Vue" />
                                <FrameworkIcon icon="i-logos:angular-icon" label="Angular" />
                                <FrameworkIcon icon="i-logos:nextjs-icon" label="Next.js" />
                                <FrameworkIcon icon="i-logos:remix-icon" label="Remix" />
                                <FrameworkIcon icon="i-logos:astro-icon" label="Astro" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Integrations</span>
                            <div className="flex items-center gap-3">
                                <FrameworkIcon icon="i-logos:typescript-icon" label="TypeScript" />
                                <FrameworkIcon icon="i-logos:tailwindcss-icon" label="Tailwind" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FrameworkIcon({ icon, label }: { icon: string; label: string }) {
    return (
        <button
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors group relative"
            title={label}
        >
            <div className={`${icon} text-2xl text-gray-400 group-hover:text-gray-200`} />
        </button>
    );
}
