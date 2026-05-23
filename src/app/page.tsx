import HomeExperience from "@/components/HomeExperience";

type HomePageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  return <HomeExperience initialEntered={params?.view === "cards"} />;
}
