import MessagesPageClient from "@/app/components/MessagesPageClient";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MessagesPage({ params }: Props) {
  const { id } = await params;

  return <MessagesPageClient conversationId={id} />;
}