import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const utils = trpc.useContext();
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id || "hi";

  const trpcTest = trpc.product.getAll.useQuery(20);
  const cartUser = trpc.cart.getUserCart.useQuery(userId);
  const addToCart = trpc.cart.addItem.useMutation();
  // const removeFromCart = trpc.cart.removeItem.useMutation();
  const removeCart = trpc.cart.removeCart.useMutation();
  const removeOne = trpc.cart.removeOne.useMutation({
    async onMutate() {
      await utils.cart.getUserCart.cancel();
      const prevCart = utils.cart.getUserCart.getData();
      if (prevCart) {
        console.log(prevCart);
      }

      // const queryCache = queryClient.getQueryCache();
      // const queryKeys = queryCache.getAll();
      // console.log(queryClient.getQueryData());
    },

    onSettled() {
      utils.cart.getUserCart.invalidate();
    },
  });

  const addToCartHandler = (id: string) => {
    return addToCart.mutate({ userId, id, quantity: 5 });
  };

  // const deleteAll = (productId: string) => {
  //   return removeFromCart.mutate({ productId, userId });
  // };

  const deleteOne = (id: string) => {
    return removeOne.mutate(id);
  };

  const deleteCart = () => {
    return removeCart.mutate(userId);
  };

  // const trpcCategory = trpc.category.getOneCategory.useQuery("Kindle");
  // const trpcCategories = trpc.category.getAllCategories.useQuery();
  // const trpcTest2 = trpc.product.getOne.useQuery("clb3p3i59000055f8b7gejbm7");
  if (cartUser?.data?.items[0]) {
    const totalPrice =
      cartUser?.data?.items[0]?.quantity *
      Number(cartUser?.data?.items[0]?.product.price);
    console.log(totalPrice);
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex gap-4">
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => signOut() : () => signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={deleteCart}
          >
            Delete Cart
          </button>
        </div>
        <div className="flex w-screen items-end gap-4 overflow-x-scroll px-12 py-12">
          {trpcTest.data?.map((el) => {
            return (
              <div
                className="flex flex-col items-center gap-4 text-xl text-white"
                key={el.id}
              >
                <span>{el.id}</span>
                <span>{el.title}</span>
                <Image alt={el.title} src={el.image} width={200} height={200} />
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={() => addToCartHandler(el.id)}
                >
                  Add to Cart
                </button>
                <button
                  className="rounded-full bg-red-700 px-10 py-3 font-semibold text-white no-underline transition hover:bg-red-800"
                  onClick={() => deleteOne(el.id)}
                >
                  Remove One
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex w-screen items-end gap-4 overflow-x-scroll px-12 py-12">
          {cartUser.data?.items.map((el) => {
            return (
              <div
                key={el.id}
                className="flex flex-col gap-3 text-xl text-white"
              >
                <div className="flex gap-2">
                  <h6>{el.product.title}</h6>
                  <span>{el.quantity}</span>
                </div>
                <Image
                  alt={el.product.title}
                  src={el.product.image}
                  width={200}
                  height={200}
                />

                <button
                  className="rounded-full bg-red-700 px-10 py-3 font-semibold text-white no-underline transition hover:bg-red-800"
                  onClick={() => deleteOne(el.id)}
                >
                  Remove One
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Home;
