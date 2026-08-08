import MessagesPageClient from "@/app/components/MessagesPageClient";

type Props = {
  params: {
    id: string;
  };
};

export default function MessagesPage({ params }: Props) {
  const { id } = params;
  return <MessagesPageClient conversationId={id} />;
}
