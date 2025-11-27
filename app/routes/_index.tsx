import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { HeroSection } from '~/components/home/HeroSection';

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
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      <Header />
      <ClientOnly fallback={<HeroSection />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
