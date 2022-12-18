import { CategoryList } from "../../components/CategoryList";

const CategoriesPage = () => {
  return (
    <section className="mt-32 h-fit py-4 px-8">
      <h2 className="mb-8 text-3xl font-bold ">All Categories</h2>
      <CategoryList />
    </section>
  );
};

export default CategoriesPage;
