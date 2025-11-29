import { notFound } from "next/navigation";
import CharacterProfileClient from "@/components/CharacterProfileClient";
import { CHARACTER_PROFILES } from "@/data/characterProfiles";

export default function CharacterProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profile = CHARACTER_PROFILES[params.id];
  if (!profile) return notFound();
  return <CharacterProfileClient profile={profile} />;
}
