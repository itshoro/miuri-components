import { Text, Skeleton, Navigation } from "../components/miuri/";

export default function Home() {
  const links = [
    { title: "Home", href: "/" },
    { title: "Projects", href: "/projects" },
    { title: "Dashboard", href: "/dashboard" },
    { title: "Digital Garden", href: "/digital-graden" },
  ];
  return (
    <div className="grid grid-cols-[350px,1fr] mx-auto container">
      <aside className="w-full bg-gray-100 min-h-screen"></aside>
      <main className="p-8 shadow-lg">
        <Text as="h1">Navigation</Text>

        <section className="relative w-full pt-4">
          <article className=" p-4 border rounded-lg resize-x overflow-x-auto max-w-full">
            <Navigation className="w-full px-12" links={links}>
              Logo
            </Navigation>
          </article>
        </section>

        <Text as="h1">Text</Text>
        <section className="relative w-full pt-4">
          <article className=" p-4 border rounded-lg resize-x overflow-x-auto max-w-full">
            <Text as="h2">Test</Text>
          </article>
        </section>

        <Text as="h1">Skeleton</Text>
        <section className="relative w-full pt-4">
          <article className=" p-4 border rounded-lg resize-x overflow-x-auto max-w-full">
            <Skeleton show={true}>
              <Text as="h2">Some Longer Test</Text>
            </Skeleton>
          </article>
        </section>
      </main>
    </div>
  );
}
