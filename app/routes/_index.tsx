import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { HeroSection } from '~/components/home/HeroSection';
import SilkBackground from '~/components/Silk.client';

export const meta: MetaFunction = () => {
  return [{ title: 'Arrow.dev' }, { name: 'description', content: 'Build production-ready applications with AI' }];
};

export const loader = () => json({});

/**
 * Landing page component for Arrow.dev
 * Shows hero section on initial load, transitions to chat when user starts chatting
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Silk background - fixed positioning behind all content */}
      <ClientOnly fallback={null}>
        {() => <SilkBackground speed={1} scale={0.7} color="#767577ff" noiseIntensity={1} rotation={0} />}
      </ClientOnly>

      {/* Main content - positioned above background */}
      <div className="relative z-10 flex flex-col h-full w-full">
        <Header />
        <ClientOnly fallback={<HeroSection />}>{() => <Chat />}</ClientOnly>
      </div>
    </div>
  );
}
