type CollectionPageProps = {
  title: string;
  description: string;
};

export default function CollectionPage({
  title,
  description,
}: CollectionPageProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold mb-4">
          {title}
        </h1>

        <p className="text-gray-600 max-w-2xl">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="border rounded-2xl p-6">
          Product placeholder
        </div>

        <div className="border rounded-2xl p-6">
          Product placeholder
        </div>

        <div className="border rounded-2xl p-6">
          Product placeholder
        </div>

        <div className="border rounded-2xl p-6">
          Product placeholder
        </div>
      </div>
    </main>
  );
}